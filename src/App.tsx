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

          {/* =========================================================================
              PDF Tools (100% Client-Side In-Browser)
          ========================================================================== */}
          <Route
            path="/merge-pdf"
            element={
              <ToolPage
                title="Merge PDF"
                description="Combine multiple PDF documents into a single organized file in your browser."
                toolType="merge"
              />
            }
          />
          <Route
            path="/split-pdf"
            element={
              <ToolPage
                title="Split PDF"
                description="Extract specific pages or page ranges from your PDF document locally."
                toolType="split"
              />
            }
          />
          <Route
            path="/rotate-pdf"
            element={
              <ToolPage
                title="Rotate PDF"
                description="Permanently rotate PDF pages by 90°, 180°, or 270° directly in your browser."
                toolType="rotate"
              />
            }
          />
          <Route
            path="/delete-pdf-pages"
            element={
              <ToolPage
                title="Delete PDF Pages"
                description="Remove unwanted pages from your PDF file without uploading to any server."
                toolType="delete-pages"
              />
            }
          />
          <Route
            path="/watermark-pdf"
            element={
              <ToolPage
                title="Watermark PDF"
                description="Add custom text watermarks across PDF pages with full privacy."
                toolType="watermark"
              />
            }
          />
          <Route
            path="/add-page-numbers"
            element={
              <ToolPage
                title="Page Numbers"
                description="Add page numbering to your PDF documents with customizable start numbers."
                toolType="page-numbers"
              />
            }
          />
          <Route
            path="/page-numbers"
            element={
              <ToolPage
                title="Page Numbers"
                description="Add page numbering to your PDF documents with customizable start numbers."
                toolType="page-numbers"
              />
            }
          />
          <Route
            path="/compress-pdf"
            element={
              <ToolPage
                title="Compress PDF"
                description="Reduce PDF file size in browser by optimizing object streams and stripping redundant data."
                toolType="compress-pdf"
              />
            }
          />
          <Route
            path="/images-to-pdf"
            element={
              <ToolPage
                title="Images to PDF"
                description="Compile multiple JPG, PNG, WebP, GIF, or BMP images into a clean PDF document."
                toolType="images-to-pdf"
              />
            }
          />
          <Route path="/jpg-to-pdf" element={<Navigate to="/images-to-pdf" replace />} />

          {/* =========================================================================
              Image Optimization & Editing (100% Client-Side Canvas)
          ========================================================================== */}
          <Route
            path="/compress-image"
            element={
              <ToolPage
                title="Compress Image"
                description="Reduce JPG and PNG file sizes directly in browser with real-time compression metrics."
                toolType="compress-image"
              />
            }
          />
          <Route
            path="/resize-image"
            element={
              <ToolPage
                title="Resize Image"
                description="Change image dimensions by exact pixels while preserving original aspect ratio."
                toolType="resize-image"
              />
            }
          />
          <Route
            path="/image-cropper"
            element={
              <ToolPage
                title="Crop Image"
                description="Crop your images to standard aspect ratios (1:1, 4:3, 16:9) in your browser."
                toolType="image-cropper"
              />
            }
          />
          <Route
            path="/image-rotator"
            element={
              <ToolPage
                title="Rotate Image"
                description="Rotate images 90°, 180°, or 270° clockwise with instant download."
                toolType="image-rotator"
              />
            }
          />
          <Route
            path="/image-flipper"
            element={
              <ToolPage
                title="Flip Image"
                description="Flip images horizontally or vertically in your browser."
                toolType="image-flipper"
              />
            }
          />
          <Route
            path="/image-to-base64"
            element={
              <ToolPage
                title="Image to Base64"
                description="Convert any image file into an encoded Base64 string or Data URI."
                toolType="image-to-base64"
              />
            }
          />
          <Route
            path="/base64-to-image"
            element={
              <ToolPage
                title="Base64 to Image"
                description="Paste a Base64 string to preview and download it as an image file."
                toolType="base64-to-image"
              />
            }
          />

          {/* =========================================================================
              Image Format Conversions (100% Client-Side Canvas)
          ========================================================================== */}
          <Route
            path="/jpg-to-png"
            element={
              <ToolPage
                title="JPG to PNG"
                description="Convert JPEG images to high-quality lossless PNG format."
                toolType="jpg-to-png"
              />
            }
          />
          <Route
            path="/png-to-jpg"
            element={
              <ToolPage
                title="PNG to JPG"
                description="Convert PNG images to standard JPG format with clean background rendering."
                toolType="png-to-jpg"
              />
            }
          />
          <Route
            path="/webp-to-jpg"
            element={
              <ToolPage
                title="WebP to JPG"
                description="Convert modern WebP images to widely compatible JPG format."
                toolType="webp-to-jpg"
              />
            }
          />
          <Route
            path="/jpg-to-webp"
            element={
              <ToolPage
                title="JPG to WebP"
                description="Convert JPG photos into lightweight WebP format for faster web loading."
                toolType="jpg-to-webp"
              />
            }
          />
          <Route
            path="/png-to-webp"
            element={
              <ToolPage
                title="PNG to WebP"
                description="Convert PNG graphics to WebP format for smaller file sizes."
                toolType="png-to-webp"
              />
            }
          />
          <Route
            path="/gif-to-png"
            element={
              <ToolPage
                title="GIF to PNG"
                description="Extract the first frame of a GIF image and save it as a high-quality PNG."
                toolType="gif-to-png"
              />
            }
          />
          <Route
            path="/bmp-to-jpg"
            element={
              <ToolPage
                title="BMP to JPG"
                description="Convert uncompressed bitmap (.bmp) images to universal JPG format."
                toolType="bmp-to-jpg"
              />
            }
          />

          {/* Legacy routes */}
          <Route
            path="/pdf-to-word"
            element={
              <ToolPage
                title="PDF to Word"
                description="Information on PDF to Word conversion in PDFlex."
                toolType="pdf-to-word"
              />
            }
          />
          <Route path="/pdf-to-excel" element={<Navigate to="/merge-pdf" replace />} />
          <Route path="/pdf-to-ppt" element={<Navigate to="/merge-pdf" replace />} />
          <Route path="/pdf-to-txt" element={<Navigate to="/merge-pdf" replace />} />
          <Route path="/pdf-to-jpg" element={<Navigate to="/images-to-pdf" replace />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;