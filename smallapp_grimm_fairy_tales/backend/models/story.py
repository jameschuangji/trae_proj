from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StoryBase(BaseModel):
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