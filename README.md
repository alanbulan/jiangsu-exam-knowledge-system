# 江苏省考知识点模块化管理系统

一个基于React + Spring Boot的江苏省考知识点管理系统，提供知识点管理、学习路径规划、进度跟踪等功能。

## 🚀 功能特性

- 📚 **知识点管理**: 完整的知识点CRUD操作，支持分类管理
- 🗺️ **知识图谱**: 可视化展示知识点之间的关系
- 🛤️ **学习路径**: 系统化的学习路径规划
- 📊 **进度跟踪**: 详细的学习进度统计和分析
- 🔍 **智能搜索**: 多维度搜索和筛选功能
- 👤 **用户管理**: 个人资料管理和学习偏好设置

## 🛠️ 技术栈

### 前端
- React 18 + TypeScript
- Ant Design UI组件库
- Tailwind CSS样式框架
- Redux Toolkit状态管理
- Vite构建工具
- D3.js + React Flow可视化

### 后端
- Spring Boot 3.2
- Spring Data JPA
- MySQL 8.0数据库
- Maven依赖管理
- RESTful API设计

## 📦 安装和运行

### 环境要求
- Node.js 16+
- Java 17+
- MySQL 8.0+
- Maven 3.6+

### 1. 克隆项目
```bash
git clone <repository-url>
cd jiangsu-exam-knowledge-system
```

### 2. 数据库配置
创建MySQL数据库：
```sql
CREATE DATABASE jiangsu_exam_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 后端启动
```bash
cd backend
mvn spring-boot:run
```
后端服务将在 http://localhost:8080/api 启动

### 4. 前端启动
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```
前端应用将在 http://localhost:3000 启动

## 🗂️ 项目结构

```
jiangsu-exam-knowledge-system/
├── backend/                    # Spring Boot后端
│   ├── src/main/java/
│   │   └── com/example/exam/
│   │       ├── controller/     # REST控制器
│   │       ├── entity/         # JPA实体类
│   │       ├── repository/     # 数据访问层
│   │       └── service/        # 业务逻辑层
│   └── src/main/resources/
│       ├── application.yml     # 应用配置
│       ├── schema.sql         # 数据库结构
│       └── data.sql           # 初始数据
├── src/                       # React前端源码
│   ├── components/            # 可复用组件
│   ├── pages/                 # 页面组件
│   ├── services/              # API服务
│   ├── store/                 # Redux状态管理
│   └── types/                 # TypeScript类型定义
├── public/                    # 静态资源
└── package.json              # 前端依赖配置
```

## 🔧 API接口

### 知识点管理
- `GET /api/knowledge-points` - 获取所有知识点
- `POST /api/knowledge-points` - 创建知识点
- `PUT /api/knowledge-points/{id}` - 更新知识点
- `DELETE /api/knowledge-points/{id}` - 删除知识点

### 用户管理
- `GET /api/users/{id}` - 获取用户信息
- `PUT /api/users/{id}` - 更新用户信息

## 🎯 核心模块

### 1. 知识点管理
- 支持按科目、难度、标签分类
- 富文本内容编辑
- 前置知识点依赖关系

### 2. 学习路径
- 基于知识点依赖关系自动生成学习路径
- 个性化学习计划推荐
- 学习进度可视化

### 3. 智能搜索
- 全文搜索知识点内容
- 多维度筛选（科目、难度、标签）
- 搜索结果高亮显示

### 4. 数据可视化
- 知识图谱网络图
- 学习进度统计图表
- 成绩分析报告

## 🚀 部署

### 生产环境构建
```bash
# 前端构建
npm run build

# 后端打包
cd backend
mvn clean package
```

### Docker部署
```bash
# 构建镜像
docker build -t jiangsu-exam-system .

# 运行容器
docker run -p 8080:8080 jiangsu-exam-system
```

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件至 [your-email@example.com]

---

⭐ 如果这个项目对您有帮助，请给它一个星标！