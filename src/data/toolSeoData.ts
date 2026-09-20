// src/data/toolSeoData.ts

export interface ToolSeoContent {
  h1: string;
  subtitle: string;
  howToTitle: string;
  steps: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export const toolSeoData: Record<string, ToolSeoContent> = {
  merge: {
    h1: "Merge PDF Online for Free",
    subtitle: "Combine multiple PDF files into one document. Upload your PDFs, arrange them in the order you want, and download the merged file.",
    howToTitle: "How to merge PDF files",
    steps: [
      { title: "Select your PDF files", desc: "Drag and drop two or more PDF files into the upload box or click Browse." },
      { title: "Arrange them in the required order", desc: "Review your selected documents in the list before processing." },
      { title: "Click Merge PDF", desc: "Your files are combined locally in browser memory without being uploaded to any server." },
      { title: "Download your combined PDF", desc: "Save your merged document immediately to your computer or phone." }
    ],
    faqs: [
      { q: "How many PDFs can I merge?", a: "You can merge as many PDF files as needed, up to 25 MB in total." },
      { q: "Can I merge PDFs on my phone?", a: "Yes. PDFlex runs smoothly in mobile browsers on iOS Safari and Android Chrome." },
      { q: "Does merging change the quality?", a: "No. Merging preserves the original text, vector formatting, and resolution of your source PDFs." },
      { q: "Are my files uploaded?", a: "No. The entire merge operation runs locally inside your browser on your device." }
    ]
  },

  split: {
    h1: "Split PDF Online for Free",
    subtitle: "Extract selected pages or split a PDF into separate documents directly in your browser.",
    howToTitle: "How to split a PDF file",
    steps: [
      { title: "Select your PDF file", desc: "Upload the PDF document you want to extract pages from." },
      { title: "Specify pages or range", desc: "Type the page numbers or ranges to extract (e.g. 1-3, 5)." },
      { title: "Click Process Locally", desc: "The designated pages are separated in browser memory." },
      { title: "Download split document", desc: "Save your newly extracted PDF instantly." }
    ],
    faqs: [
      { q: "Can I extract non-consecutive pages?", a: "Yes. You can enter comma-separated numbers and ranges like 1, 3, 5-7." },
      { q: "Does splitting delete my original file?", a: "No. Your original file remains untouched on your device." },
      { q: "Are my documents kept private?", a: "Yes. All processing happens locally on your computer or phone without server uploads." }
    ]
  },

  rotate: {
    h1: "Rotate PDF Pages Online",
    subtitle: "Rotate PDF pages by 90°, 180°, or 270° and save the updated document permanently.",
    howToTitle: "How to rotate PDF pages",
    steps: [
      { title: "Choose your PDF file", desc: "Upload the document with orientation issues." },
      { title: "Select rotation angle", desc: "Choose 90°, 180°, or 270° clockwise rotation." },
      { title: "Click Process Locally", desc: "The pages are permanently rotated in browser memory." },
      { title: "Download updated PDF", desc: "Download your correctly oriented document." }
    ],
    faqs: [
      { q: "Is the rotation permanent?", a: "Yes. When you download the file, the new rotation is saved into the PDF specifications." },
      { q: "Will rotating alter the document text or formatting?", a: "No. Only the page viewport angle changes; text and images remain sharp." }
    ]
  },

  "delete-pages": {
    h1: "Delete PDF Pages Online",
    subtitle: "Remove unwanted, duplicate, or blank pages from your PDF document quickly and easily.",
    howToTitle: "How to delete pages from a PDF",
    steps: [
      { title: "Select your PDF file", desc: "Choose the PDF document containing pages you want to remove." },
      { title: "Enter pages to delete", desc: "Specify page numbers to discard, such as 1, 4-6." },
      { title: "Click Process Locally", desc: "The remaining pages are assembled into a clean document." },
      { title: "Download clean PDF", desc: "Download your updated document with unwanted pages removed." }
    ],
    faqs: [
      { q: "Can I delete multiple pages at once?", a: "Yes. You can delete single pages or ranges like 2, 5-8." },
      { q: "Can I delete all pages?", a: "No. A valid PDF document must contain at least one page." }
    ]
  },

  watermark: {
    h1: "Add Watermark to PDF Online",
    subtitle: "Add text watermarks to your PDF pages before sharing or submitting your document.",
    howToTitle: "How to watermark a PDF",
    steps: [
      { title: "Select your PDF file", desc: "Choose the document you want to protect." },
      { title: "Enter watermark text", desc: "Type your text, such as CONFIDENTIAL, DRAFT, or your company name." },
      { title: "Click Process Locally", desc: "The watermark is stamped diagonally across every page." },
      { title: "Download watermarked PDF", desc: "Save your watermarked document immediately." }
    ],
    faqs: [
      { q: "Does the watermark appear on all pages?", a: "Yes. The text watermark is uniformly stamped across each page of your document." },
      { q: "Can recipients remove the watermark easily?", a: "The text becomes part of the PDF page content stream, making casual removal difficult." }
    ]
  },

  "page-numbers": {
    h1: "Add Page Numbers to PDF Online",
    subtitle: "Number your PDF pages automatically with customizable starting numbers directly in your browser.",
    howToTitle: "How to add page numbers to a PDF",
    steps: [
      { title: "Upload your PDF", desc: "Select the document needing page numbering." },
      { title: "Set starting number", desc: "Choose the starting number (default is 1)." },
      { title: "Click Process Locally", desc: "Page numbers are calculated and placed at the bottom of each page." },
      { title: "Download numbered PDF", desc: "Save your cleanly indexed document." }
    ],
    faqs: [
      { q: "Where are page numbers positioned?", a: "Page numbers are centered cleanly along the bottom margin of each page." },
      { q: "Can I start numbering from a number other than 1?", a: "Yes. You can set any positive starting number you need." }
    ]
  },

  "compress-pdf": {
    h1: "Compress PDF Online for Free",
    subtitle: "Reduce PDF file size directly in your browser by optimizing object streams and removing redundant metadata.",
    howToTitle: "How to compress a PDF file",
    steps: [
      { title: "Select your PDF document", desc: "Upload a PDF you want to reduce in size." },
      { title: "Click Process Locally", desc: "Browser-based stream deflation optimizes file structure." },
      { title: "Check compression metrics", desc: "See your original size, compressed size, and percentage saved." },
      { title: "Download smaller PDF", desc: "Save your lightweight PDF for email and web forms." }
    ],
    faqs: [
      { q: "How does browser PDF compression work?", a: "PDFlex rewrites object cross-reference tables and deflates uncompressed content streams locally." },
      { q: "Are my documents uploaded to a remote server?", a: "No. Compression runs 100% inside your browser memory." }
    ]
  },

  "images-to-pdf": {
    h1: "Convert Images to PDF Online",
    subtitle: "Combine JPG, PNG, WebP, GIF, and other supported images into a single PDF document.",
    howToTitle: "How to convert images to PDF",
    steps: [
      { title: "Select your images", desc: "Choose one or multiple photos from your phone or computer." },
      { title: "Review selected images", desc: "Check the files in the list to make sure they are in the desired order." },
      { title: "Click Process Locally", desc: "Images are scaled and embedded into a single multi-page PDF." },
      { title: "Download your PDF", desc: "Save your compiled PDF document instantly." }
    ],
    faqs: [
      { q: "Which image formats can I convert?", a: "PDFlex supports JPG, JPEG, PNG, WebP, GIF, and BMP image files." },
      { q: "Can I convert multiple images at once?", a: "Yes. You can select multiple images to compile them into a multi-page PDF document." }
    ]
  },

  "compress-image": {
    h1: "Compress Image Online for Free",
    subtitle: "Reduce JPG, PNG, or WebP file sizes for websites, forms, email, and sharing.",
    howToTitle: "How to compress images online",
    steps: [
      { title: "Select an image file", desc: "Upload a JPG, PNG, or WebP picture from your device." },
      { title: "Adjust quality slider", desc: "Slide between smaller file size and higher image clarity." },
      { title: "Click Process Locally", desc: "HTML5 Canvas recompresses the image in milliseconds." },
      { title: "Download compressed image", desc: "View the percentage saved and download your optimized photo." }
    ],
    faqs: [
      { q: "How much file size can I save?", a: "Depending on image complexity and quality settings, you can often save 40% to 80% of file size." },
      { q: "Does image compression happen in my browser?", a: "Yes. Processing is completed on your device using HTML5 Canvas with zero upload." }
    ]
  },

  "resize-image": {
    h1: "Resize Image Online",
    subtitle: "Resize an image by width and height while keeping its proportions when needed.",
    howToTitle: "How to resize an image",
    steps: [
      { title: "Select your image", desc: "Choose a photo or graphic to resize." },
      { title: "Enter target dimensions", desc: "Type in target width or height in pixels. Aspect ratio locks automatically by default." },
      { title: "Click Process Locally", desc: "The image is resampled smoothly on high-resolution canvas." },
      { title: "Download resized image", desc: "Save your newly dimensioned photo." }
    ],
    faqs: [
      { q: "Will resizing distort my image?", a: "No. With the 'Maintain aspect ratio' option enabled, height and width scale proportionally." },
      { q: "Can I enlarge small images?", a: "Yes, though images resized beyond their original resolution may appear softer." }
    ]
  },

  "jpg-to-png": {
    h1: "Convert JPG to PNG Online",
    subtitle: "Convert JPEG photos into clean lossless PNG images directly in your browser.",
    howToTitle: "How to convert JPG to PNG",
    steps: [
      { title: "Upload your JPG image", desc: "Select a .jpg or .jpeg file from your device." },
      { title: "Click Process Locally", desc: "The photo is drawn and converted to PNG format." },
      { title: "Download PNG", desc: "Save your new PNG graphic immediately." }
    ],
    faqs: [
      { q: "Why convert JPG to PNG?", a: "PNG format offers lossless quality, making it ideal for screenshots, text, and editing." }
    ]
  },

  "png-to-jpg": {
    h1: "Convert PNG to JPG Online",
    subtitle: "Convert PNG graphics into standard JPG images with clean background rendering.",
    howToTitle: "How to convert PNG to JPG",
    steps: [
      { title: "Upload your PNG image", desc: "Select a .png image file." },
      { title: "Click Process Locally", desc: "Transparent pixels are rendered with clean solid white background." },
      { title: "Download JPG", desc: "Save your lightweight JPEG image." }
    ],
    faqs: [
      { q: "What happens to transparent backgrounds?", a: "Since JPG does not support transparency, clear areas are cleanly filled with white." }
    ]
  },

  "webp-to-jpg": {
    h1: "Convert WebP to JPG Online",
    subtitle: "Convert modern WebP images to universal JPG format for compatibility with all viewers.",
    howToTitle: "How to convert WebP to JPG",
    steps: [
      { title: "Upload WebP file", desc: "Select a .webp photo." },
      { title: "Click Process Locally", desc: "Decodes WebP and encodes standard JPEG." },
      { title: "Download JPG", desc: "Save your universally compatible image." }
    ],
    faqs: [
      { q: "Why convert WebP to JPG?", a: "Some older photo viewers, editors, and upload forms do not yet support the WebP format." }
    ]
  },

  "image-cropper": {
    h1: "Crop Image Online",
    subtitle: "Crop photos to standard aspect ratios (1:1 Square, 4:3, 16:9) in your browser.",
    howToTitle: "How to crop an image",
    steps: [
      { title: "Select your image", desc: "Upload the picture you want to crop." },
      { title: "Choose aspect ratio preset", desc: "Select 1:1 for social avatars, 4:3 for photos, or 16:9 for landscape." },
      { title: "Click Process Locally", desc: "The image is cropped centered around the focal area." },
      { title: "Download cropped image", desc: "Save your newly cropped photo." }
    ],
    faqs: [
      { q: "Does cropping reduce image resolution?", a: "It only trims the outer edges according to your ratio, keeping original pixels inside the crop." }
    ]
  },

  "image-rotator": {
    h1: "Rotate Image Online",
    subtitle: "Rotate photos by 90°, 180°, or 270° clockwise with instant download.",
    howToTitle: "How to rotate an image",
    steps: [
      { title: "Choose your image", desc: "Select the photo you need to orient." },
      { title: "Select angle", desc: "Click 90°, 180°, or 270°." },
      { title: "Click Process Locally", desc: "Image dimensions adapt and rotate cleanly." },
      { title: "Download rotated image", desc: "Save your updated photo." }
    ],
    faqs: [
      { q: "Are width and height adjusted when rotating 90 degrees?", a: "Yes. For 90° and 270° rotations, width and height automatically swap." }
    ]
  },

  "image-flipper": {
    h1: "Flip Image Online",
    subtitle: "Mirror images horizontally or vertically in your browser without watermarks.",
    howToTitle: "How to flip an image",
    steps: [
      { title: "Select photo", desc: "Upload the image you want to mirror." },
      { title: "Choose direction", desc: "Click Horizontal (left-to-right) or Vertical (upside-down)." },
      { title: "Click Process Locally", desc: "The image is mirrored on canvas." },
      { title: "Download flipped photo", desc: "Save your mirrored image." }
    ],
    faqs: [
      { q: "Can I flip selfies that were saved backwards?", a: "Yes. Horizontal flip mirrors the photo back to its natural orientation." }
    ]
  },

  "image-to-base64": {
    h1: "Convert Image to Base64 Online",
    subtitle: "Encode any image file into a copyable Base64 string or Data URI for web development.",
    howToTitle: "How to convert an image to Base64",
    steps: [
      { title: "Upload image", desc: "Select any JPG, PNG, WebP, or SVG file." },
      { title: "Click Process Locally", desc: "The file is encoded into a Data URL string." },
      { title: "Copy or download", desc: "Click Copy to clipboard or download the string as a text file." }
    ],
    faqs: [
      { q: "What can I use Base64 images for?", a: "Base64 strings can be embedded directly into HTML `<img>` tags or CSS `background-image` without external file hosting." }
    ]
  },

  "base64-to-image": {
    h1: "Convert Base64 to Image Online",
    subtitle: "Paste a Base64 text string to view and save it as an image file on your computer or phone.",
    howToTitle: "How to decode Base64 into an image",
    steps: [
      { title: "Paste Base64 string", desc: "Paste raw Base64 or a `data:image/...` URI into the text box." },
      { title: "Click Decode", desc: "The string is decoded into image binary data." },
      { title: "Download image", desc: "Save the resulting image file to your device." }
    ],
    faqs: [
      { q: "Do I need the data URI prefix?", a: "No. Both raw Base64 strings and full Data URIs are supported." }
    ]
  }
};
