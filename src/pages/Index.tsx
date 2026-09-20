import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Scissors,
  Layers,
  RotateCw,
  Archive,
  ArrowRight,
  Laptop,
  Cloud
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

  const primaryTools = [
    {
      title: "Merge PDF",
      desc: "Combine multiple PDF documents into a single organized file.",
      icon: <Layers className="w-5 h-5 text-emerald-600" />,
      path: "/merge-pdf",
      badge: "In-Browser",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      title: "Split PDF",
      desc: "Extract specific pages or page ranges into an independent PDF.",
      icon: <Scissors className="w-5 h-5 text-emerald-600" />,
      path: "/split-pdf",
      badge: "In-Browser",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      title: "Rotate PDF",
      desc: "Rotate pages 90°, 180°, or 270° and save permanently.",
      icon: <RotateCw className="w-5 h-5 text-emerald-600" />,
      path: "/rotate-pdf",
      badge: "In-Browser",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      title: "PDF to Word",
      desc: "Convert PDFs into editable Microsoft Word (.docx) documents.",
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      path: "/pdf-to-word",
      badge: "Cloud High-Fidelity",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      title: "PDF to Excel",
      desc: "Extract tables and tabular data cleanly into spreadsheets (.xlsx).",
      icon: <FileSpreadsheet className="w-5 h-5 text-blue-600" />,
      path: "/pdf-to-excel",
      badge: "Cloud High-Fidelity",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      title: "PDF to PowerPoint",
      desc: "Transform PDF presentations into editable PowerPoint slides (.pptx).",
      icon: <Presentation className="w-5 h-5 text-blue-600" />,
      path: "/pdf-to-powerpoint",
      badge: "Cloud High-Fidelity",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      title: "Word to PDF",
      desc: "Convert DOC and DOCX files into universal PDF format.",
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
      path: "/word-to-pdf",
      badge: "Cloud High-Fidelity",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      title: "Compress PDF",
      desc: "Reduce file size for easier sharing without losing readability.",
      icon: <Archive className="w-5 h-5 text-slate-600" />,
      path: "/compress-pdf",
      badge: "Cloud High-Fidelity",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SEO
        title="PDFlex — Simple PDF Tools Without the Hassle"
        description="Merge, split, rotate, and convert PDF files online. 100% private browser tools and high-fidelity cloud conversion."
        canonicalPath="/"
      />
      <Navbar />

      <main>
        <Hero />

        {/* Primary Interactive Workspace */}
        <section id="upload-section" className="py-6">
          <ConversionUpload />
        </section>

        {/* Tools Catalog */}
        <section id="tools-catalog" className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  All PDF Tools
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Choose a tool below to open its dedicated processing workspace.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-4 sm:mt-0 text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <Laptop className="w-3.5 h-3.5" /> Client-side private
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-blue-700 font-medium">
                  <Cloud className="w-3.5 h-3.5" /> Cloud high-fidelity
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {primaryTools.map((tool, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(tool.path)}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                        {tool.icon}
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tool.badgeColor}`}>
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
              Ready to process your documents?
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto mb-6">
              No software installation, account creation, or email collection. Get started instantly in your browser.
            </p>
            <button
              type="button"
              onClick={() => document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors"
            >
              Upload & Convert PDF
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;