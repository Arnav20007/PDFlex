import { FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200/80 pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">
                PDF<span className="text-blue-600">lex</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Simple, secure, and fast document utilities. Browser-local tools for privacy, high-fidelity cloud engines for accuracy.
            </p>
          </div>

          {/* Core Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Convert</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="/pdf-to-word" className="hover:text-blue-600 transition-colors">PDF to Word</a></li>
              <li><a href="/pdf-to-excel" className="hover:text-blue-600 transition-colors">PDF to Excel</a></li>
              <li><a href="/pdf-to-powerpoint" className="hover:text-blue-600 transition-colors">PDF to PowerPoint</a></li>
              <li><a href="/word-to-pdf" className="hover:text-blue-600 transition-colors">Word to PDF</a></li>
            </ul>
          </div>

          {/* PDF Utilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Organize</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="/merge-pdf" className="hover:text-blue-600 transition-colors">Merge PDF (Local)</a></li>
              <li><a href="/split-pdf" className="hover:text-blue-600 transition-colors">Split PDF (Local)</a></li>
              <li><a href="/rotate-pdf" className="hover:text-blue-600 transition-colors">Rotate PDF (Local)</a></li>
              <li><a href="/compress-pdf" className="hover:text-blue-600 transition-colors">Compress PDF</a></li>
            </ul>
          </div>

          {/* Legal / Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">About & Security</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="/about" className="hover:text-blue-600 transition-colors">About PDFlex</a></li>
              <li><a href="/contact" className="hover:text-blue-600 transition-colors">Contact Support</a></li>
              <li><a href="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy & Data Security</a></li>
              <li><span className="text-slate-400 block pt-1 text-[11px]">CloudConvert Partner Pipeline</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} PDFlex. All rights reserved.</div>
          <div className="flex items-center gap-4 text-xs">
            <span>Client-side PDF rendering powered by pdf-lib</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
