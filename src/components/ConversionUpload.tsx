// src/components/ConversionUpload.tsx
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw,
  X,
  Layers,
  Scissors,
  RotateCw,
  Lock,
  ShieldCheck,
  ArrowRight,
  Archive,
  Image as ImageIcon,
  Sliders,
  Type,
  Trash2
} from "lucide-react";
import {
  mergePDFs,
  splitPDF,
  rotatePDF,
  deletePDFPages,
  watermarkPDF,
  addPageNumbers,
  imagesToPDF,
  downloadBlob
} from "@/services/pdfTools";
import {
  compressPDF,
  convertPDFToWord,
  convertPDFToTxt,
  convertPDFToImages,
  CompressionResult
} from "@/services/backendApi";
import {
  compressImage,
  resizeImage,
  convertImageFormat,
  ImageCompressionResult
} from "@/services/imageTools";
import { toast } from "sonner";
import AdModal from "./AdModal";

interface ConversionUploadProps {
  toolType?: string;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const ConversionUpload = ({ toolType = "pdf" }: ConversionUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState("docx");
  const [dragActive, setDragActive] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");

  // Result state
  const [localBlobResult, setLocalBlobResult] = useState<{ blob: Blob; fileName: string } | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
    savedPercent: number;
  } | null>(null);

