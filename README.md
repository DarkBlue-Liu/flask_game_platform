# 扫雷游戏平台

一个功能完整的扫雷游戏平台，包含用户系统、成绩记录和排行榜功能。

## 功能特性

### 游戏功能
- ✅ 三种难度级别：
  - 初级：9×9，10个雷
  - 中级：16×16，40个雷
  - 高级：30×16，99个雷
- ✅ 左键点击翻开方块
- ✅ 右键点击插旗/取消插旗
- ✅ 空白区域自动展开
- ✅ 剩余雷数显示
- ✅ 游戏计时器
- ✅ 重置游戏功能
- ✅ 胜利/失败判定

### 用户系统
- ✅ 用户注册
- ✅ 用户登录/注销
- ✅ 个人中心（显示总游戏数、胜利数）

### 数据记录
- ✅ 胜利时自动保存成绩
- ✅ 按难度分榜的排行榜（显示前10名）

### 个性化设置
- ✅ 两种主题切换：
  - 经典复古风
  - 现代扁平风
- ✅ 主题设置保存到数据库

## 技术栈

- **后端**：Flask + Flask-SQLAlchemy + Flask-Login
- **数据库**：MySQL
- **前端**：原生 HTML/CSS/JavaScript

## 环境准备

### 1. 安装Python依赖

```bash
pip install -r requirements.txt
```

### 2. 配置MySQL数据库

确保MySQL已安装并运行，然后创建数据库：

```sql
CREATE DATABASE minesweeper CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 修改数据库配置（如需要）

编辑 `config.py` 文件，修改数据库连接字符串：

```python
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://用户名:密码@localhost/minesweeper?charset=utf8mb4'
```

当前配置为：
- 用户名：root
- 密码：lwx078@
- 数据库名：minesweeper

## 运行项目

```bash
python app.py
```

然后在浏览器中打开：`http://localhost:5000`

## 项目结构

```
flask_game_platform/
├── app.py                 # 主应用文件
├── config.py              # 配置文件
├── requirements.txt       # 依赖列表
├── README.md             # 项目说明
├── templates/            # HTML模板
│   ├── base.html         # 基础模板
│   ├── index.html        # 游戏主页
│   ├── login.html        # 登录页
│   ├── register.html     # 注册页
│   └── profile.html      # 个人中心
└── static/               # 静态资源
    ├── css/
    │   └── style.css     # 样式文件
    └── js/
        └── minesweeper.js # 游戏逻辑
```

## 使用说明

1. **注册账号**：首次使用请先注册账号
2. **选择难度**：点击初级/中级/高级按钮选择难度
3. **开始游戏**：左键点击方块开始游戏
4. **标记地雷**：右键点击插旗标记可疑位置
5. **重置游戏**：点击🔄按钮重新开始
6. **查看排行榜**：右侧显示各难度的最快成绩
7. **切换主题**：在个人中心可切换经典/现代主题

祝游戏愉快！🎉
