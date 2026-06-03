-- 扫雷游戏数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS minesweeper
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE minesweeper;

-- 创建用户表 (users)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(256) NOT NULL,
    avatar VARCHAR(256) DEFAULT 'default_avatar.png',
    total_games INT DEFAULT 0,
    wins INT DEFAULT 0,
    theme VARCHAR(20) DEFAULT 'classic',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建游戏记录表 (game_records)
CREATE TABLE IF NOT EXISTS game_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    time_used INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_difficulty (difficulty),
    INDEX idx_time_used (time_used)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 查看创建的表
SHOW TABLES;

-- 查看表结构
DESCRIBE users;
DESCRIBE game_records;

-- 使用说明:
-- 请在MySQL命令行中执行以下命令登录:
-- mysql -u root -p
-- 输入密码: lwx078@
-- 然后执行: SOURCE c:/Users/lenovo/Desktop/flask_game_platform/init_db.sql;
