from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
import os

# 创建FastAPI应用实例
app = FastAPI(title="童话故事API", description="格林童话故事应用后端API服务")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库配置
DATABASE_URL = "sqlite:///./fairytales.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 数据库模型
class Story(Base):
    __tablename__ = "stories"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), index=True)
    content = Column(Text)
    image_url = Column(String(200))
    read_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password_hash = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

class Favorite(Base):
    __tablename__ = "favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    story_id = Column(Integer, ForeignKey("stories.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 依赖项
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 导入路由
from .routers import stories, auth, favorites, ranking, uploads, ai_generation
from fastapi.staticfiles import StaticFiles # 新增
import os # 新增

# 创建静态文件目录 (如果尚不存在)
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static") # 新增
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR) # 新增
IMAGES_DIR = os.path.join(STATIC_DIR, "images") # 新增
if not os.path.exists(IMAGES_DIR):
    os.makedirs(IMAGES_DIR) # 新增

app.include_router(stories.router)
app.include_router(auth.router)
app.include_router(favorites.router)
app.include_router(ranking.router)
app.include_router(uploads.router) # 新增
app.include_router(ai_generation.router) # 新增

# 挂载静态文件目录
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static") # 新增

from fastapi.responses import FileResponse # 新增

# 基本路由
@app.get("/")
async def read_root():
    # home_screen.html 位于项目的根目录，即 backend 目录的上一级
    home_html_path = os.path.join(os.path.dirname(__file__), "..", "home_screen.html")
    if os.path.exists(home_html_path):
        return FileResponse(home_html_path)
    else:
        return {"message": "home_screen.html not found"}

# 健康检查
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.get("/create")
async def serve_create_screen():
    html_path = os.path.join(os.path.dirname(__file__), "..", "create_screen.html")
    if os.path.exists(html_path):
        return FileResponse(html_path)
    else:
        raise HTTPException(status_code=404, detail="create_screen.html not found")

@app.get("/ranking")
async def serve_ranking_screen():
    html_path = os.path.join(os.path.dirname(__file__), "..", "ranking_screen.html")
    if os.path.exists(html_path):
        return FileResponse(html_path)
    else:
        raise HTTPException(status_code=404, detail="ranking_screen.html not found")

@app.get("/favorites")
async def serve_favorites_screen():
    html_path = os.path.join(os.path.dirname(__file__), "..", "favorites_screen.html")
    if os.path.exists(html_path):
        return FileResponse(html_path)
    else:
        raise HTTPException(status_code=404, detail="favorites_screen.html not found")

# 健康检查
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}