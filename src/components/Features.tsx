import { Shield, Zap, Layout, Cloud, Lock, CheckCircle2 } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Lock className="w-5 h-5 text-emerald-600" />,
      title: "Client-Side Privacy",
      description: "Tools like Merge, Split, and Rotate process documents entirely in your web browser. No files are uploaded to any server."
    },
    {
      icon: <Layout className="w-5 h-5 text-blue-600" />,
      title: "Exact Formatting Preservation",
      description: "Advanced conversions to Word, Excel, and PowerPoint retain fonts, tables, margins, and column layouts with high fidelity."
    },
    {
      icon: <Cloud className="w-5 h-5 text-indigo-600" />,
      title: "Automated Data Wiping",
      description: "For cloud conversions, files are transferred over TLS encryption and automatically deleted from processing servers immediately."
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      title: "Fast & Lightweight",
      description: "Optimized processing pipeline that converts most documents in under 10 seconds without bloated client libraries."
    },
    {
      icon: <Shield className="w-5 h-5 text-blue-600" />,
      title: "Secure Architecture",
      description: "Built with secure token proxying and zero client-side credential exposure, ensuring your conversions remain private."
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      title: "No Sign-Up or Watermarks",
      description: "Use all core tools right away without creating an account, entering an email, or receiving watermarked documents."
    }
  ];

  return (
    <section className="py-16 px-4 bg-white border-y border-slate-200/80">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Built for reliability and privacy
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm mt-2">
            Every feature is engineered to provide straightforward document utilities without tracking or intrusive paywalls.
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