  // Tool-specific options
  const [compressionLevel, setCompressionLevel] = useState<"low" | "recommended" | "extreme">("recommended");
  const [imageQuality, setImageQuality] = useState(0.75);
  const [pageRange, setPageRange] = useState("1-3");
  const [rotateAngle, setRotateAngle] = useState(90);
  const [pagesToDelete, setPagesToDelete] = useState("1");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [pageNumberStart, setPageNumberStart] = useState(1);
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);

  // Daily conversions
  const [dailyConversions, setDailyConversions] = useState(0);
  const [dailyLimit] = useState(10);
  const [showAdModal, setShowAdModal] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Mode detections
  const isMergeMode = toolType === "merge";
  const isSplitMode = toolType === "split";
  const isRotateMode = toolType === "rotate";
  const isCompressMode = toolType === "compress" || toolType === "compress-pdf";
  const isWordMode = toolType === "docx" || toolType === "pdf-to-word";
  const isTxtMode = toolType === "txt" || toolType === "pdf-to-txt";
  const isPdfToImages = toolType === "pdf-to-jpg" || toolType === "pdf-to-png";
  const isImagesToPdf = toolType === "images-to-pdf" || toolType === "jpg-to-pdf";
  const isCompressImage = toolType === "compress-image";
  const isResizeImage = toolType === "resize-image";
  const isDeletePages = toolType === "delete-pages";
  const isWatermark = toolType === "watermark";
  const isPageNumbers = toolType === "page-numbers";

  const isClientSideOnly =
    isMergeMode ||
    isSplitMode ||
    isRotateMode ||
    isImagesToPdf ||
    isCompressImage ||
    isResizeImage ||
    isDeletePages ||
    isWatermark ||
    isPageNumbers;

  useEffect(() => {
    if (toolType === "docx" || toolType === "pdf-to-word") setOutputFormat("docx");
    else if (toolType === "xlsx" || toolType === "pdf-to-excel") setOutputFormat("xlsx");
    else if (toolType === "pptx" || toolType === "pdf-to-powerpoint") setOutputFormat("pptx");

    const today = new Date().toISOString().split("T")[0];
    const storedDate = localStorage.getItem("pdflex_conversions_date");
    const storedCount = localStorage.getItem("pdflex_conversions_count");

    if (storedDate === today && storedCount) {
      setDailyConversions(parseInt(storedCount, 10));
    } else {
      localStorage.setItem("pdflex_conversions_date", today);
      localStorage.setItem("pdflex_conversions_count", "0");
      setDailyConversions(0);
    }
  }, [toolType]);

  const validateFile = (file: File): string | null => {
    if (file.size === 0) {
      return `"${file.name}" is empty (0 bytes). Please select a valid document.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `"${file.name}" exceeds the 25 MB limit. PDFlex supports files up to 25 MB.`;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (isCompressImage || isResizeImage || isImagesToPdf) {
      const imgExts = ["jpg", "jpeg", "png", "webp"];
      if (!ext || !imgExts.includes(ext)) {
        return `Please upload an image file (JPG, PNG, or WEBP).`;
      }
    } else if (
      isMergeMode ||
      isSplitMode ||
      isRotateMode ||
      isCompressMode ||
      isWordMode ||
      isTxtMode ||
      isPdfToImages ||
      isDeletePages ||
      isWatermark ||
      isPageNumbers
    ) {
      if (ext !== "pdf") return `Only PDF documents are supported for this tool.`;
    }
    return null;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleIncomingFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleIncomingFiles(Array.from(e.target.files));
    }
  };

  const handleIncomingFiles = (incoming: File[]) => {
    const validFiles: File[] = [];
    for (const f of incoming) {
      const error = validateFile(f);
      if (error) {
        toast.error(error);
        return;
      }
      validFiles.push(f);
    }

    if (isMergeMode || isImagesToPdf) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    } else {
      setSelectedFiles([validFiles[0]]);
    }
    setLocalBlobResult(null);
    setCompressionStats(null);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetAll = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setSelectedFiles([]);
    setLocalBlobResult(null);
    setCompressionStats(null);
    setConverting(false);
    setProgressPercent(0);
    setProgressMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const recordSuccessfulConversion = () => {
    const today = new Date().toISOString().split("T")[0];
    const newCount = dailyConversions + 1;
    setDailyConversions(newCount);
    localStorage.setItem("pdflex_conversions_date", today);
    localStorage.setItem("pdflex_conversions_count", newCount.toString());
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select a file to process.");
      return;
    }

    setConverting(true);
    setProgressPercent(15);
    setProgressMessage("Starting processing...");
    setLocalBlobResult(null);
    setCompressionStats(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (isMergeMode) {
        if (selectedFiles.length < 2) throw new Error("Please select at least 2 PDF files to merge.");
        setProgressPercent(45);
        setProgressMessage("Merging documents in your browser...");
        const res = await mergePDFs(selectedFiles);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Merged successfully!");
      } else if (isSplitMode) {
        setProgressPercent(50);
        setProgressMessage("Extracting pages in your browser...");
        const res = await splitPDF(selectedFiles[0], pageRange);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Pages extracted successfully!");
      } else if (isRotateMode) {
        setProgressPercent(50);
        setProgressMessage(`Rotating pages by ${rotateAngle}° in your browser...`);
        const res = await rotatePDF(selectedFiles[0], rotateAngle);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Rotated successfully!");
      } else if (isDeletePages) {
        setProgressPercent(50);
        setProgressMessage("Removing selected pages in your browser...");
        const res = await deletePDFPages(selectedFiles[0], pagesToDelete);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Pages removed successfully!");
      } else if (isWatermark) {
        setProgressPercent(50);
        setProgressMessage("Applying watermark in your browser...");
        const res = await watermarkPDF(selectedFiles[0], watermarkText);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Watermark applied successfully!");
      } else if (isPageNumbers) {
        setProgressPercent(50);
        setProgressMessage("Adding page numbers in your browser...");
        const res = await addPageNumbers(selectedFiles[0], pageNumberStart);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Page numbers added successfully!");
      } else if (isImagesToPdf) {
        setProgressPercent(50);
        setProgressMessage("Converting images into single PDF in browser...");
        const res = await imagesToPDF(selectedFiles);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("PDF created from images!");
      } else if (isCompressImage) {
        setProgressPercent(60);
        setProgressMessage("Compressing image in browser canvas...");
        const res = await compressImage(selectedFiles[0], imageQuality);
        setLocalBlobResult({ blob: res.blob, fileName: res.fileName });
        setCompressionStats({
          originalSize: res.originalSize,
          compressedSize: res.compressedSize,
          savedPercent: res.savedPercent,
        });
        downloadBlob(res.blob, res.fileName);
        toast.success(`Image compressed! Saved ${res.savedPercent}%`);
      } else if (isResizeImage) {
        setProgressPercent(60);
        setProgressMessage("Resizing image in browser canvas...");
        const res = await resizeImage(selectedFiles[0], resizeWidth, resizeHeight, true);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Image resized successfully!");
      } else if (isCompressMode) {
        // PyMuPDF open-source compression backend
        setProgressPercent(40);
        setProgressMessage(`Optimizing streams (${compressionLevel} level)...`);
        const res = await compressPDF(selectedFiles[0], compressionLevel, controller.signal);
        setLocalBlobResult({ blob: res.blob, fileName: res.fileName });
        setCompressionStats({
          originalSize: res.originalSize,
          compressedSize: res.compressedSize,
          savedPercent: res.savedPercent,
        });
        downloadBlob(res.blob, res.fileName);
        toast.success(`PDF compressed! Saved ${res.savedPercent}%`);
      } else if (isWordMode) {
        // pdf2docx open-source converter backend
        setProgressPercent(35);
        setProgressMessage("Reconstructing document layout into editable Word...");
        const res = await convertPDFToWord(selectedFiles[0], controller.signal);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Converted to Word (.docx) successfully!");
      } else if (isTxtMode) {
        // PyMuPDF text extraction backend
        setProgressPercent(50);
        setProgressMessage("Extracting text from PDF...");
        const res = await convertPDFToTxt(selectedFiles[0], controller.signal);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Text extracted successfully!");
      } else if (isPdfToImages) {
        // PyMuPDF PDF to Images backend
        const fmt = toolType === "pdf-to-png" ? "png" : "jpg";
        setProgressPercent(50);
        setProgressMessage(`Rendering PDF pages to ${fmt.toUpperCase()}...`);
        const res = await convertPDFToImages(selectedFiles[0], fmt, controller.signal);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Rendered images downloaded successfully!");
      } else {
        // Default PDF to Word fallback
        setProgressPercent(40);
        setProgressMessage("Processing document...");
        const res = await convertPDFToWord(selectedFiles[0], controller.signal);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Processed successfully!");
      }

      recordSuccessfulConversion();
    } catch (err: any) {
      if (controller.signal.aborted) {
        toast.info("Processing cancelled.");
      } else {
        toast.error(err.message || "An error occurred during processing.");
      }
    } finally {
      setConverting(false);
      abortControllerRef.current = null;
    }
  };

  const primaryFile = selectedFiles[0];

  return (
    <>
      <AdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onAdComplete={() => {
          setDailyConversions(0);
          localStorage.setItem("pdflex_conversions_count", "0");
          setShowAdModal(false);
        }}
      />

      <div className="max-w-4xl mx-auto px-4">
        {/* Main Processing Card */}
        <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              {/* Left Column: Upload Dropzone */}
              <div className="flex-1 w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple={isMergeMode || isImagesToPdf}
                  onChange={handleFileChange}
                  accept={
                    isCompressImage || isResizeImage || isImagesToPdf
                      ? ".jpg,.jpeg,.png,.webp"
                      : ".pdf"
                  }
                />

                <div
                  className={`relative min-h-[320px] border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all ${
                    dragActive
                      ? "border-blue-500 bg-blue-50/50 scale-[1.01]"
                      : selectedFiles.length > 0
                      ? "border-slate-300 bg-slate-50/50"
                      : "border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/20"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedFiles.length === 0 ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer text-center flex flex-col items-center justify-center w-full h-full py-6"
                    >
                      <div className="w-16 h-16 mb-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                        {isMergeMode ? (
                          <Layers className="w-8 h-8" />
                        ) : isSplitMode ? (
                          <Scissors className="w-8 h-8" />
                        ) : isRotateMode ? (
                          <RotateCw className="w-8 h-8" />
                        ) : isCompressMode ? (
                          <Archive className="w-8 h-8" />
                        ) : isCompressImage || isResizeImage ? (
                          <ImageIcon className="w-8 h-8" />
                        ) : isWatermark ? (
                          <Type className="w-8 h-8" />
                        ) : isDeletePages ? (
                          <Trash2 className="w-8 h-8" />
                        ) : (
                          <Upload className="w-8 h-8" />
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {isMergeMode
                          ? "Select PDF files to merge"
                          : isSplitMode
                          ? "Select PDF file to split"
                          : isRotateMode
                          ? "Select PDF file to rotate"
                          : isCompressMode
                          ? "Select PDF file to compress"
                          : isCompressImage
                          ? "Select image to compress"
                          : isResizeImage
                          ? "Select image to resize"
                          : isImagesToPdf
                          ? "Select images to convert to PDF"
                          : "Upload document to process"}
                      </h3>

                      <p className="text-slate-500 text-sm max-w-xs mb-4">
                        {isClientSideOnly
                          ? "Processed 100% locally in your browser. Files never leave your device."
                          : "Processed securely with open-source engines and auto-removed."}
                      </p>

                      <Button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl px-5 h-10 shadow-sm"
                      >
                        Browse Files
                      </Button>

                      <span className="text-slate-400 text-xs mt-3">Up to 25 MB · Free open-source engine</span>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center justify-center text-center">
                      {isMergeMode || isImagesToPdf ? (
                        <div className="w-full space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {selectedFiles.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-left shadow-xs"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                                <span className="text-sm font-medium truncate text-slate-800 max-w-[200px]">
                                  {file.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-slate-500 font-mono">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeFile(idx)}
                                  className="w-6 h-6 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 pt-2"
                          >
                            <FileText className="w-4 h-4" /> Add another file
                          </button>
                        </div>
                      ) : (
                        <div className="w-full flex flex-col items-center">
                          <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-3">
                            {isCompressImage || isResizeImage ? (
                              <ImageIcon className="w-7 h-7" />
                            ) : (
                              <FileText className="w-7 h-7" />
                            )}
                          </div>

                          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl px-4 py-3 mb-2 shadow-xs">
                            <p className="text-sm font-semibold text-slate-900 truncate">{primaryFile.name}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                              {(primaryFile.size / 1024 / 1024).toFixed(2)} MB · Ready to process
                            </p>
                          </div>

                          <div className="flex items-center gap-4 text-xs">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                              Choose different file
                            </button>
                            <span className="text-slate-300">•</span>
                            <button
                              type="button"
                              onClick={resetAll}
                              className="text-slate-500 hover:text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Tool-specific interactive controls */}
                      {isCompressMode && (
                        <div className="w-full max-w-xs mt-4 text-left">
                          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                            Compression Level:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(["low", "recommended", "extreme"] as const).map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => setCompressionLevel(lvl)}
                                className={`py-2 px-2.5 rounded-lg border text-xs font-semibold capitalize transition-all ${
                                  compressionLevel === lvl
                                    ? "border-blue-600 bg-blue-50 text-blue-700"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                }`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {isCompressImage && (
                        <div className="w-full max-w-xs mt-4 text-left">
                          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                            <span>Image Quality:</span>
                            <span className="font-mono text-blue-600">{Math.round(imageQuality * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="0.95"
                            step="0.05"
                            value={imageQuality}
                            onChange={(e) => setImageQuality(parseFloat(e.target.value))}
                            className="w-full accent-blue-600"
                          />
                        </div>
                      )}

                      {isSplitMode && (
                        <div className="w-full max-w-xs mt-4 text-left">
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Pages to extract (e.g. 1-3, 5):
                          </label>
                          <input
                            type="text"
                            value={pageRange}
                            onChange={(e) => setPageRange(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="1-3, 5"
                          />
                        </div>
                      )}

                      {isDeletePages && (
                        <div className="w-full max-w-xs mt-4 text-left">
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Pages to delete (e.g. 1, 4-6):
                          </label>
                          <input
                            type="text"
                            value={pagesToDelete}
                            onChange={(e) => setPagesToDelete(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="1, 4-6"
                          />
                        </div>
                      )}

                      {isWatermark && (
                        <div className="w-full max-w-xs mt-4 text-left">
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Watermark text:
                          </label>
                          <input
                            type="text"
                            value={watermarkText}
                            onChange={(e) => setWatermarkText(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="CONFIDENTIAL"
                          />
                        </div>
                      )}

                      {isRotateMode && (
                        <div className="w-full max-w-xs mt-4 text-left">
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Rotation angle:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[90, 180, 270].map((angle) => (
                              <button
                                key={angle}
                                type="button"
                                onClick={() => setRotateAngle(angle)}
                                className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                                  rotateAngle === angle
                                    ? "border-blue-600 bg-blue-50 text-blue-700"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                }`}
                              >
                                +{angle}°
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Truthful Privacy Badge */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                  {isClientSideOnly ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Processed 100% locally in your browser. Files never leave your device.</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Processed securely with open-source engines and automatically removed.</span>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Action, Progress & Result */}
              <div className="w-full md:w-72 shrink-0 flex flex-col justify-between self-stretch">
                <div className="space-y-5">
                  {/* Tool summary */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-1">Processing Engine:</span>
                    {isClientSideOnly ? (
                      <span>Client-side WebAssembly & Canvas. Zero upload delay, zero server storage.</span>
                    ) : (
                      <span>Open-source Python engine (PyMuPDF & pdf2docx). Zero per-conversion API costs.</span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {converting && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                        <span className="truncate pr-2">{progressMessage || "Processing..."}</span>
                        <span className="font-mono text-blue-600">{progressPercent}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={resetAll}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold pt-1"
                      >
                        Cancel processing
                      </button>
                    </div>
                  )}

                  {/* Compression Stats Badge */}
                  {compressionStats && (
                    <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1 text-xs">
                      <div className="font-bold flex items-center justify-between">
                        <span>Compression Result:</span>
                        <span className="text-emerald-700 font-extrabold">-{compressionStats.savedPercent}%</span>
                      </div>
                      <div className="flex justify-between text-slate-600 pt-0.5">
                        <span>Original: {(compressionStats.originalSize / 1024 / 1024).toFixed(2)} MB</span>
                        <span>→</span>
                        <span className="font-bold text-slate-900">
                          {(compressionStats.compressedSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Download Result Card */}
                  {localBlobResult && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                      <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Document Ready!</span>
                      </div>
                      <p className="text-xs text-emerald-700 truncate font-mono">
                        {localBlobResult.fileName}
                      </p>
                      <button
                        type="button"
                        onClick={() => downloadBlob(localBlobResult.blob, localBlobResult.fileName)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
                      >
                        <Download className="w-4 h-4" /> Download Result
                      </button>
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                <div className="mt-6">
                  <Button
                    onClick={handleProcess}
                    disabled={selectedFiles.length === 0 || converting}
                    className={`w-full h-12 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
                      selectedFiles.length > 0 && !converting
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    }`}
                  >
                    {converting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {isMergeMode
                            ? "Merge PDFs"
                            : isSplitMode
                            ? "Split PDF"
                            : isRotateMode
                            ? "Rotate PDF"
                            : isCompressMode
                            ? "Compress PDF"
                            : isCompressImage
                            ? "Compress Image"
                            : isResizeImage
                            ? "Resize Image"
                            : isImagesToPdf
                            ? "Convert to PDF"
                            : isDeletePages
                            ? "Delete Pages"
                            : isWatermark
                            ? "Apply Watermark"
                            : isPageNumbers
                            ? "Add Numbers"
                            : isTxtMode
                            ? "Extract Text"
                            : isWordMode
                            ? "Convert to Word"
                            : "Process Document"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ConversionUpload;
