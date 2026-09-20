import fitz
import io
import urllib.request

def run_tests():
    print("Running PDFlex Open-Source Engine tests...")

    # 1. Create a sample PDF
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    page.insert_text((50, 100), "Hello PDFlex! This is a test document for open-source conversions.", fontsize=16)
    page.insert_text((50, 150), "PDF to Word, PDF Compression, and Text Extraction.", fontsize=12)
    pdf_bytes = doc.tobytes()
    doc.close()

    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"

    # 2. Test Compress Endpoint
    body_compress = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="sample.pdf"\r\n'
        f"Content-Type: application/pdf\r\n\r\n"
    ).encode("utf-8") + pdf_bytes + f"\r\n--{boundary}\r\nContent-Disposition: form-data; name=\"level\"\r\n\r\nrecommended\r\n--{boundary}--\r\n".encode("utf-8")

    req_compress = urllib.request.Request(
        "http://127.0.0.1:8000/api/compress",
        data=body_compress,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )
    with urllib.request.urlopen(req_compress) as resp:
        print(f"[PASS] COMPRESS: Status {resp.status}, Saved: {resp.headers.get('X-Saved-Percent')}%")

    # 3. Test PDF to DOCX Endpoint
    body_docx = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="sample.pdf"\r\n'
        f"Content-Type: application/pdf\r\n\r\n"
    ).encode("utf-8") + pdf_bytes + f"\r\n--{boundary}--\r\n".encode("utf-8")

    req_docx = urllib.request.Request(
        "http://127.0.0.1:8000/api/pdf-to-docx",
        data=body_docx,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )
    with urllib.request.urlopen(req_docx) as resp:
        docx_data = resp.read()
        print(f"[PASS] PDF TO DOCX: Status {resp.status}, Generated DOCX: {len(docx_data)} bytes")

    # 4. Test PDF to TXT Endpoint
    req_txt = urllib.request.Request(
        "http://127.0.0.1:8000/api/pdf-to-txt",
        data=body_docx,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )
    with urllib.request.urlopen(req_txt) as resp:
        txt_content = resp.read().decode("utf-8")
        print(f"[PASS] PDF TO TXT: Status {resp.status}, Extracted text: {repr(txt_content[:50])}")

    # 5. Test PDF to Images Endpoint
    body_img = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="sample.pdf"\r\n'
        f"Content-Type: application/pdf\r\n\r\n"
    ).encode("utf-8") + pdf_bytes + f"\r\n--{boundary}\r\nContent-Disposition: form-data; name=\"fmt\"\r\n\r\njpg\r\n--{boundary}--\r\n".encode("utf-8")

    req_img = urllib.request.Request(
        "http://127.0.0.1:8000/api/pdf-to-images",
        data=body_img,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )
    with urllib.request.urlopen(req_img) as resp:
        img_data = resp.read()
        print(f"[PASS] PDF TO IMAGES: Status {resp.status}, Rendered image size: {len(img_data)} bytes")

    print("\nALL BACKEND OPEN-SOURCE TESTS PASSED!")

if __name__ == "__main__":
    run_tests()
