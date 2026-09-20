// src/components/Features.tsx
import { Shield, Zap, Lock, CheckCircle2, Laptop, Image as ImageIcon } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Lock className="w-5 h-5 text-emerald-600" />,
      title: "100% In-Browser Privacy",
      description: "Every tool processes documents and images entirely in your web browser. No files are uploaded to any server."
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      title: "Instant In-Memory Speed",
      description: "Hardware-accelerated processing using HTML5 Canvas and client-side WebAssembly without upload or download wait times."
    },
    {
      icon: <Shield className="w-5 h-5 text-blue-600" />,
      title: "Zero Server Storage Risk",
      description: "Your sensitive contracts, statements, and photos never leave your device, eliminating remote data leak vulnerabilities."
    },
    {
      icon: <Laptop className="w-5 h-5 text-emerald-600" />,
      title: "Works Across Devices",
      description: "Fully responsive on desktop browsers, Android Chrome, and Apple Mobile Safari without installing native apps."
    },
    {
      icon: <ImageIcon className="w-5 h-5 text-blue-600" />,
      title: "Universal Image Formats",
      description: "Easily handle JPG, PNG, modern WebP, GIF, and BMP files with quality sliders and aspect ratio locking."
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      title: "No Sign-Up or Watermarks",
      description: "Use all tools freely right away without creating an account, entering an email, or receiving watermarked documents."
    }
  ];

  return (
    <section className="py-16 px-4 bg-white border-y border-slate-200/80">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineered for pure privacy and speed
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm mt-2">
            PDFlex runs entirely in your browser. No accounts, no subscriptions, and zero cloud uploads.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-xs">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">{feature.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}