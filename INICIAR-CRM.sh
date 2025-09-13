#!/bin/bash

# CRM Raphael Gomes - Script de inicialização para Mac/Linux

clear
echo "========================================"
echo "   CRM RAPHAEL GOMES - INICIANDO..."
echo "========================================"
echo

# Verifica se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ ERRO: Node.js não encontrado!"
    echo
    echo "📥 SOLUÇÃO: Instale o Node.js primeiro"
    echo "🌐 Download: https://nodejs.org"
    echo
    echo "👉 Após instalar, execute este script novamente"
    echo "Press any key to continue..."
    read -n 1 -s
    exit 1
fi

echo "✅ Node.js encontrado!"
echo

# Muda para o diretório do script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# Verifica se existe a pasta da aplicação
if [ ! -d "crm-app" ]; then
    echo "❌ ERRO: Pasta 'crm-app' não encontrada!"
    echo
    echo "📁 Verifique se todos os arquivos estão no pen drive"
    echo "Press any key to continue..."
    read -n 1 -s
    exit 1
fi

cd crm-app

echo "📂 Entrando na pasta da aplicação..."
echo

# Verifica se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências... (primeira execução)"
    echo "⏳ Aguarde, pode demorar alguns minutos..."
    echo
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ ERRO na instalação das dependências"
        echo "Press any key to continue..."
        read -n 1 -s
        exit 1
    fi
    echo "✅ Dependências instaladas com sucesso!"
    echo
fi

echo "🔨 Construindo aplicação..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ ERRO na construção da aplicação"
    echo "Press any key to continue..."
    read -n 1 -s
    exit 1
fi

echo "✅ Aplicação construída com sucesso!"
echo

echo "🚀 Iniciando servidor..."
echo "🌐 Aguarde o navegador abrir automaticamente..."
echo
echo "📋 INFORMAÇÕES IMPORTANTES:"
echo "   • URL: http://localhost:3000"
echo "   • Para parar: Pressione Ctrl+C"
echo "   • NÃO feche este terminal enquanto usar o CRM"
echo
echo "⚡ Iniciando CRM Raphael Gomes..."

# Abre o navegador (funciona na maioria dos sistemas)
if command -v open &> /dev/null; then
    # macOS
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:3000
fi

# Inicia o servidor
npm start