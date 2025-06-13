#!/bin/bash
echo "🚀 بدء تشغيل مشروع كوكبة تاسي"
docker-compose build
docker-compose up -d
xdg-open http://localhost:3000 || open http://localhost:3000 || start http://localhost:3000
