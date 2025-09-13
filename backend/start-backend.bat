@echo off
echo 启动江苏省考知识点管理系统后端服务...
echo.

REM 检查Java环境
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未找到Java环境，请确保已安装Java 17或更高版本
    pause
    exit /b 1
)

REM 检查Maven环境
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未找到Maven环境，请确保已安装Maven 3.6+
    pause
    exit /b 1
)

echo Java和Maven环境检查通过
echo.

REM 进入后端目录
cd /d "%~dp0"

echo 正在启动Spring Boot应用...
echo 请确保MySQL数据库已启动并且配置正确
echo.

REM 启动Spring Boot应用
mvn spring-boot:run

pause