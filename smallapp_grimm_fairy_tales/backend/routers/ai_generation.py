from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import main as database # For DB session if needed
from ..models import ai_story as ai_story_models
from ..core.security import get_current_active_user # Optional: if generation is user-specific

router = APIRouter(
    prefix="/ai",
    tags=["ai_generation"],
    responses={404: {"description": "Not found"}},
)

@router.post("/generate-story/", response_model=ai_story_models.AIStoryResponse)
async def generate_story_via_ai(
    prompt_data: ai_story_models.AIStoryPrompt,
    db: Session = Depends(database.get_db), # Included for potential future use (e.g., logging requests)
    # current_user: database.User = Depends(get_current_active_user) # Uncomment if auth is needed
):
    """
    接收文本提示（和可选图片）以生成童话故事。
    
    这是一个占位符实现。实际的AI集成将需要调用外部AI服务。
    """
    # Placeholder AI generation logic
    # In a real application, you would call an AI model/service here
    # For example, using OpenAI, Hugging Face, or a custom model.
    
    if not prompt_data.prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    # Simulate AI response
    generated_title = f"AI故事：基于 '{prompt_data.prompt[:20]}...'"
    generated_text = f"从前，有一个关于 '{prompt_data.prompt}' 的奇妙故事。"
    if prompt_data.image_url:
        generated_text += f" 这个故事还受到了图片 {prompt_data.image_url} 的启发。"
    if prompt_data.max_length:
        generated_text += f" (故事长度被限制在 {prompt_data.max_length} 字以内)。"
    
    #  这里只是简单重复，实际应用中会是AI生成的不同内容
    generated_text += "...这是一个由AI助手生成的精彩故事的开头。完整的故事会更加丰富和引人入胜。"

    return ai_story_models.AIStoryResponse(
        title=generated_title,
        generated_story=generated_text,
        original_prompt=prompt_data.prompt,
        input_image_url=prompt_data.image_url
    )

# You might add other AI-related endpoints here, e.g., for image generation if needed.