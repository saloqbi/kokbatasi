
# 🌌 كوكبة تاسي - Kokbatasi

مشروع ويب متكامل لتحليل التوصيات السوقية باستخدام أدوات تحليل فني ذكية مثل Gann و Fibonacci و Trendline و SignalContext.

---

## 🚀 المحتويات

- ✅ واجهة React (frontend)
- ✅ خادم Express + MongoDB (backend)
- ✅ أدوات تحليل فني ديناميكية
- ✅ تكامل مع إشارات السوق وتفاصيلها
- ✅ دعم كامل لتشغيل Docker

---

## ⚙️ تشغيل المشروع محليًا

### 1. تشغيل backend

```bash
cd backend
npm install
npm run dev
```

🔌 يتصل بـ MongoDB على:
```
MONGO_URI=mongodb+srv://admin:admin123@kokbatasi-db.0ltpmeg.mongodb.net/?retryWrites=true&w=majority&appName=kokbatasi-db
```

---

### 2. تشغيل frontend

```bash
cd frontend
npm install
npm run dev
```

يفتح على:
```
http://localhost:5173/
```

---

## 🐳 لتشغيل المشروع باستخدام Docker:

```bash
chmod +x setup.sh
./setup.sh
```

أو يدويًا:

```bash
docker-compose build
docker-compose up -d
```

---

## 🧭 روابط المشروع:

- GitHub: https://github.com/saloqbi/kokbatasi
- Render: https://kokbatasi.onrender.com
- Vercel: https://kokbatasi.vercel.app/

---

## 📁 المسارات المهمة:

| المسار | الوظيفة |
|--------|---------|
| `/` | عرض كل التوصيات |
| `/signals/:id` | عرض تفاصيل توصية محددة |
| `/analysis` | عرض الأدوات الفنية + التوصية المحددة |

---

🧠 هذا المشروع قابل للتوسع ليدعم أدوات أكثر، وتحليلات ذكية لاحقًا.
