from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import main as database
from ..models import favorite as favorite_models
from ..core.security import get_current_active_user

router = APIRouter(
    prefix="/favorites",
    tags=["favorites"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=favorite_models.Favorite, status_code=status.HTTP_201_CREATED)
async def add_favorite(
    favorite: favorite_models.FavoriteCreate,
    db: Session = Depends(database.get_db),
    current_user: database.User = Depends(get_current_active_user)
):
    # 检查故事是否存在
    story = db.query(database.Story).filter(database.Story.id == favorite.story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    # 检查是否已经收藏
    existing_favorite = db.query(database.Favorite).filter(
        database.Favorite.user_id == current_user.id,
        database.Favorite.story_id == favorite.story_id
    ).first()
    if existing_favorite:
        raise HTTPException(status_code=400, detail="Story already in favorites")
    
    # 创建新收藏
    db_favorite = database.Favorite(
        user_id=current_user.id,
        story_id=favorite.story_id
    )
    db.add(db_favorite)
    db.commit()
    db.refresh(db_favorite)
    return db_favorite

@router.get("/", response_model=List[favorite_models.Favorite])
async def read_favorites(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
    current_user: database.User = Depends(get_current_active_user)
):
    favorites = db.query(database.Favorite)\
        .filter(database.Favorite.user_id == current_user.id)\
        .offset(skip)\
        .limit(limit)\
        .all()
    return favorites

@router.delete("/{story_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_favorite(
    story_id: int,
    db: Session = Depends(database.get_db),
    current_user: database.User = Depends(get_current_active_user)
):
    favorite = db.query(database.Favorite).filter(
        database.Favorite.user_id == current_user.id,
        database.Favorite.story_id == story_id
    ).first()
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    db.delete(favorite)
    db.commit()
    return

@router.get("/check/{story_id}", response_model=bool)
async def check_favorite(
    story_id: int,
    db: Session = Depends(database.get_db),
    current_user: database.User = Depends(get_current_active_user)
):
    favorite = db.query(database.Favorite).filter(
        database.Favorite.user_id == current_user.id,
        database.Favorite.story_id == story_id
    ).first()
    return favorite is not None