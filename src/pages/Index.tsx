// src/pages/Index.tsx
import {
  FileText,
  Scissors,
  Layers,
  RotateCw,
  Archive,
  ArrowRight,
  Laptop,
  Image as ImageIcon,
  Crop,
  FlipHorizontal,
  Type,
  Trash2,
  Code,
  FileDown
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import ConversionUpload from "@/components/ConversionUpload";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const pdfTools = [
    {
      title: "Merge PDF",
      desc: "Combine multiple PDF documents into a single organized file.",
      icon: <Layers className="w-5 h-5 text-emerald-600" />,
      path: "/merge-pdf",
      badge: "In-Browser"
    },
    {
      title: "Split PDF",
      desc: "Extract specific pages or page ranges into an independent PDF.",
      icon: <Scissors className="w-5 h-5 text-emerald-600" />,
      path: "/split-pdf",
      badge: "In-Browser"
    },
    {
      title: "Rotate PDF",
      desc: "Rotate pages 90°, 180°, or 270° and save permanently.",
      icon: <RotateCw className="w-5 h-5 text-emerald-600" />,
      path: "/rotate-pdf",
      badge: "In-Browser"
    },
    {
      title: "Compress PDF",
      desc: "Optimize streams and reduce PDF size directly in browser memory.",
      icon: <Archive className="w-5 h-5 text-emerald-600" />,
      path: "/compress-pdf",
      badge: "In-Browser"
    },
    {
      title: "Delete Pages",
      desc: "Remove unwanted pages from your document with complete privacy.",
      icon: <Trash2 className="w-5 h-5 text-emerald-600" />,
      path: "/delete-pdf-pages",
      badge: "In-Browser"
    },
    {
      title: "Watermark PDF",
      desc: "Add customized text watermarks across pages before sharing.",
      icon: <Type className="w-5 h-5 text-emerald-600" />,
      path: "/watermark-pdf",
      badge: "In-Browser"
    },
    {
      title: "Page Numbers",
      desc: "Cleanly stamp page numbering onto all pages with custom offsets.",
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
      path: "/add-page-numbers",
      badge: "In-Browser"
    },
    {
      title: "Images to PDF",
      desc: "Compile multiple JPG, PNG, WebP, GIF, or BMP images into a PDF.",
      icon: <FileDown className="w-5 h-5 text-emerald-600" />,
      path: "/images-to-pdf",
      badge: "In-Browser"
    }
  ];

  const imageTools = [
    {
      title: "Compress Image",
      desc: "Reduce image file size with live percentage savings and quality control.",
      icon: <ImageIcon className="w-5 h-5 text-blue-600" />,
      path: "/compress-image",
      badge: "Canvas 2D"
    },
    {
      title: "Resize Image",
      desc: "Adjust pixel width and height while locking original aspect ratio.",
      icon: <ImageIcon className="w-5 h-5 text-blue-600" />,
      path: "/resize-image",
      badge: "Canvas 2D"
    },
    {
      title: "Crop Image",
      desc: "Crop photos to 1:1 square, 4:3, or 16:9 widescreen formats.",
      icon: <Crop className="w-5 h-5 text-blue-600" />,
      path: "/image-cropper",
      badge: "Canvas 2D"
    },
    {
      title: "Rotate Image",
      desc: "Quickly rotate photos by 90°, 180°, or 270° clockwise.",
      icon: <RotateCw className="w-5 h-5 text-blue-600" />,
      path: "/image-rotator",
      badge: "Canvas 2D"
    },
    {
      title: "Flip Image",
      desc: "Mirror images horizontally or vertically in your browser.",
      icon: <FlipHorizontal className="w-5 h-5 text-blue-600" />,
      path: "/image-flipper",
      badge: "Canvas 2D"
    },
    {
      title: "JPG to PNG",
      desc: "Convert compressed JPEG images to lossless PNG format.",
      icon: <ImageIcon className="w-5 h-5 text-blue-600" />,
      path: "/jpg-to-png",
      badge: "Instant"
    },
    {
      title: "PNG to JPG",
      desc: "Convert PNG graphics into standard lightweight JPG images.",
      icon: <ImageIcon className="w-5 h-5 text-blue-600" />,
      path: "/png-to-jpg",
      badge: "Instant"
    },
    {
      title: "WebP to JPG",
      desc: "Convert modern WebP images into universal JPG format.",
      icon: <ImageIcon className="w-5 h-5 text-blue-600" />,
      path: "/webp-to-jpg",
      badge: "Instant"
    },
    {
      title: "JPG to WebP",
      desc: "Convert JPEG photos into modern WebP for web performance.",
      icon: <ImageIcon className="w-5 h-5 text-blue-600" />,
      path: "/jpg-to-webp",
      badge: "Instant"
    },
    {
      title: "Image to Base64",
      desc: "Encode any image into a copyable Base64 string or Data URI.",
      icon: <Code className="w-5 h-5 text-blue-600" />,
      path: "/image-to-base64",
      badge: "Developer"
    },
    {
      title: "Base64 to Image",
      desc: "Paste a Base64 text string to view and save it as an image file.",
      icon: <Code className="w-5 h-5 text-blue-600" />,
      path: "/base64-to-image",
      badge: "Developer"
    },
    {
      title: "GIF to PNG",
      desc: "Extract the first frame of an animated or static GIF into PNG.",
      icon: <ImageIcon className="w-5 h-5 text-blue-600" />,
      path: "/gif-to-png",
      badge: "Instant"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SEO
        title="PDFlex — 100% In-Browser PDF & Image Utilities"
        description="Merge, split, rotate, compress, and edit PDF & image files directly in your web browser. 100% local processing with zero server uploads."
        canonicalPath="/"
      />
      <Navbar />

      <main>
        <Hero />

        {/* Primary Interactive Workspace */}
        <section id="upload-section" className="py-6">
          <ConversionUpload />
        </section>

        {/* PDF Tools Catalog */}
        <section id="pdf-tools" className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  PDF Tools
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Organize, edit, and compress PDF documents directly inside your browser.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <Laptop className="w-3.5 h-3.5" /> 100% Client-Side Private
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pdfTools.map((tool, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(tool.path)}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                        {tool.icon}
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                        {tool.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors mb-1">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
                    <span>Open tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Image Tools Catalog */}
        <section id="image-tools" className="py-12 px-4 bg-white border-t border-slate-200">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Image Tools
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Compress, resize, crop, rotate, and convert image formats using HTML5 Canvas.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                <Laptop className="w-3.5 h-3.5" /> High-Performance Canvas
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {imageTools.map((tool, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(tool.path)}
                  className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200 hover:border-blue-300 hover:bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                        {tool.icon}
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                        {tool.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                    <span>Open tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Features />

        {/* Minimal Clean Call to Action */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Fast, private document utilities in your browser
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto mb-6">
              No account creation, no file uploads, and zero server storage. Everything runs locally on your device.
            </p>
            <button
              type="button"
              onClick={() => document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors"
            >
              Get Started Now
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;