from pydantic import BaseModel
from typing import Optional

class AIStoryPrompt(BaseModel):
    prompt: str
    image_url: Optional[str] = None # Optional image to base the story on
    max_length: Optional[int] = 200 # Optional desired max length of the story

class AIStoryResponse(BaseModel):
    title: str
    generated_story: str
    # Potentially include the original prompt or image_url if needed for context
    original_prompt: Optional[str] = None
    input_image_url: Optional[str] = None