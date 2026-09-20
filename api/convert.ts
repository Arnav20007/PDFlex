// api/convert.ts
// Serverless handler for CloudConvert integration (Vercel / Node backend)
// Keeps CLOUDCONVERT_API_KEY secure and unexposed to client bundles.

import type { IncomingMessage, ServerResponse } from 'http';

const ALLOWED_FORMATS = new Set([
  'docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt', 'pdf', 'html', 'txt', 'png', 'jpg'
]);

export default async function handler(req: any, res: any) {
  // CORS headers for production and local dev
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const apiKey = process.env.CLOUDCONVERT_API_KEY?.replace(/["']/g, '').trim();
  if (!apiKey) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Server configuration error: CLOUDCONVERT_API_KEY is not set.' }));
    return;
  }

  try {
    const url = new URL(req.url || '', `http://${req.headers?.host || 'localhost'}`);
    const action = url.searchParams.get('action');

    // 1. Create Job Action
    if (action === 'create-job' && req.method === 'POST') {
      let body: any = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
      }

      const outputFormat = (body?.outputFormat || '').toLowerCase().trim();
      if (!ALLOWED_FORMATS.has(outputFormat)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: `Unsupported output format: ${outputFormat}` }));
        return;
      }

      const jobPayload = {
        tasks: {
          'import-file': {
            operation: 'import/upload'
          },
          'convert-file': {
            operation: 'convert',
            input: 'import-file',
            output_format: outputFormat
          },
          'export-file': {
            operation: 'export/url',
            input: 'convert-file',
            inline: false,
            archive_multiple_files: false
          }
        }
      };

      const response = await fetch('https://api.cloudconvert.com/v2/jobs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobPayload)
      });

      const responseData = await response.json().catch(() => ({}));
      if (!response.ok) {
        res.statusCode = response.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: responseData?.message || 'Failed to create CloudConvert job' }));
        return;
      }

      const job = responseData.data;
      const uploadTask = job.tasks.find((t: any) => t.name === 'import-file' || t.operation === 'import/upload');
      if (!uploadTask || !uploadTask.result?.form) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'CloudConvert did not return a valid upload form.' }));
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        jobId: job.id,
        uploadForm: uploadTask.result.form
      }));
      return;
    }

    // 2. Status Polling Action
    if (action === 'status' && req.method === 'GET') {
      const jobId = url.searchParams.get('jobId');
      if (!jobId) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing jobId parameter' }));
        return;
      }

      const response = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        res.statusCode = response.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Failed to fetch job status from CloudConvert' }));
        return;
      }

      const currentJobData = await response.json();
      const currentJob = currentJobData.data;

      if (currentJob.status === 'error') {
        const failedTask = currentJob.tasks.find((t: any) => t.status === 'error');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          status: 'error',
          error: failedTask?.message || 'Conversion failed on CloudConvert.'
        }));
        return;
      }

      if (currentJob.status === 'processing') {
        const convertTask = currentJob.tasks.find((t: any) => t.operation === 'convert');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          status: 'processing',
          percent: convertTask?.percent || 50
        }));
        return;
      }

      if (currentJob.status === 'finished') {
        const exportTask = currentJob.tasks.find((t: any) => t.operation === 'export/url');
        const fileObj = exportTask?.result?.files?.[0];

        if (!fileObj?.url) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'error',
            error: 'Export completed but no download URL was found.'
          }));
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          status: 'finished',
          downloadUrl: fileObj.url,
          fileName: fileObj.filename || 'converted-document',
          fileSize: fileObj.size
        }));
        return;
      }

      // Waiting or other state
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        status: currentJob.status || 'waiting',
        percent: 20
      }));
      return;
    }

    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Unknown action or method' }));
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err?.message || 'Internal server error' }));
  }
}
