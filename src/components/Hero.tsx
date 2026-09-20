// src/components/Hero.tsx
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-16 pb-10 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Core Product Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-5">
          Free PDF & Image Tools Online
        </h1>

        {/* Natural, Honest Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto mb-8 leading-relaxed">
          Work with PDF and image files directly in your browser. Merge, split, rotate, watermark, resize, compress, and convert files without installing software or creating an account.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors"
          >
            Get Started
            <ArrowRight className="ml-1.5 w-4 h-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => document.getElementById('popular-pdf-tools')?.scrollIntoView({ behavior: 'smooth' })}
            className="h-11 px-6 bg-white hover:bg-slate-50 text-slate-700 border-slate-300 font-semibold text-sm rounded-xl transition-colors"
          >
            View All Tools
          </Button>
        </div>
      </div>
    </section>
  );
}