// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import ToolPage from "./pages/ToolPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />

          {/* High-Demand PDF Organization Tools (Client-Side) */}
          <Route
            path="/merge-pdf"
            element={
              <ToolPage
                title="Merge PDF"
                description="Combine multiple PDF files into a single organized document. Processed 100% locally in your browser."
                toolType="merge"
              />
            }
          />
          <Route
            path="/split-pdf"
            element={
              <ToolPage
                title="Split PDF"
                description="Extract specific pages or page ranges from your PDF. Processed 100% locally in your browser."
                toolType="split"
              />
            }
          />
          <Route
            path="/rotate-pdf"
            element={
              <ToolPage
                title="Rotate PDF"
                description="Permanently rotate your PDF pages 90°, 180°, or 270°. Processed 100% locally in your browser."
                toolType="rotate"
              />
            }
          />
          <Route
            path="/delete-pdf-pages"
            element={
              <ToolPage
                title="Delete PDF Pages"
                description="Select and remove unwanted pages from your PDF document instantly in your browser."
                toolType="delete-pages"
              />
            }
          />
          <Route
            path="/watermark-pdf"
            element={
              <ToolPage
                title="Watermark PDF"
                description="Add custom text watermarks across your PDF pages. 100% private in-browser tool."
                toolType="watermark"
              />
            }
          />
          <Route
            path="/add-page-numbers"
            element={
              <ToolPage
                title="Page Numbers"
                description="Number your PDF pages cleanly with customizable starting numbers."
                toolType="page-numbers"
              />
            }
          />

          {/* PDF Compression (PyMuPDF Open-Source Engine) */}
          <Route
            path="/compress-pdf"
            element={
              <ToolPage
                title="Compress PDF"
                description="Reduce the file size of your PDF documents with genuine stream optimization and real size reduction metrics."
                toolType="compress-pdf"
              />
            }
          />

          {/* Document Converters (Open-Source Backend) */}
          <Route
            path="/pdf-to-word"
            element={
              <ToolPage
                title="PDF to Word"
                description="Convert PDF documents to editable Microsoft Word documents (.docx) using open-source layout reconstruction."
                toolType="pdf-to-word"
              />
            }
          />
          <Route
            path="/pdf-to-txt"
            element={
              <ToolPage
                title="PDF to Text"
                description="Extract clean plain text from your PDF document instantly."
                toolType="pdf-to-txt"
              />
            }
          />
          <Route
            path="/pdf-to-jpg"
            element={
              <ToolPage
                title="PDF to JPG"
                description="Convert each page of your PDF into high-quality JPG images bundled as a ZIP archive."
                toolType="pdf-to-jpg"
              />
            }
          />

          {/* Image Utilities (Client-Side HTML5 Canvas & pdf-lib) */}
          <Route
            path="/jpg-to-pdf"
            element={
              <ToolPage
                title="Images to PDF"
                description="Convert multiple JPG, PNG, or WEBP images into a clean standardized PDF file."
                toolType="jpg-to-pdf"
              />
            }
          />
          <Route
            path="/compress-image"
            element={
              <ToolPage
                title="Compress Image"
                description="Compress JPG and PNG images directly in your browser with real-time percentage savings and quality control."
                toolType="compress-image"
              />
            }
          />
          <Route
            path="/resize-image"
            element={
              <ToolPage
                title="Resize Image"
                description="Resize your images by custom pixel dimensions while maintaining original aspect ratio."
                toolType="resize-image"
              />
            }
          />

          {/* Legacy redirects */}
          <Route path="/pdf-to-ppt" element={<Navigate to="/pdf-to-word" replace />} />
          <Route path="/pdf-to-excel" element={<Navigate to="/pdf-to-word" replace />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;