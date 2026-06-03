# 扫雷游戏 - 快速启动指南

## 已完成功能

✅ **Flask框架** - 完整的Flask应用搭建
✅ **MySQL数据库配置** - SQLAlchemy ORM配置
✅ **用户表(users)** - 包含用户名、密码哈希、游戏统计、主题设置等字段
✅ **游戏记录表(game_records)** - 记录游戏难度、用时、创建时间等
✅ **用户注册/登录** - 使用Flask-Login管理会话
✅ **密码安全** - 使用Werkzeug的密码哈希函数

## 快速启动步骤

### 1. 创建MySQL数据库

方法一：使用命令行
```bash
mysql -u root -p
```
然后输入密码：`lwx078@`

方法二：使用MySQL客户端直接运行 `init_db.sql` 文件内容

### 2. 安装Python依赖

```bash
cd c:\Users\lenovo\Desktop\flask_game_platform
pip install -r requirements.txt
```

### 3. 数据库配置（已配置）

编辑 `config.py`，数据库连接信息已配置：
```python
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:lwx078@@localhost/minesweeper?charset=utf8mb4'
```

当前配置：
- 用户名：root
- 密码：lwx078@
- 数据库名：minesweeper

### 4. 启动Flask应用

```bash
python app.py
```

### 5. 访问应用

在浏览器中打开：`http://localhost:5000`

## 数据库表结构

### users 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | Integer | 主键 |
| username | String(50) | 用户名（唯一） |
| password_hash | String(256) | 密码哈希值 |
| avatar | String(256) | 头像文件名 |
| total_games | Integer | 总游戏局数 |
| wins | Integer | 胜利局数 |
| theme | String(20) | 主题设置（classic/modern） |
| created_at | DateTime | 创建时间 |
| updated_at | DateTime | 更新时间 |

### game_records 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | Integer | 主键 |
| user_id | Integer | 外键关联用户 |
| difficulty | String(20) | 难度（easy/medium/hard） |
| time_used | Integer | 用时（秒） |
| created_at | DateTime | 创建时间 |

## 功能说明

- **注册账号**：访问 `/register` 页面
- **登录**：访问 `/login` 页面
- **个人中心**：访问 `/profile` 页面（需登录）
- **扫雷游戏**：首页即可玩
- **排行榜**：首页右侧显示

## 注意事项

1. 首次运行 `app.py` 会自动创建数据库表
2. 密码使用安全哈希存储，不会明文保存
3. 确保MySQL服务正在运行
4. 数据库密码已配置为：`lwx078@`
