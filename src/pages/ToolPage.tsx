// src/pages/ToolPage.tsx
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ConversionUpload from "@/components/ConversionUpload";
import { SEO } from "@/components/SEO";
import { Laptop, HelpCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { toolSeoData } from "@/data/toolSeoData";

interface ToolPageProps {
  title: string;
  description: string;
  toolType: string;
}

const ToolPage = ({ title, description, toolType }: ToolPageProps) => {
  const location = useLocation();
  const seoInfo = toolSeoData[toolType];

  const pageH1 = seoInfo?.h1 || `${title} Online for Free`;
  const pageSubtitle = seoInfo?.subtitle || description;
  const howToTitle = seoInfo?.howToTitle || `How to use ${title}`;

  const steps = seoInfo?.steps || [
    { title: "Select your file", desc: "Drag and drop your file into the designated area or click to select from your device." },
    { title: "Choose options", desc: "Adjust settings if needed and click Process Locally. Your file is modified in browser memory." },
    { title: "Download result", desc: "Your processed file will download automatically to your device without being uploaded to a server." }
  ];

  const faqs = seoInfo?.faqs || [
    {
      q: "Are my files uploaded to any server?",
      a: "No. All file processing happens entirely inside your web browser. Your documents and photos never leave your device."
    },
    {
      q: "Is there a file size limit?",
      a: "PDFlex supports files up to 25 MB for smooth in-browser performance."
    },
    {
      q: "Do I need to sign up or create an account?",
      a: "No account, email, or credit card is required. All tools are ready to use immediately."
    },
    {
      q: "Does this tool work on phones and tablets?",
      a: "Yes. PDFlex is responsive and works on desktop, Android Chrome, and iOS Mobile Safari."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SEO
        title={`${pageH1} — PDFlex`}
        description={pageSubtitle}
        canonicalPath={location.pathname}
      />
      <Navbar />

      <main className="pt-12 pb-16">
        {/* Tool Header */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
            <Laptop className="w-3.5 h-3.5 text-emerald-600" />
            <span>Runs 100% locally in your browser</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            {pageH1}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        {/* Upload & Processing Workspace */}
        <ConversionUpload toolType={toolType} />

        {/* How it Works / Instructions */}
        <div className="max-w-4xl mx-auto px-4 mt-16 pt-12 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
            {howToTitle}
          </h2>

          <div className={`grid grid-cols-1 md:grid-cols-${steps.length > 3 ? "4" : "3"} gap-5 text-left`}>
            {steps.map((step, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center mb-3">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto px-4 mt-16 pt-12 border-t border-slate-200">
          <div className="flex items-center justify-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900 text-center">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <h3 className="font-bold text-xs text-slate-900 mb-1.5">{faq.q}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ToolPage;
