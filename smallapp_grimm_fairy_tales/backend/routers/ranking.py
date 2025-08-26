from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from .. import main as database
from ..models import story as story_models # Using existing story model for response

router = APIRouter(
    prefix="/ranking",
    tags=["ranking"],
    responses={404: {"description": "Not found"}},
)

@router.get("/popular", response_model=List[story_models.Story])
async def get_popular_stories(
    limit: int = 10, 
    db: Session = Depends(database.get_db)
):
    """
    获取阅读量最高的童话故事列表。
    - **limit**: 返回的故事数量上限，默认为10。
    """
    popular_stories = db.query(database.Story)\
        .order_by(desc(database.Story.read_count))\
        .limit(limit)\
        .all()
    
    if not popular_stories:
        #  虽然技术上不是“未找到”，但如果没有故事，返回空列表是合适的。
        #  或者可以考虑返回一个特定的消息或状态码，但这取决于API设计决策。
        return [] 
        # raise HTTPException(status_code=404, detail="No stories found to rank")

    return popular_stories