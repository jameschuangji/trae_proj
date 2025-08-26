from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from .. import main as database  # Adjusted import path
from ..models import story as story_models # Placeholder for Pydantic models

router = APIRouter(
    prefix="/stories",
    tags=["stories"],
    responses={404: {"description": "Not found"}},
)

# Pydantic Schemas for Stories
class StoryBase(story_models.BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None

class StoryCreate(StoryBase):
    pass

class StoryUpdate(StoryBase):
    title: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None

class Story(StoryBase):
    id: int
    read_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# API Endpoints for Stories
@router.post("/", response_model=Story, status_code=status.HTTP_201_CREATED)
async def create_story(story: StoryCreate, db: Session = Depends(database.get_db)):
    db_story = database.Story(**story.dict())
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story

@router.get("/", response_model=List[Story])
async def read_stories(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    stories = db.query(database.Story).offset(skip).limit(limit).all()
    return stories

@router.get("/{story_id}", response_model=Story)
async def read_story(story_id: int, db: Session = Depends(database.get_db)):
    db_story = db.query(database.Story).filter(database.Story.id == story_id).first()
    if db_story is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story not found")
    return db_story

@router.post("/", response_model=Story, status_code=status.HTTP_201_CREATED)
async def create_story(story: StoryCreate, db: Session = Depends(database.get_db)):
    db_story = database.Story(**story.dict())
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story

@router.put("/{story_id}", response_model=Story)
async def update_story(story_id: int, story: StoryUpdate, db: Session = Depends(database.get_db)):
    db_story = db.query(database.Story).filter(database.Story.id == story_id).first()
    if db_story is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story not found")
    
    update_data = story.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_story, key, value)
    
    db_story.updated_at = datetime.utcnow() # Ensure datetime is imported and used
    db.commit()
    db.refresh(db_story)
    return db_story

@router.delete("/{story_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_story(story_id: int, db: Session = Depends(database.get_db)):
    db_story = db.query(database.Story).filter(database.Story.id == story_id).first()
    if db_story is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story not found")
    db.delete(db_story)
    db.commit()
    return

# Ensure to add a health check or root endpoint if not present in main.py
# @router.get("/health")
# async def health_check():
#     return {"status": "healthy"}

@router.post("/{story_id}/read", response_model=Story)
async def increment_read_count(story_id: int, db: Session = Depends(database.get_db)):
    db_story = db.query(database.Story).filter(database.Story.id == story_id).first()
    if db_story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    db_story.read_count += 1
    db.commit()
    db.refresh(db_story)
    return db_story