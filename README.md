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

**终端一：从仓库根目录启动后端。**

```sh
npm run server
```

也可手动进入 `backend` 执行 `mvn spring-boot:run`。两个入口均使用现有 Maven 工程。

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

`server` / `server:dev` 已从不存在的 `server/index.js` 改为在 `backend` 工作目录执行 Maven。旧命令名保留兼容，但不再假设存在另一个 Node 后端；`server:dev` 不额外启用未经核实的开发 profile。

## 开发核对

以下命令均从仓库根目录执行：

| 命令 | 作用 |
| --- | --- |
| `npm run build` | Vite 前端构建 |
| `npm run backend:test` | 在 backend 执行 `mvn test` |
| `npm run backend:build` | 在 backend 执行 `mvn package` |
| `npm run test:workspace` | 无外部依赖的脚本配置检查；POSIX 下使用 Maven 替身验证目录和参数转发 |

五项工作空间回归已在 Linux / Node.js 22.16.0 通过；测试没有启动 Java、访问数据库或编译应用。Windows 下仅验证命令配置，不把它计为 Windows 进程联调。前端 build 当前为 `vite build`，不等于独立的 TypeScript 类型检查或端到端验收。

重点验证知识点增删改查、依赖关系环、空分类、重复提交、用户隔离和进度保存。初始化 SQL 或自动建表可能写入数据库，应先检查实际配置和备份。

现有依赖同时保留 MySQL 与 H2；运行使用哪一种由配置决定，不能因依赖存在就声称两者均已验收。原来 Node.js 16 的说明也不再作为当前前端环境保证。

2026-09-08 修正文档；2026-09-09 修复实际启动脚本并添加回归。Java/前端依赖及锁文件不变，没有启动数据库或执行应用部署。问题反馈请附脱敏配置、实际命令和最小复现，不上传个人学习记录。
