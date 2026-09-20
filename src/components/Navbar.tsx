// src/components/Navbar.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Merge PDF", href: "/merge-pdf" },
    { label: "Split PDF", href: "/split-pdf" },
    { label: "Compress Image", href: "/compress-image" },
    { label: "Resize Image", href: "/resize-image" },
    { label: "Images to PDF", href: "/images-to-pdf" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => navigate("/")}
        >
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            PDF<span className="text-blue-600">lex</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              const el = document.getElementById("upload-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              else navigate("/");
            }}
            className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 h-9 rounded-xl shadow-xs"
          >
            Start Tool
          </Button>

          <button
            type="button"
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <Button
              onClick={() => {
                navigate("/");
                setIsOpen(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 rounded-lg"
            >
              Start Tool
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
