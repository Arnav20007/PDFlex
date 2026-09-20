import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <SEO
        title="404 - Page Not Found — PDFlex"
        description="The document tool or page you requested could not be found."
      />
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">404 - Page Not Found</h1>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            The page or document tool you were looking for doesn't exist or may have been moved.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm h-10 rounded-xl shadow-xs flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;