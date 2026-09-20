import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ConversionUpload from "@/components/ConversionUpload";
import { SEO } from "@/components/SEO";
import { ShieldCheck, Zap, Laptop, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";

interface ToolPageProps {
  title: string;
  description: string;
  toolType: string;
}

const ToolPage = ({ title, description, toolType }: ToolPageProps) => {
  const location = useLocation();
  const isLocal = toolType === "merge" || toolType === "split" || toolType === "rotate";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SEO
        title={`${title} Online — Free & Fast`}
        description={description}
        canonicalPath={location.pathname}
      />
      <Navbar />

      <main className="pt-12 pb-16">
        {/* Tool Header */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold rounded-full bg-blue-50 border border-blue-100 text-blue-700">
            {isLocal ? (
              <>
                <Laptop className="w-3.5 h-3.5 text-emerald-600" />
                <span>Runs 100% locally in your browser</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>High-Fidelity Cloud Pipeline</span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Upload & Conversion Card */}
        <ConversionUpload toolType={toolType} />

        {/* How it Works / Instructions */}
        <div className="max-w-4xl mx-auto px-4 mt-16 pt-12 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
            How to use {title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Select Document</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Drag and drop your file into the designated upload area or click Browse to choose from your device.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Process Instantly</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isLocal
                  ? "Click the action button. Your document is processed locally using browser memory with zero upload."
                  : "Choose your target format and click Convert. The high-fidelity cloud engine converts while preserving layouts."}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Download File</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your processed document will download automatically. You can also click the download button to save it again.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ToolPage;
