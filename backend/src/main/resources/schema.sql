-- 创建江苏省考知识点管理系统数据库表

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    real_name VARCHAR(50),
    phone VARCHAR(20),
    exam_date DATE,
    target_score INT DEFAULT 0,
    current_level VARCHAR(20) DEFAULT 'beginner',
    total_study_time INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 知识点表
CREATE TABLE IF NOT EXISTS knowledge_points (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    subject VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    difficulty VARCHAR(20) DEFAULT 'medium',
    importance INT DEFAULT 3,
    estimated_time INT DEFAULT 30,
    prerequisites TEXT,
    related_points TEXT,
    tags TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 学习进度表
CREATE TABLE IF NOT EXISTS study_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    knowledge_point_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'not_started',
    progress_percentage INT DEFAULT 0,
    study_time INT DEFAULT 0,
    last_studied_at TIMESTAMP,
    mastery_level VARCHAR(20) DEFAULT 'unknown',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (knowledge_point_id) REFERENCES knowledge_points(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_knowledge_point (user_id, knowledge_point_id)
);

-- 学习路径表
CREATE TABLE IF NOT EXISTS study_paths (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    subject VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'medium',
    estimated_duration INT DEFAULT 30,
    knowledge_point_ids TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 用户学习路径关联表
CREATE TABLE IF NOT EXISTS user_study_paths (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    study_path_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'not_started',
    progress_percentage INT DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (study_path_id) REFERENCES study_paths(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_study_path (user_id, study_path_id)
);

-- 创建索引以提高查询性能
CREATE INDEX idx_knowledge_points_subject ON knowledge_points(subject);
CREATE INDEX idx_knowledge_points_category ON knowledge_points(category);
CREATE INDEX idx_knowledge_points_difficulty ON knowledge_points(difficulty);
CREATE INDEX idx_study_progress_user_id ON study_progress(user_id);
CREATE INDEX idx_study_progress_status ON study_progress(status);
CREATE INDEX idx_user_study_paths_user_id ON user_study_paths(user_id);
CREATE INDEX idx_user_study_paths_status ON user_study_paths(status);