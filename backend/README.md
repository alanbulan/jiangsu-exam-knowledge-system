# 江苏省考知识点管理系统 - 后端服务

## 项目简介

这是江苏省考知识点管理系统的Spring Boot后端服务，为前端React应用提供RESTful API接口。系统支持知识点管理、用户管理、学习进度跟踪等核心功能。

## 技术栈

- **框架**: Spring Boot 3.2.0
- **数据库**: MySQL 8.0+
- **ORM**: Spring Data JPA / Hibernate
- **安全**: Spring Security
- **构建工具**: Maven
- **Java版本**: 17+

## 项目结构

```
backend/
├── src/main/java/com/jiangsu/exam/
│   ├── JiangsuExamSystemApplication.java    # 主启动类
│   ├── config/                              # 配置类
│   │   ├── SecurityConfig.java              # 安全配置
│   │   └── DataInitializer.java             # 数据初始化
│   ├── controller/                          # 控制器层
│   │   ├── KnowledgePointController.java    # 知识点API
│   │   ├── UserController.java              # 用户API
│   │   └── StudyProgressController.java     # 学习进度API
│   ├── entity/                              # 实体类
│   │   ├── KnowledgePoint.java              # 知识点实体
│   │   ├── User.java                        # 用户实体
│   │   └── StudyProgress.java               # 学习进度实体
│   ├── repository/                          # 数据访问层
│   │   ├── KnowledgePointRepository.java    # 知识点仓库
│   │   ├── UserRepository.java              # 用户仓库
│   │   └── StudyProgressRepository.java     # 学习进度仓库
│   └── service/                             # 业务逻辑层
│       ├── KnowledgePointService.java       # 知识点服务
│       ├── UserService.java                 # 用户服务
│       └── StudyProgressService.java        # 学习进度服务
├── src/main/resources/
│   ├── application.yml                      # 应用配置
│   └── schema.sql                           # 数据库初始化脚本
└── pom.xml                                  # Maven配置
```

## 快速开始

### 1. 环境要求

- Java 17 或更高版本
- Maven 3.6+
- MySQL 8.0+

### 2. 数据库配置

1. 创建MySQL数据库：
```sql
CREATE DATABASE jiangsu_exam_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 修改 `src/main/resources/application.yml` 中的数据库连接信息：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/jiangsu_exam_system
    username: your_username
    password: your_password
```

### 3. 运行项目

```bash
# 进入后端目录
cd backend

# 安装依赖并运行
mvn spring-boot:run
```

服务将在 `http://localhost:8080` 启动。

### 4. 验证安装

访问 `http://localhost:8080/api/knowledge-points` 查看知识点列表。

## API 接口文档

### 知识点管理 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/knowledge-points` | 获取所有知识点 |
| GET | `/api/knowledge-points/{id}` | 根据ID获取知识点 |
| GET | `/api/knowledge-points/subject/{subject}` | 根据科目获取知识点 |
| GET | `/api/knowledge-points/search?keyword={keyword}` | 搜索知识点 |
| POST | `/api/knowledge-points` | 创建新知识点 |
| PUT | `/api/knowledge-points/{id}` | 更新知识点 |
| DELETE | `/api/knowledge-points/{id}` | 删除知识点 |

### 用户管理 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/users` | 获取所有用户 |
| GET | `/api/users/{id}` | 根据ID获取用户 |
| POST | `/api/users/register` | 用户注册 |
| POST | `/api/users/login` | 用户登录 |
| PUT | `/api/users/{id}` | 更新用户信息 |

### 学习进度 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/study-progress/user/{userId}` | 获取用户学习进度 |
| POST | `/api/study-progress/update` | 更新学习进度 |
| POST | `/api/study-progress/test-score` | 添加测试成绩 |
| GET | `/api/study-progress/user/{userId}/statistics` | 获取用户学习统计 |

## 数据模型

### 知识点 (KnowledgePoint)

```json
{
  "id": 1,
  "title": "数量关系基础",
  "content": "数量关系是行测的重要组成部分...",
  "subject": "行政职业能力测验",
  "category": "数量关系",
  "difficulty": "EASY",
  "tags": ["数学运算", "数字推理"],
  "prerequisites": ["基本数学概念"],
  "relatedTopics": ["数字推理", "图形推理"],
  "examples": ["例题：某班有40名学生..."],
  "exercises": ["练习1：计算题", "练习2：应用题"]
}
```

### 用户 (User)

```json
{
  "id": 1,
  "username": "testuser",
  "name": "测试用户",
  "email": "test@example.com",
  "phone": "13800138000",
  "targetExam": "江苏省考",
  "examDate": "2024-04-15",
  "studyGoal": "通过省考，进入公务员队伍"
}
```

### 学习进度 (StudyProgress)

```json
{
  "id": 1,
  "userId": 1,
  "knowledgePointId": 1,
  "status": "IN_PROGRESS",
  "progress": 60,
  "timeSpent": 120,
  "notes": "需要加强练习",
  "testScores": [85, 90, 78],
  "lastStudiedAt": "2024-01-15T10:30:00"
}
```

## 配置说明

### 应用配置 (application.yml)

```yaml
server:
  port: 8080

spring:
  application:
    name: jiangsu-exam-system
  
  datasource:
    url: jdbc:mysql://localhost:3306/jiangsu_exam_system
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true
```

### 安全配置

- 使用BCrypt加密用户密码
- 配置CORS支持前端跨域访问
- API接口暂时开放访问（生产环境需要添加JWT认证）

## 开发指南

### 添加新的API接口

1. 在对应的Controller中添加新方法
2. 在Service层实现业务逻辑
3. 如需要，在Repository层添加自定义查询方法

### 数据库迁移

修改实体类后，Spring Boot会自动更新数据库结构（ddl-auto: update）。

### 测试

```bash
# 运行单元测试
mvn test

# 运行集成测试
mvn verify
```

## 部署

### 打包应用

```bash
mvn clean package
```

### 运行JAR包

```bash
java -jar target/jiangsu-exam-system-1.0.0.jar
```

## 注意事项

1. **数据库连接**: 确保MySQL服务正在运行，并且连接信息正确
2. **端口冲突**: 默认端口8080，如有冲突请修改application.yml中的端口配置
3. **CORS配置**: 前端地址默认为localhost:5173，如有变更请修改SecurityConfig
4. **初始数据**: 首次运行会自动创建测试用户和示例知识点数据

## 联系方式

如有问题，请联系开发团队。