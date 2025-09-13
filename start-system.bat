@echo off
echo 启动江苏省考知识点管理系统...
echo.

REM 检查Node.js环境
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未找到Node.js环境，请确保已安装Node.js
    pause
    exit /b 1
)

REM 检查Java环境
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未找到Java环境，请确保已安装Java 17或更高版本
    pause
    exit /b 1
)

echo 环境检查通过
echo.

REM 启动后端服务
echo 正在启动后端服务...
start "后端服务" cmd /k "cd /d backend && mvn spring-boot:run"

REM 等待后端启动
echo 等待后端服务启动...
timeout /t 10 /nobreak >nul

REM 启动前端服务
echo 正在启动前端服务...
start "前端服务" cmd /k "npm run dev"

echo.
echo 系统启动完成！
echo 前端地址: http://localhost:5173
echo 后端地址: http://localhost:8080
echo.
echo 请等待服务完全启动后访问前端地址
pause