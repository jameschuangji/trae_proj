from flask import Flask, render_template, jsonify
from flask_caching import Cache
import requests
import json
from config import Config
from typing import Dict, List, Optional

app = Flask(__name__)
app.config.from_object(Config)
cache = Cache(app)

class FeishuAPI:
    def __init__(self, app_id: str, app_secret: str):
        self.app_id = app_id
        self.app_secret = app_secret
        self.base_url = "https://open.feishu.cn/open-apis"
        self.access_token = None
    
    def get_access_token(self) -> Optional[str]:
        """获取飞书访问令牌"""
        url = f"{self.base_url}/auth/v3/tenant_access_token/internal"
        payload = {
            "app_id": self.app_id,
            "app_secret": self.app_secret
        }
        
        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            
            if data.get("code") == 0:
                self.access_token = data.get("tenant_access_token")
                return self.access_token
            else:
                app.logger.error(f"获取访问令牌失败: {data.get('msg')}")
                return None
        except requests.RequestException as e:
            app.logger.error(f"请求访问令牌时发生错误: {str(e)}")
            return None
    
    def get_table_records(self, base_id: str, table_id: str) -> List[Dict]:
        """获取多维表格记录"""
        if not self.access_token:
            if not self.get_access_token():
                return []
        
        url = f"{self.base_url}/bitable/v1/apps/{base_id}/tables/{table_id}/records"
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            if data.get("code") == 0:
                return data.get("data", {}).get("items", [])
            else:
                app.logger.error(f"获取表格记录失败: {data.get('msg')}")
                return []
        except requests.RequestException as e:
            app.logger.error(f"请求表格记录时发生错误: {str(e)}")
            return []

# 初始化飞书API
feishu_api = FeishuAPI(app.config['FEISHU_APP_ID'], app.config['FEISHU_APP_SECRET'])

@cache.cached(timeout=300, key_prefix='articles')
def get_articles() -> List[Dict]:
    """获取文章列表（带缓存）"""
    records = feishu_api.get_table_records(app.config['BASE_ID'], app.config['TABLE_ID'])
    articles = []
    
    for record in records:
        fields = record.get('fields', {})
        article = {
            'id': record.get('record_id'),
            'title': fields.get('标题', ''),
            'quote': fields.get('金句输出', ''),
            'review': fields.get('黄叔点评', ''),
            'content': fields.get('概要内容输出', ''),
            'preview': fields.get('概要内容输出', '')[:100] + '...' if len(fields.get('概要内容输出', '')) > 100 else fields.get('概要内容输出', '')
        }
        articles.append(article)
    
    return articles

@app.route('/')
def index():
    """首页"""
    articles = get_articles()
    return render_template('index.html', articles=articles)

@app.route('/article/<article_id>')
def article_detail(article_id: str):
    """文章详情页"""
    articles = get_articles()
    article = next((a for a in articles if a['id'] == article_id), None)
    
    if not article:
        return render_template('404.html'), 404
    
    return render_template('detail.html', article=article)

@app.route('/api/articles')
def api_articles():
    """API接口：获取文章列表"""
    articles = get_articles()
    return jsonify({
        'code': 0,
        'data': articles,
        'message': 'success'
    })

@app.route('/api/article/<article_id>')
def api_article_detail(article_id: str):
    """API接口：获取文章详情"""
    articles = get_articles()
    article = next((a for a in articles if a['id'] == article_id), None)
    
    if not article:
        return jsonify({
            'code': 404,
            'data': None,
            'message': 'Article not found'
        }), 404
    
    return jsonify({
        'code': 0,
        'data': article,
        'message': 'success'
    })

@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)