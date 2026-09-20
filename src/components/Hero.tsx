// src/components/Hero.tsx
import { Button } from "@/components/ui/button";
import { ArrowRight, Laptop, Zap, CheckCircle, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-16 pb-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs font-semibold rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% In-Browser Processing — Zero Server Uploads</span>
        </div>

        {/* Core Product Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-5">
          Fast PDF & Image tools, <br className="hidden sm:inline" />
          <span className="text-blue-600">completely in your browser.</span>
        </h1>

        {/* Clear Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto mb-8 leading-relaxed">
          Merge, split, rotate, watermark, compress, and edit documents and images locally.
          <span className="font-semibold text-slate-800"> Your files never leave your device.</span> No sign-ups, no wait queues, no cloud storage risk.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Button
            size="lg"
            onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs"
          >
            Start Processing
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => document.getElementById('pdf-tools')?.scrollIntoView({ behavior: 'smooth' })}
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
              <div className="text-xs text-slate-500 mt-0.5">Processes files locally using browser memory. No server uploads.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Instant Processing</div>
              <div className="text-xs text-slate-500 mt-0.5">Zero network latency. Files are transformed immediately on your machine.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">No Sign-Up or Accounts</div>
              <div className="text-xs text-slate-500 mt-0.5">Open any tool and start working right away. No email required.</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}