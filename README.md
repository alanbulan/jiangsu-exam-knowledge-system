<div align="center">

# 江苏省考知识点管理

知识点、依赖关系与学习记录的可视化工作空间。

![React](https://img.shields.io/badge/UI-React_18-818cf8?style=flat-square)
![Spring](https://img.shields.io/badge/API-Spring_Boot_3.2-5eead4?style=flat-square)
![Domain](https://img.shields.io/badge/Domain-Learning-fb7185?style=flat-square)

[快速开始](#快速开始) · [工程结构](#工程结构) · [开发核对](#开发核对)

</div>

React、TypeScript 和 Vite 构建学习界面，Spring Boot 后端管理业务数据。项目围绕知识点分类、关系图、学习路径和进度组织，作为学习系统实践保留，不将规划功能或考试效果表述为已验证结论。

## 快速开始

```sh
git clone https://github.com/alanbulan/jiangsu-exam-knowledge-system.git
cd jiangsu-exam-knowledge-system
```

准备 Java 17、Maven、独立的开发数据库，以及满足当前前端依赖要求的 Node.js/npm。数据库连接和初始化规则应先核对后端配置，避免连接到生产数据。

**终端一：后端。**

```sh
cd backend
mvn spring-boot:run
```

**终端二：从仓库根目录启动前端，不要停留在 backend。**

```sh
npm ci
npm run dev
```

以进程输出和 [vite.config.ts](./vite.config.ts) 为准确认端口与 API 代理。开发前端页面可加载，不代表后端已连接。

## 工程结构

| 路径 | 职责 |
| --- | --- |
| [backend/pom.xml](./backend/pom.xml) | Java 17、Spring Boot 3.2、JPA、Security 与数据库依赖 |
| [backend/src](./backend/src) | 后端实现与配置 |
| [src](./src) | React 页面、状态、数据访问与图形界面 |
| [package.json](./package.json) | Vite、React、Redux 和可视化依赖 |
| [江苏省考知识点模块化系统.md](./江苏省考知识点模块化系统.md) | 原有业务设计资料 |

根目录中没有 `server/`，但 package.json 仍保留 `server` / `server:dev` 脚本指向 `server/index.js`。这些属于遗留入口，不能用于启动现有 Spring Boot 后端。本文使用已存在的 Maven 工程，不凭这些旧脚本推断另一个 Node 后端可用。

## 开发核对

```sh
# 仓库根目录：构建前端
npm run build

# backend 目录：执行后端测试和构建
mvn test
mvn package
```

前端 build 当前为 `vite build`，不等于已经完成独立的 TypeScript 类型检查或端到端测试；root manifest 没有 test/lint 脚本，不编造这些命令。

重点验证知识点增删改查、依赖关系环、空分类、重复提交、用户隔离和进度保存。初始化 SQL 或自动建表可能写入数据库，应先检查实际配置和备份。

现有依赖同时保留 MySQL 与 H2；运行使用哪一种由配置决定，不能因依赖存在就声称两者均已验收。原来 Node.js 16 的说明也不再作为当前前端环境保证。

2026-09-08：核对 README、根目录、package.json 与 pom.xml，修正占位克隆地址和前后端工作目录；没有变更依赖、运行数据库或执行上述测试。问题反馈请附脱敏配置、实际命令和最小复现，不上传个人学习记录。
