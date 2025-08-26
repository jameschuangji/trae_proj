import os

class Config:
    # 飞书应用配置
    FEISHU_APP_ID = os.environ.get('FEISHU_APP_ID') or "cli_a7321294a738d01c"
    FEISHU_APP_SECRET = os.environ.get('FEISHU_APP_SECRET') or "L4uyDgQNH2xd7yE7A3BXubeTvrSy5dSy"
    
    # 多维表格配置
    BASE_ID = os.environ.get('BASE_ID') or "HrG6bqJf4auKfPsn3cic4VSHnic"
    TABLE_ID = os.environ.get('TABLE_ID') or "tblRfPUAZ8ewftUA"
    
    # Flask配置
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    DEBUG = True
    
    # 缓存配置
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = 300