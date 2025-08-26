from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import shutil
import os
from pathlib import Path
from datetime import datetime

from .. import main as database # For DB session if needed, though not directly for file saving
from ..core.security import get_current_active_user # Optional: if uploads are user-specific

router = APIRouter(
    prefix="/upload",
    tags=["uploads"],
    responses={404: {"description": "Not found"}},
)

# Define the upload directory relative to the backend folder
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "static" / "images"
# Ensure the upload directory exists
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/image/")
async def upload_image(
    file: UploadFile = File(...),
    # current_user: database.User = Depends(get_current_active_user) # Uncomment if auth is needed
):
    """
    上传图片文件。
    - **file**: 要上传的图片文件。
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")

    try:
        # Create a unique filename to avoid overwrites
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
        filename = f"{timestamp}_{file.filename}"
        file_path = UPLOAD_DIR / filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Construct the URL to access the file (adjust if your static files are served differently)
        # This assumes static files are served from /static/images relative to the API base URL
        file_url = f"/static/images/{filename}" 
        
        return JSONResponse(content={"filename": filename, "file_url": file_url}, status_code=201)
    except Exception as e:
        # Log the exception e for debugging
        raise HTTPException(status_code=500, detail=f"Could not upload file: {e}")

# Note: To serve these static files, you'll need to configure static file serving in your main.py
# For example:
# from fastapi.staticfiles import StaticFiles
# app.mount("/static", StaticFiles(directory="backend/static"), name="static")