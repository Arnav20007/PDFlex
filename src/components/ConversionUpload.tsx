// src/components/ConversionUpload.tsx
// 100% Browser-First Processing Component (Zero Backend / Zero API Dependency)

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
  ArrowRight,
  Archive,
  Image as ImageIcon,
  Sliders,
  Type,
  Trash2,
  Crop,
  FlipHorizontal,
  FlipVertical,
  Copy,
  Check,
  Code
} from "lucide-react";
import {
  mergePDFs,
  splitPDF,
  rotatePDF,
  deletePDFPages,
  watermarkPDF,
  addPageNumbers,
  imagesToPDF,
  compressPDF,
  downloadBlob
} from "@/services/pdfTools";
import {
  compressImage,
  resizeImage,
  convertImageFormat,
  cropImage,
  rotateImage,
  flipImage,
  imageToBase64,
  base64ToImage,
  getImageDimensions
} from "@/services/imageTools";
import { toast } from "sonner";
import AdModal from "./AdModal";

interface ConversionUploadProps {
  toolType?: string;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export const ConversionUpload = ({ toolType = "merge" }: ConversionUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
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
  const [resizeStats, setResizeStats] = useState<{
    originalWidth: number;
    originalHeight: number;
    newWidth: number;
    newHeight: number;
  } | null>(null);

  // Tool-specific options
  const [imageQuality, setImageQuality] = useState(0.75);
  const [pageRange, setPageRange] = useState("1-3");
  const [rotateAngle, setRotateAngle] = useState(90);
  const [pagesToDelete, setPagesToDelete] = useState("1");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [pageNumberStart, setPageNumberStart] = useState(1);
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);

  // Image Cropper options
  const [cropPreset, setCropPreset] = useState<"1:1" | "4:3" | "16:9" | "custom">("1:1");

  // Image Flipper options
  const [flipDirection, setFlipDirection] = useState<"horizontal" | "vertical" | "both">("horizontal");

  // Base64 options
  const [base64Text, setBase64Text] = useState("");
  const [copiedBase64, setCopiedBase64] = useState(false);

  // Daily conversions (offline tracker)
  const [dailyConversions, setDailyConversions] = useState(0);
  const [dailyLimit] = useState(25);
  const [showAdModal, setShowAdModal] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tool Categories
  const isPdfTool = [
    "merge",
    "split",
    "rotate",
    "delete-pages",
    "watermark",
    "page-numbers",
    "compress-pdf",
    "compress"
  ].includes(toolType);

  const isImagesToPdf = toolType === "images-to-pdf" || toolType === "jpg-to-pdf";
  const isCompressImage = toolType === "compress-image";
  const isResizeImage = toolType === "resize-image";
  const isCropper = toolType === "image-cropper";
  const isRotator = toolType === "image-rotator";
  const isFlipper = toolType === "image-flipper";
  const isImageToBase64 = toolType === "image-to-base64";
  const isBase64ToImage = toolType === "base64-to-image";

  // Format conversions
  const isJpgToPng = toolType === "jpg-to-png";
  const isPngToJpg = toolType === "png-to-jpg";
  const isWebpToJpg = toolType === "webp-to-jpg";
  const isJpgToWebp = toolType === "jpg-to-webp";
  const isPngToWebp = toolType === "png-to-webp";
  const isGifToPng = toolType === "gif-to-png";
  const isBmpToJpg = toolType === "bmp-to-jpg";

  const isImageFormatConverter =
    isJpgToPng ||
    isPngToJpg ||
    isWebpToJpg ||
    isJpgToWebp ||
    isPngToWebp ||
    isGifToPng ||
    isBmpToJpg;

  // Legacy unsupported notice (e.g. pdf-to-word)
  const isLegacyServerTool =
    toolType === "pdf-to-word" ||
    toolType === "docx" ||
    toolType === "pdf-to-excel" ||
    toolType === "xlsx" ||
    toolType === "pdf-to-ppt" ||
    toolType === "pptx" ||
    toolType === "pdf-to-txt" ||
    toolType === "pdf-to-jpg";

  useEffect(() => {
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
  }, []);

