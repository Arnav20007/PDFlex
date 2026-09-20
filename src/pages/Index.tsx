// src/pages/Index.tsx
import {
  FileText,
  Scissors,
  Layers,
  RotateCw,
  Trash2,
  Type,
  FileDown,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle
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

  const everydayTools = [
    { name: "Merge PDF", desc: "Combine multiple PDF files into one.", path: "/merge-pdf" },
    { name: "Split PDF", desc: "Extract pages or split a PDF into separate files.", path: "/split-pdf" },
    { name: "Rotate PDF", desc: "Rotate PDF pages and save the changes.", path: "/rotate-pdf" },
    { name: "Delete PDF Pages", desc: "Remove unwanted pages from a PDF.", path: "/delete-pdf-pages" },
    { name: "Watermark PDF", desc: "Add text watermarks to your document.", path: "/watermark-pdf" },
    { name: "Add Page Numbers", desc: "Number your PDF pages automatically.", path: "/add-page-numbers" },
    { name: "Images to PDF", desc: "Turn JPG, PNG, and other images into a PDF.", path: "/images-to-pdf" },
    { name: "Compress Image", desc: "Reduce image file size before uploading or sharing.", path: "/compress-image" },
    { name: "Resize Image", desc: "Change image dimensions without installing an app.", path: "/resize-image" }
  ];

  const popularPdfTools = [
    {
      title: "Merge PDF",
      desc: "Combine two or more PDF files into a single document. Arrange your files in the order you want and download the merged PDF.",
      path: "/merge-pdf",
      icon: <Layers className="w-5 h-5 text-blue-600" />
    },
    {
      title: "Split PDF",
      desc: "Extract selected pages or split a PDF into separate documents.",
      path: "/split-pdf",
      icon: <Scissors className="w-5 h-5 text-blue-600" />
    },
    {
      title: "Rotate PDF",
      desc: "Rotate PDF pages by 90°, 180°, or 270° and save the updated document.",
      path: "/rotate-pdf",
      icon: <RotateCw className="w-5 h-5 text-blue-600" />
    },
    {
      title: "Delete PDF Pages",
      desc: "Remove unwanted pages from a PDF and download the new file.",
      path: "/delete-pdf-pages",
      icon: <Trash2 className="w-5 h-5 text-blue-600" />
    },
    {
      title: "Watermark PDF",
      desc: "Add a text watermark to your PDF pages before sharing or submitting your document.",
      path: "/watermark-pdf",
      icon: <Type className="w-5 h-5 text-blue-600" />
    },
    {
      title: "Images to PDF",
      desc: "Combine JPG, PNG, and other supported images into a single PDF document.",
      path: "/images-to-pdf",
      icon: <FileDown className="w-5 h-5 text-blue-600" />
    }
  ];

  const imageTools = [
    {
      title: "Compress Image",
      desc: "Reduce JPG, PNG, or WebP file sizes for websites, forms, email, and sharing.",
      path: "/compress-image",
      btnText: "Compress Image →"
    },
    {
      title: "Resize Image",
      desc: "Resize an image by width and height while keeping its proportions when needed.",
      path: "/resize-image",
      btnText: "Resize Image →"
    },
    {
      title: "Convert Images",
      desc: "Convert supported image formats directly in your browser.",
      path: "/jpg-to-png",
      btnText: "View Image Tools →"
    }
  ];

  const faqs = [
    {
      q: "Is PDFlex free?",
      a: "Yes. PDFlex provides free browser-based PDF and image tools."
    },
    {
      q: "Do I need to create an account?",
      a: "No account is required for the available tools."
    },
    {
      q: "Do I need to install software?",
      a: "No. PDFlex works directly in a modern web browser."
    },
    {
      q: "Are my files uploaded?",
      a: "Browser-based tools process files locally on your device. Check the individual tool page for its processing method before uploading sensitive documents."
    },
    {
      q: "Can I use PDFlex on my phone?",
      a: "Yes. PDFlex is designed to work in modern desktop and mobile browsers."
    },
    {
      q: "What PDF tools are available?",
      a: "PDFlex currently includes tools for merging, splitting, rotating, deleting pages, adding watermarks, numbering pages, and converting images to PDF, along with image compression and resizing tools."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SEO
        title="PDFlex — Free PDF & Image Tools Online"
        description="Work with PDF and image files directly in your browser. Merge, split, rotate, watermark, resize, compress, and convert files without installing software."
        canonicalPath="/"
      />
      <Navbar />

      <main>
        <Hero />

        {/* Primary Interactive Workspace */}
        <section id="upload-section" className="py-6">
          <ConversionUpload />
        </section>

        {/* Simple tools for everyday PDF tasks */}
        <section className="py-16 px-4 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Simple tools for everyday PDF tasks
              </h2>
              <p className="text-slate-600 text-sm max-w-xl mx-auto mt-2">
                Need to fix a PDF quickly? PDFlex gives you free tools for common PDF and image tasks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {everydayTools.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(t.path)}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 hover:border-blue-200 transition-all cursor-pointer flex items-start gap-3 group"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PDF tools that work in your browser */}
        <Features />

        {/* Popular PDF Tools */}
        <section id="popular-pdf-tools" className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Popular PDF Tools
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Fast, reliable tools for your everyday documents.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {popularPdfTools.map((tool, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                      {tool.icon}
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">
                      {tool.desc}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(tool.path)}
                    className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {tool.title} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Image Tools */}
        <section id="image-tools" className="py-16 px-4 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Image Tools
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                PDFlex also includes simple browser-based tools for working with images.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {imageTools.map((tool, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-xs">
                      <ImageIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-6">
                      {tool.desc}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(tool.path)}
                    className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {tool.btnText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Your files, your device */}
        <section className="py-16 px-4 bg-slate-50 border-t border-slate-200">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Your files, your device
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto mb-4">
              For tools marked as browser-based, processing happens locally in your browser. Your files aren't uploaded to PDFlex's servers for those operations.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-lg mx-auto">
              This makes PDFlex useful for everyday documents, assignments, forms, images, and other files where you want a quick tool without installing software.
            </p>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="py-16 px-4 bg-white border-t border-slate-200">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
                  <h3 className="font-bold text-sm text-slate-900 mb-1.5">{faq.q}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Work with your files in seconds CTA */}
        <section className="py-16 px-4 bg-slate-50 border-t border-slate-200">
          <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Work with your files in seconds
            </h2>
            <p className="text-slate-600 text-sm max-w-lg mx-auto mb-6">
              Choose a tool, upload your file, make the changes you need, and download the result.
            </p>
            <button
              type="button"
              onClick={() => document.getElementById("popular-pdf-tools")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
            >
              Explore PDF Tools →
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;