import { Button } from "@/components/ui/button";
import { ArrowRight, Laptop, Cloud, CheckCircle, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-16 pb-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs font-semibold rounded-full bg-blue-50 border border-blue-100 text-blue-700">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Local browser privacy & high-fidelity cloud conversion</span>
        </div>

        {/* Core Product Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-5">
          Simple PDF tools, <br className="hidden sm:inline" />
          <span className="text-blue-600">without the hassle.</span>
        </h1>

        {/* Clear Subtitle explaining the differentiator */}
        <p className="text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto mb-8 leading-relaxed">
          Merge, split, rotate, and convert documents instantly.
          <span className="font-medium text-slate-800"> Local tools run 100% in your browser</span> for total privacy,
          while complex document conversions use high-fidelity cloud engines to retain exact layouts and fonts.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Button
            size="lg"
            onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs"
          >
            Start Converting
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => document.getElementById('tools-catalog')?.scrollIntoView({ behavior: 'smooth' })}
            className="h-11 px-6 bg-white hover:bg-slate-50 text-slate-700 border-slate-300 font-semibold text-sm rounded-xl"
          >
            View All Tools
          </Button>
        </div>

        {/* 3 Core Differentiator Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 text-left">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">100% In-Browser Tools</div>
              <div className="text-xs text-slate-500 mt-0.5">Merge, split & rotate run client-side. Files never leave your device.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">High-Fidelity Cloud</div>
              <div className="text-xs text-slate-500 mt-0.5">Retains exact tables, typography, and images when converting to Office formats.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Zero Sign-Up Friction</div>
              <div className="text-xs text-slate-500 mt-0.5">10 free conversions daily. No credit cards or account registration required.</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}