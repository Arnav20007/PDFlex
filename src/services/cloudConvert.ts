// src/services/cloudConvert.ts
// Secure client conversion service routing through /api/convert proxy.
// No API keys are bundled or exposed in client-side code.

export interface ConversionProgress {
  stage: 'initiating' | 'uploading' | 'converting' | 'exporting' | 'completed' | 'error';
  percent: number;
  message: string;
}

export interface ConversionResult {
  downloadUrl: string;
  fileName: string;
  fileSize?: number;
}

export async function convertWithCloudConvert(
  file: File,
  outputFormat: string,
  onProgress?: (progress: ConversionProgress) => void,
  abortSignal?: AbortSignal
): Promise<ConversionResult> {
  // 1. Create Job via serverless proxy
  onProgress?.({
    stage: 'initiating',
    percent: 10,
    message: 'Preparing secure conversion pipeline...'
  });

  if (abortSignal?.aborted) {
    throw new Error('Conversion was cancelled.');
  }

  const createJobRes = await fetch('/api/convert?action=create-job', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      outputFormat: outputFormat.toLowerCase().trim(),
      fileName: file.name
    }),
    signal: abortSignal
  });

  if (!createJobRes.ok) {
    const errData = await createJobRes.json().catch(() => ({}));
    throw new Error(errData?.error || `Failed to initiate conversion job (HTTP ${createJobRes.status})`);
  }

  const { jobId, uploadForm } = await createJobRes.json();

  if (!uploadForm?.url) {
    throw new Error('Conversion service did not return a valid upload target.');
  }

  // 2. Direct upload to CloudConvert's presigned endpoint
  onProgress?.({
    stage: 'uploading',
    percent: 30,
    message: 'Uploading document to secure processing engine...'
  });

  if (abortSignal?.aborted) {
    throw new Error('Conversion was cancelled.');
  }

  const formData = new FormData();
  if (uploadForm.parameters) {
    for (const [key, val] of Object.entries(uploadForm.parameters)) {
      formData.append(key, val as string);
    }
  }
  formData.append('file', file, file.name);

  const uploadRes = await fetch(uploadForm.url, {
    method: 'POST',
    body: formData,
    signal: abortSignal
  });

  if (!uploadRes.ok && uploadRes.status !== 201 && uploadRes.status !== 204) {
    throw new Error(`Failed to upload file to processing engine (HTTP ${uploadRes.status})`);
  }

  onProgress?.({
    stage: 'converting',
    percent: 55,
    message: `Converting document to .${outputFormat.toUpperCase()}...`
  });

  // 3. Poll job status via proxy
  const maxAttempts = 60; // 60 * 2s = 120s max
  let attempts = 0;

  while (attempts < maxAttempts) {
    if (abortSignal?.aborted) {
      throw new Error('Conversion was cancelled.');
    }

    await new Promise((res) => setTimeout(res, 2000));
    attempts++;

    const statusRes = await fetch(`/api/convert?action=status&jobId=${encodeURIComponent(jobId)}`, {
      signal: abortSignal
    });

    if (!statusRes.ok) {
      continue;
    }

    const statusData = await statusRes.json();

    if (statusData.status === 'error') {
      throw new Error(statusData.error || 'Conversion encountered an error on the processing server.');
    }

    if (statusData.status === 'processing') {
      const taskPercent = statusData.percent || Math.min(85, 55 + attempts * 3);
      onProgress?.({
        stage: 'converting',
        percent: Math.min(88, Math.round(taskPercent)),
        message: 'Converting and retaining layout...'
      });
    }

    if (statusData.status === 'finished') {
      onProgress?.({
        stage: 'completed',
        percent: 100,
        message: 'Conversion completed successfully!'
      });

      return {
        downloadUrl: statusData.downloadUrl,
        fileName: statusData.fileName,
        fileSize: statusData.fileSize
      };
    }
  }

  throw new Error('Conversion timed out after 2 minutes. Please try a smaller file or retry.');
}
