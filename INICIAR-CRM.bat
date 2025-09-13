@echo off
title CRM Raphael Gomes - Inicializando...
cls

echo.
echo ========================================
echo    CRM RAPHAEL GOMES - INICIANDO...
echo ========================================
echo.

REM Verifica se Node.js esta instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: Node.js nao encontrado!
    echo.
    echo 📥 SOLUÇÃO: Instale o Node.js primeiro
    echo 🌐 Download: https://nodejs.org
    echo.
    echo 👉 Após instalar, execute este arquivo novamente
    pause
    exit /b 1
)

echo ✅ Node.js encontrado!
echo.

REM Muda para o diretório da aplicação
cd /d "%~dp0"

REM Verifica se existe a pasta da aplicação
if not exist "crm-app" (
    echo ❌ ERRO: Pasta 'crm-app' nao encontrada!
    echo.
    echo 📁 Verifique se todos os arquivos estao no pen drive
    pause
    exit /b 1
)

cd crm-app

echo 📂 Entrando na pasta da aplicação...
echo.

REM Verifica se as dependências estão instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependências... (primeira execução)
    echo ⏳ Aguarde, pode demorar alguns minutos...
    echo.
    npm install
    if errorlevel 1 (
        echo ❌ ERRO na instalação das dependências
        pause
        exit /b 1
    )
    echo ✅ Dependências instaladas com sucesso!
    echo.
)

echo 🔨 Construindo aplicação...
npm run build
if errorlevel 1 (
    echo ❌ ERRO na construção da aplicação
    pause
    exit /b 1
)

echo ✅ Aplicação construída com sucesso!
echo.

echo 🚀 Iniciando servidor...
echo 🌐 Aguarde o navegador abrir automaticamente...
echo.
echo 📋 INFORMAÇÕES IMPORTANTES:
echo    • URL: http://localhost:3000
echo    • Para parar: Feche esta janela
echo    • NÃO feche esta janela enquanto usar o CRM
echo.
echo ⚡ Iniciando CRM Raphael Gomes...

REM Inicia o servidor e abre o navegador
start http://localhost:3000
npm start

pause