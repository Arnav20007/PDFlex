// src/components/Features.tsx
import { Laptop, UserCheck, Smartphone } from "lucide-react";

export function Features() {
  const points = [
    {
      icon: <Laptop className="w-5 h-5 text-blue-600" />,
      title: "No software to install",
      description: "Open PDFlex in your browser and start working with your files immediately."
    },
    {
      icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
      title: "No account required",
      description: "Use the available tools without creating an account or entering your email."
    },
    {
      icon: <Smartphone className="w-5 h-5 text-purple-600" />,
      title: "Works on desktop and mobile",
      description: "Use PDFlex from your computer, tablet, or phone."
    }
  ];

  return (
    <section className="py-16 px-4 bg-slate-100/60 border-y border-slate-200">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          PDF tools that work in your browser
        </h2>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto mb-4 leading-relaxed">
          PDFlex is designed for quick, everyday file tasks. Select a tool, add your file, make your changes, and download the result.
        </p>
        <p className="text-slate-500 text-xs max-w-xl mx-auto mb-10">
          For browser-based tools, your files are processed locally on your device rather than uploaded to a server.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                {pt.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">{pt.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{pt.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}