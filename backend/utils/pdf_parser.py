import pdfplumber
from fastapi import UploadFile
import tempfile
import os

async def parse_resume(file: UploadFile) -> str:
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    extracted_text = ""
    try:
        with pdfplumber.open(tmp_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
    except Exception as e:
        raise ValueError(f"Unable to parse PDF content: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

    if not extracted_text.strip():
        raise ValueError("Could not extract readable text from the uploaded PDF file. Please ensure it is not scanned/empty.")

    return extracted_text.strip()