# backend/main.py
import os
import io
import zipfile
import tempfile
import fitz  # PyMuPDF
from pdf2docx import Converter
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response

app = FastAPI(title="PDFlex Open-Source Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Original-Size", "X-Compressed-Size", "X-Saved-Percent", "Content-Disposition"]
)

MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB

def cleanup_file(path: str):
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception:
        pass

@app.get("/api/health")
async def health():
    return {"status": "ok", "engine": "pymupdf+pdf2docx", "version": "1.0.0"}

# 1. Real PDF Compression (PyMuPDF deflate & garbage collection)
@app.post("/api/compress")
async def compress_pdf(
    file: UploadFile = File(...),
    level: str = Form("recommended"),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    contents = await file.read()
    original_size = len(contents)

    if original_size == 0:
        raise HTTPException(status_code=400, detail="The uploaded file is empty (0 bytes).")
    if original_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File exceeds the maximum limit of 25 MB.")

    try:
        doc = fitz.open(stream=contents, filetype="pdf")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid or corrupted PDF file: {str(e)}")

    output_buffer = io.BytesIO()

    # Configure compression level
    if level == "low":
        # Deflate only, minimal image recompression
        doc.save(output_buffer, garbage=2, deflate=True, clean=False)
    elif level == "extreme":
        # Aggressive garbage collection, deflation, linearization and image downsampling
        for page in doc:
            for img in page.get_images(full=True):
                xref = img[0]
                try:
                    pix = fitz.Pixmap(doc, xref)
                    if pix.width > 1200 or pix.height > 1200:
                        # Scale down image
                        factor = 1200 / max(pix.width, pix.height)
                        scaled_pix = fitz.Pixmap(pix, int(pix.width * factor), int(pix.height * factor), False)
                        doc.update_image(xref, scaled_pix)
                except Exception:
                    pass
        doc.save(output_buffer, garbage=4, deflate=True, clean=True, deflate_images=True)
    else:
        # "recommended": standard stream deflation & garbage collection
        doc.save(output_buffer, garbage=3, deflate=True, clean=True)

    doc.close()
    compressed_bytes = output_buffer.getvalue()
    compressed_size = len(compressed_bytes)

    # Ensure compressed file isn't larger than original (if it already had optimized streams)
    if compressed_size >= original_size:
        compressed_bytes = contents
        compressed_size = original_size
        saved_percent = 0.0
    else:
        saved_percent = round(((original_size - compressed_size) / original_size) * 100, 1)

    filename = file.filename or "document.pdf"
    base_name = os.path.splitext(filename)[0]
    out_name = f"{base_name}_compressed.pdf"

    return Response(
        content=compressed_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{out_name}"',
            "X-Original-Size": str(original_size),
            "X-Compressed-Size": str(compressed_size),
            "X-Saved-Percent": str(saved_percent),
        }
    )

# 2. PDF to Word (pdf2docx open-source converter)
@app.post("/api/pdf-to-docx")
async def pdf_to_docx(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File exceeds the maximum limit of 25 MB.")

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_in:
        temp_in.write(contents)
        temp_in_path = temp_in.name

    temp_out_path = temp_in_path.replace(".pdf", ".docx")

    try:
        cv = Converter(temp_in_path)
        cv.convert(temp_out_path, start=0, end=None)
        cv.close()

        if not os.path.exists(temp_out_path) or os.path.getsize(temp_out_path) == 0:
            raise HTTPException(status_code=500, detail="Failed to convert PDF to DOCX.")

        background_tasks.add_task(cleanup_file, temp_in_path)
        background_tasks.add_task(cleanup_file, temp_out_path)

        filename = file.filename or "document.pdf"
        base_name = os.path.splitext(filename)[0]
        out_name = f"{base_name}.docx"

        return FileResponse(
            temp_out_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=out_name
        )
    except Exception as e:
        cleanup_file(temp_in_path)
        cleanup_file(temp_out_path)
        raise HTTPException(status_code=500, detail=f"Conversion error: {str(e)}")

# 3. PDF to Text (PyMuPDF fast text extraction)
@app.post("/api/pdf-to-txt")
async def pdf_to_txt(file: UploadFile = File(...)):
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="The file is empty.")

    try:
        doc = fitz.open(stream=contents, filetype="pdf")
        extracted_text = []
        for idx, page in enumerate(doc):
            extracted_text.append(f"--- Page {idx + 1} ---\n" + page.get_text())
        doc.close()

        full_text = "\n\n".join(extracted_text)
        filename = file.filename or "document.pdf"
        base_name = os.path.splitext(filename)[0]
        out_name = f"{base_name}.txt"

        return Response(
            content=full_text,
            media_type="text/plain; charset=utf-8",
            headers={"Content-Disposition": f'attachment; filename="{out_name}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text extraction error: {str(e)}")

# 4. PDF to Images (PyMuPDF rendered to JPG or PNG, bundled as ZIP)
@app.post("/api/pdf-to-images")
async def pdf_to_images(
    file: UploadFile = File(...),
    fmt: str = Form("jpg")  # 'jpg' or 'png'
):
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="The file is empty.")

    try:
        doc = fitz.open(stream=contents, filetype="pdf")
        page_count = len(doc)
        if page_count == 0:
            raise HTTPException(status_code=400, detail="PDF has no pages.")

        base_name = os.path.splitext(file.filename or "document")[0]

        # If single page, return direct image
        if page_count == 1:
            page = doc[0]
            pix = page.get_pixmap(dpi=150)
            img_bytes = pix.tobytes("jpeg" if fmt == "jpg" else "png")
            doc.close()
            media = "image/jpeg" if fmt == "jpg" else "image/png"
            return Response(
                content=img_bytes,
                media_type=media,
                headers={"Content-Disposition": f'attachment; filename="{base_name}_page1.{fmt}"'}
            )

        # Multi-page: Bundle in in-memory ZIP archive
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for idx, page in enumerate(doc):
                pix = page.get_pixmap(dpi=150)
                img_data = pix.tobytes("jpeg" if fmt == "jpg" else "png")
                zip_file.writestr(f"{base_name}_page_{idx + 1}.{fmt}", img_data)

        doc.close()
        zip_bytes = zip_buffer.getvalue()

        return Response(
            content=zip_bytes,
            media_type="application/zip",
            headers={"Content-Disposition": f'attachment; filename="{base_name}_images.zip"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image rendering error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