  // Cleanup object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    };
  }, [filePreviewUrl]);

  const validateFile = (file: File): string | null => {
    if (file.size === 0) {
      return `"${file.name}" is empty (0 bytes). Please choose a valid file.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `"${file.name}" exceeds the 25 MB limit for local browser processing.`;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (isPdfTool) {
      if (ext !== "pdf") return `Please select a PDF document.`;
    } else if (
      isImagesToPdf ||
      isCompressImage ||
      isResizeImage ||
      isCropper ||
      isRotator ||
      isFlipper ||
      isImageToBase64 ||
      isImageFormatConverter
    ) {
      const allowedImgExts = ["jpg", "jpeg", "png", "webp", "gif", "bmp"];
      if (!ext || !allowedImgExts.includes(ext)) {
        return `Please select an image file (JPG, PNG, WebP, GIF, or BMP).`;
      }
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

  const handleIncomingFiles = async (incoming: File[]) => {
    const validFiles: File[] = [];
    for (const f of incoming) {
      const error = validateFile(f);
      if (error) {
        toast.error(error);
        return;
      }
      validFiles.push(f);
    }

    if (validFiles.length === 0) return;

    if (toolType === "merge" || isImagesToPdf) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    } else {
      setSelectedFiles([validFiles[0]]);
      const first = validFiles[0];

      // Generate preview for image tools
      if (first.type.startsWith("image/")) {
        if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
        const url = URL.createObjectURL(first);
        setFilePreviewUrl(url);

        try {
          const dims = await getImageDimensions(first);
          setOriginalDimensions(dims);
          setResizeWidth(dims.width);
          setResizeHeight(dims.height);
        } catch {
          // ignore dimension load errors
        }
      }
    }

    setLocalBlobResult(null);
    setCompressionStats(null);
    setResizeStats(null);
    setBase64Text("");
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (selectedFiles.length <= 1) {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
      setOriginalDimensions(null);
    }
  };

  const resetAll = () => {
    setSelectedFiles([]);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);
    setLocalBlobResult(null);
    setCompressionStats(null);
    setResizeStats(null);
    setConverting(false);
    setProgressPercent(0);
    setProgressMessage("");
    setBase64Text("");
    setOriginalDimensions(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const recordConversion = () => {
    const today = new Date().toISOString().split("T")[0];
    const newCount = dailyConversions + 1;
    setDailyConversions(newCount);
    localStorage.setItem("pdflex_conversions_date", today);
    localStorage.setItem("pdflex_conversions_count", newCount.toString());
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0 && !isBase64ToImage) {
      toast.error("Please select a file to process.");
      return;
    }

    setConverting(true);
    setProgressPercent(20);
    setProgressMessage("Starting browser-local processing...");
    setLocalBlobResult(null);
    setCompressionStats(null);
    setResizeStats(null);

    try {
      const file = selectedFiles[0];

      // 1. PDF Tools
      if (toolType === "merge") {
        if (selectedFiles.length < 2) throw new Error("Please select at least 2 PDF files to merge.");
        setProgressPercent(50);
        setProgressMessage("Merging documents inside browser memory...");
        const res = await mergePDFs(selectedFiles);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Merged successfully!");
      } else if (toolType === "split") {
        setProgressPercent(50);
        setProgressMessage("Extracting pages in your browser...");
        const res = await splitPDF(file, pageRange);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Pages extracted successfully!");
      } else if (toolType === "rotate") {
        setProgressPercent(50);
        setProgressMessage(`Rotating PDF pages by ${rotateAngle}°...`);
        const res = await rotatePDF(file, rotateAngle);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Rotated successfully!");
      } else if (toolType === "delete-pages") {
        setProgressPercent(50);
        setProgressMessage("Removing pages in browser...");
        const res = await deletePDFPages(file, pagesToDelete);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Pages deleted successfully!");
      } else if (toolType === "watermark") {
        setProgressPercent(50);
        setProgressMessage("Applying watermark in browser...");
        const res = await watermarkPDF(file, watermarkText);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Watermark applied successfully!");
      } else if (toolType === "page-numbers") {
        setProgressPercent(50);
        setProgressMessage("Adding page numbers in browser...");
        const res = await addPageNumbers(file, pageNumberStart);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Page numbers added!");
      } else if (toolType === "compress-pdf" || toolType === "compress") {
        setProgressPercent(50);
        setProgressMessage("Compressing PDF object streams in browser...");
        const res = await compressPDF(file);
        setLocalBlobResult({ blob: res.blob, fileName: res.fileName });
        setCompressionStats({
          originalSize: res.originalSize,
          compressedSize: res.compressedSize,
          savedPercent: res.savedPercent
        });
        downloadBlob(res.blob, res.fileName);
        toast.success(`PDF compressed! Saved ${res.savedPercent}%`);
      } else if (isImagesToPdf) {
        setProgressPercent(50);
        setProgressMessage("Converting images into single PDF document...");
        const res = await imagesToPDF(selectedFiles);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("PDF created from images!");
      }

      // 2. Image Optimization & Editing
      else if (isCompressImage) {
        setProgressPercent(60);
        setProgressMessage("Optimizing image in browser canvas...");
        const res = await compressImage(file, imageQuality);
        setLocalBlobResult({ blob: res.blob, fileName: res.fileName });
        setCompressionStats({
          originalSize: res.originalSize,
          compressedSize: res.compressedSize,
          savedPercent: res.savedPercent
        });
        downloadBlob(res.blob, res.fileName);
        toast.success(`Image compressed! Saved ${res.savedPercent}%`);
      } else if (isResizeImage) {
        setProgressPercent(60);
        setProgressMessage("Resizing image...");
        const res = await resizeImage(file, resizeWidth, resizeHeight, maintainAspect);
        setLocalBlobResult({ blob: res.blob, fileName: res.fileName });
        setResizeStats({
          originalWidth: res.originalWidth,
          originalHeight: res.originalHeight,
          newWidth: res.newWidth,
          newHeight: res.newHeight
        });
        downloadBlob(res.blob, res.fileName);
        toast.success(`Resized to ${res.newWidth} × ${res.newHeight}px!`);
      } else if (isCropper) {
        setProgressPercent(60);
        setProgressMessage("Cropping image in canvas...");
        const dims = originalDimensions || { width: 800, height: 600 };
        let cropW = dims.width;
        let cropH = dims.height;

        if (cropPreset === "1:1") {
          const side = Math.min(dims.width, dims.height);
          cropW = side;
          cropH = side;
        } else if (cropPreset === "4:3") {
          cropW = Math.min(dims.width, Math.round(dims.height * (4 / 3)));
          cropH = Math.round(cropW * (3 / 4));
        } else if (cropPreset === "16:9") {
          cropW = Math.min(dims.width, Math.round(dims.height * (16 / 9)));
          cropH = Math.round(cropW * (9 / 16));
        }

        const cropX = Math.max(0, Math.round((dims.width - cropW) / 2));
        const cropY = Math.max(0, Math.round((dims.height - cropH) / 2));

        const res = await cropImage(file, { x: cropX, y: cropY, width: cropW, height: cropH });
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Cropped successfully!");
      } else if (isRotator) {
        setProgressPercent(60);
        setProgressMessage(`Rotating image by ${rotateAngle}°...`);
        const res = await rotateImage(file, rotateAngle);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Image rotated successfully!");
      } else if (isFlipper) {
        setProgressPercent(60);
        setProgressMessage(`Flipping image (${flipDirection})...`);
        const res = await flipImage(file, flipDirection);
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Image flipped successfully!");
      }

      // 3. Format Conversions
      else if (isJpgToPng || isGifToPng) {
        setProgressPercent(60);
        setProgressMessage("Converting to PNG format...");
        const res = await convertImageFormat(file, "png");
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Converted to PNG!");
      } else if (isPngToJpg || isWebpToJpg || isBmpToJpg) {
        setProgressPercent(60);
        setProgressMessage("Converting to JPG format...");
        const res = await convertImageFormat(file, "jpeg");
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Converted to JPG!");
      } else if (isJpgToWebp || isPngToWebp) {
        setProgressPercent(60);
        setProgressMessage("Converting to modern WebP format...");
        const res = await convertImageFormat(file, "webp");
        setLocalBlobResult(res);
        downloadBlob(res.blob, res.fileName);
        toast.success("Converted to WebP!");
      }

      // 4. Base64
      else if (isImageToBase64) {
        setProgressPercent(70);
        setProgressMessage("Encoding image to Base64...");
        const res = await imageToBase64(file);
        setBase64Text(res.dataUrl);
        const txtBlob = new Blob([res.dataUrl], { type: "text/plain" });
        setLocalBlobResult({ blob: txtBlob, fileName: res.fileName });
        toast.success("Image encoded to Base64 string!");
      } else if (isBase64ToImage) {
        if (!base64Text.trim()) throw new Error("Please paste a Base64 string or Data URL.");
        setProgressPercent(70);
        setProgressMessage("Decoding Base64 string into image...");
        const res = await base64ToImage(base64Text, "decoded_image.png");
        setLocalBlobResult({ blob: res.blob, fileName: res.fileName });
        downloadBlob(res.blob, res.fileName);
        toast.success("Decoded and downloaded image!");
      }

      recordConversion();
    } catch (err: any) {
      toast.error(err.message || "An error occurred during local processing.");
    } finally {
      setConverting(false);
      setProgressPercent(0);
      setProgressMessage("");
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const copyToClipboard = () => {
    if (!base64Text) return;
    navigator.clipboard.writeText(base64Text);
    setCopiedBase64(true);
    toast.success("Base64 copied to clipboard!");
    setTimeout(() => setCopiedBase64(false), 2500);
  };

  // If visiting an unsupported server tool route
  if (isLegacyServerTool) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">100% In-Browser Privacy Edition</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
            PDFlex now runs <strong>100% locally in your web browser</strong> with zero external servers. Office conversions (like Word/Excel/PPT) require server-side software and are not available in this offline edition.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/merge-pdf"
              className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Merge PDF
            </a>
            <a
              href="/compress-image"
              className="px-4 py-2 text-xs font-semibold bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Compress Image
            </a>
            <a
              href="/"
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Browse all browser tools →
            </a>
          </div>
        </Card>
      </div>
    );
  }

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
            {/* Special Mode: Base64 to Image */}
            {isBase64ToImage ? (
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-700">
                  Paste Base64 String or Data URL:
                </label>
                <textarea
                  value={base64Text}
                  onChange={(e) => setBase64Text(e.target.value)}
                  placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
                  rows={6}
                  className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleProcess}
                    disabled={converting || !base64Text.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 h-10 rounded-xl"
                  >
                    Decode & Download Image
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setBase64Text("")}
                    className="text-xs h-10 rounded-xl"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Left Column: Upload Dropzone & Preview */}
                <div className="flex-1 w-full">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple={toolType === "merge" || isImagesToPdf}
                    onChange={handleFileChange}
                    accept={
                      isPdfTool
                        ? ".pdf"
                        : ".jpg,.jpeg,.png,.webp,.gif,.bmp"
                    }
                  />

                  <div
                    className={`relative min-h-[300px] border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all ${
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
                        <div className="w-14 h-14 mb-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
                          {isPdfTool ? (
                            toolType === "merge" ? <Layers className="w-7 h-7" /> :
                            toolType === "split" ? <Scissors className="w-7 h-7" /> :
                            toolType === "rotate" ? <RotateCw className="w-7 h-7" /> :
                            toolType === "delete-pages" ? <Trash2 className="w-7 h-7" /> :
                            toolType === "watermark" ? <Type className="w-7 h-7" /> :
                            <Archive className="w-7 h-7" />
                          ) : isCropper ? (
                            <Crop className="w-7 h-7" />
                          ) : isRotator ? (
                            <RotateCw className="w-7 h-7" />
                          ) : isFlipper ? (
                            <FlipHorizontal className="w-7 h-7" />
                          ) : isImageToBase64 ? (
                            <Code className="w-7 h-7" />
                          ) : (
                            <ImageIcon className="w-7 h-7" />
                          )}
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm mb-1">
                          Click to browse or drag & drop
                        </h3>
                        <p className="text-xs text-slate-500 max-w-xs mb-3">
                          {isPdfTool
                            ? toolType === "merge"
                              ? "Select 2 or more PDF files to combine"
                              : "Select a PDF file (up to 25 MB)"
                            : isImagesToPdf
                            ? "Select JPG, PNG, WebP, GIF, or BMP images"
                            : "Supports JPG, PNG, WebP, GIF, and BMP"}
                        </p>
                        <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-xs">
                          Select from device
                        </span>
                      </div>
                    ) : (
                      <div className="w-full space-y-3">
                        {/* File preview thumbnail if image */}
                        {filePreviewUrl && (
                          <div className="flex justify-center mb-3">
                            <div className="relative group max-h-48 rounded-lg overflow-hidden border border-slate-200 bg-white p-1">
                              <img
                                src={filePreviewUrl}
                                alt="Preview"
                                className="max-h-44 object-contain rounded"
                              />
                              {originalDimensions && (
                                <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                                  {originalDimensions.width} × {originalDimensions.height}px
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* File list */}
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                          {selectedFiles.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs"
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                {isPdfTool ? (
                                  <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                                ) : (
                                  <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
                                )}
                                <div className="truncate text-left">
                                  <div className="text-xs font-medium text-slate-800 truncate">
                                    {file.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {formatBytes(file.size)}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(idx)}
                                className="text-slate-400 hover:text-slate-600 p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add more button for multi-file tools */}
                        {(toolType === "merge" || isImagesToPdf) && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-2 border border-dashed border-slate-300 hover:border-blue-400 rounded-xl text-xs font-semibold text-blue-600 bg-white hover:bg-blue-50/50 transition-colors"
                          >
                            + Add more files
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Tool-specific Options & Actions */}
                <div className="w-full md:w-80 flex flex-col justify-between space-y-6">
                  <div className="space-y-5">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">
                        Options & Processing
                      </h4>
                      <p className="text-xs text-slate-500">
                        Processed entirely in your browser.
                      </p>
                    </div>

                    {/* PDF Split Options */}
                    {toolType === "split" && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">
                          Page Range to Extract:
                        </label>
                        <input
                          type="text"
                          value={pageRange}
                          onChange={(e) => setPageRange(e.target.value)}
                          placeholder="e.g. 1-3, 5"
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                        />
                      </div>
                    )}

                    {/* PDF or Image Rotate Options */}
                    {(toolType === "rotate" || isRotator) && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">
                          Rotation Angle:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[90, 180, 270].map((angle) => (
                            <button
                              key={angle}
                              type="button"
                              onClick={() => setRotateAngle(angle)}
                              className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                                rotateAngle === angle
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {angle}°
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PDF Delete Pages */}
                    {toolType === "delete-pages" && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">
                          Pages to Remove:
                        </label>
                        <input
                          type="text"
                          value={pagesToDelete}
                          onChange={(e) => setPagesToDelete(e.target.value)}
                          placeholder="e.g. 1, 4-6"
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                        />
                      </div>
                    )}

                    {/* PDF Watermark */}
                    {toolType === "watermark" && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">
                          Watermark Text:
                        </label>
                        <input
                          type="text"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="e.g. CONFIDENTIAL"
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                        />
                      </div>
                    )}

                    {/* PDF Page Numbers */}
                    {toolType === "page-numbers" && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">
                          Start Number:
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={pageNumberStart}
                          onChange={(e) => setPageNumberStart(parseInt(e.target.value) || 1)}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                        />
                      </div>
                    )}

                    {/* Image Compression Quality Slider */}
                    {isCompressImage && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>Quality:</span>
                          <span>{Math.round(imageQuality * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="0.95"
                          step="0.05"
                          value={imageQuality}
                          onChange={(e) => setImageQuality(parseFloat(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Smaller size</span>
                          <span>Higher quality</span>
                        </div>
                      </div>
                    )}

                    {/* Image Resizer Inputs */}
                    {isResizeImage && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                              Width (px)
                            </label>
                            <input
                              type="number"
                              value={resizeWidth}
                              onChange={(e) => {
                                const w = parseInt(e.target.value) || 1;
                                setResizeWidth(w);
                                if (maintainAspect && originalDimensions) {
                                  setResizeHeight(
                                    Math.round(w * (originalDimensions.height / originalDimensions.width))
                                  );
                                }
                              }}
                              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                              Height (px)
                            </label>
                            <input
                              type="number"
                              value={resizeHeight}
                              onChange={(e) => {
                                const h = parseInt(e.target.value) || 1;
                                setResizeHeight(h);
                                if (maintainAspect && originalDimensions) {
                                  setResizeWidth(
                                    Math.round(h * (originalDimensions.width / originalDimensions.height))
                                  );
                                }
                              }}
                              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
                            />
                          </div>
                        </div>
                        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={maintainAspect}
                            onChange={(e) => setMaintainAspect(e.target.checked)}
                            className="rounded border-slate-300 text-blue-600"
                          />
                          Maintain original aspect ratio
                        </label>
                        {originalDimensions && (
                          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            Original: {originalDimensions.width} × {originalDimensions.height}px
                          </div>
                        )}
                      </div>
                    )}

                    {/* Image Cropper Presets */}
                    {isCropper && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">
                          Aspect Ratio Preset:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["1:1", "4:3", "16:9"] as const).map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setCropPreset(preset)}
                              className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                                cropPreset === preset
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Image Flipper Direction */}
                    {isFlipper && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">
                          Flip Direction:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setFlipDirection("horizontal")}
                            className={`py-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                              flipDirection === "horizontal"
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <FlipHorizontal className="w-3.5 h-3.5" /> Horizontal
                          </button>
                          <button
                            type="button"
                            onClick={() => setFlipDirection("vertical")}
                            className={`py-2 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                              flipDirection === "vertical"
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <FlipVertical className="w-3.5 h-3.5" /> Vertical
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Image to Base64 Output */}
                    {isImageToBase64 && base64Text && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                          <span>Base64 String:</span>
                          <button
                            type="button"
                            onClick={copyToClipboard}
                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-[11px]"
                          >
                            {copiedBase64 ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copiedBase64 ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <textarea
                          readOnly
                          value={base64Text}
                          rows={3}
                          className="w-full text-[10px] font-mono p-2 rounded-lg border border-slate-200 bg-slate-50"
                        />
                      </div>
                    )}

                    {/* Compression Stats Card */}
                    {compressionStats && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs">
                        <div className="font-bold text-emerald-800">
                          Reduced by {compressionStats.savedPercent}%
                        </div>
                        <div className="text-emerald-700 flex justify-between">
                          <span>Original: {formatBytes(compressionStats.originalSize)}</span>
                          <span>→</span>
                          <span>New: {formatBytes(compressionStats.compressedSize)}</span>
                        </div>
                      </div>
                    )}

                    {/* Resize Stats Card */}
                    {resizeStats && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-xs text-blue-800 font-medium">
                        <div>Original: {resizeStats.originalWidth} × {resizeStats.originalHeight}px</div>
                        <div>Resized: {resizeStats.newWidth} × {resizeStats.newHeight}px</div>
                      </div>
                    )}
                  </div>

                  {/* Actions Area */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <Button
                      onClick={() => {
                        if (selectedFiles.length === 0) {
                          fileInputRef.current?.click();
                        } else {
                          handleProcess();
                        }
                      }}
                      disabled={converting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm h-12 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {converting ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          {progressMessage || "Processing..."}
                        </>
                      ) : selectedFiles.length === 0 ? (
                        <>
                          <Upload className="w-4 h-4" />
                          Select File to Start
                        </>
                      ) : (
                        <>
                          Process Locally
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    {selectedFiles.length > 0 && (
                      <Button
                        variant="ghost"
                        onClick={resetAll}
                        disabled={converting}
                        className="w-full text-slate-500 hover:text-slate-700 text-xs h-9 rounded-xl"
                      >
                        Reset / Choose Another
                      </Button>
                    )}

                    {/* Re-download button if result is ready */}
                    {localBlobResult && (
                      <Button
                        variant="outline"
                        onClick={() => downloadBlob(localBlobResult.blob, localBlobResult.fileName)}
                        className="w-full text-blue-600 border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-xs h-9 rounded-xl"
                      >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        Download Again ({localBlobResult.fileName})
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Honest Privacy Banner */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Processed locally in your browser. Your files aren't uploaded to our server.</span>
        </div>
      </div>
    </>
  );
};

export default ConversionUpload;
