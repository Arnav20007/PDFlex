// src/components/Footer.tsx
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
              Fast, private, and 100% browser-based PDF and image utilities. No file uploads, no tracking, and zero cloud storage risk.
            </p>
          </div>

          {/* PDF Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">PDF Tools</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="/merge-pdf" className="hover:text-blue-600 transition-colors">Merge PDF</a></li>
              <li><a href="/split-pdf" className="hover:text-blue-600 transition-colors">Split PDF</a></li>
              <li><a href="/rotate-pdf" className="hover:text-blue-600 transition-colors">Rotate PDF</a></li>
              <li><a href="/compress-pdf" className="hover:text-blue-600 transition-colors">Compress PDF</a></li>
              <li><a href="/images-to-pdf" className="hover:text-blue-600 transition-colors">Images to PDF</a></li>
              <li><a href="/delete-pdf-pages" className="hover:text-blue-600 transition-colors">Delete PDF Pages</a></li>
            </ul>
          </div>

          {/* Image Utilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Image Tools</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="/compress-image" className="hover:text-blue-600 transition-colors">Compress Image</a></li>
              <li><a href="/resize-image" className="hover:text-blue-600 transition-colors">Resize Image</a></li>
              <li><a href="/image-cropper" className="hover:text-blue-600 transition-colors">Crop Image</a></li>
              <li><a href="/image-rotator" className="hover:text-blue-600 transition-colors">Rotate Image</a></li>
              <li><a href="/jpg-to-png" className="hover:text-blue-600 transition-colors">JPG to PNG</a></li>
              <li><a href="/image-to-base64" className="hover:text-blue-600 transition-colors">Image to Base64</a></li>
            </ul>
          </div>

          {/* Legal / Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Company & Privacy</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><a href="/about" className="hover:text-blue-600 transition-colors">About PDFlex</a></li>
              <li><a href="/contact" className="hover:text-blue-600 transition-colors">Contact Support</a></li>
              <li><a href="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="/cookie-policy" className="hover:text-blue-600 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} PDFlex. All processing performed locally in your browser.</div>
          <div className="flex items-center gap-4 text-xs">
            <span>Powered by pdf-lib & HTML5 Canvas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
