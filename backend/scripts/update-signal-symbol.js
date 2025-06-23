
// update-signal-symbol.js
const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb+srv://admin:admin123@kokbatasi-db.0ltpmeg.mongodb.net/?retryWrites=true&w=majority&appName=kokbatasi-db";
const client = new MongoClient(uri);

async function updateSymbol() {
  try {
    await client.connect();
    const db = client.db("kokbatasi"); // اسم قاعدة البيانات
    const signals = db.collection("signals");

    const signalId = "684bb10a51da89f15d881984"; // 🟢 رقم التوصية
    const result = await signals.updateOne(
      { _id: new ObjectId(signalId) },
      { $set: { symbol: "ETH" } }
    );

    if (result.modifiedCount > 0) {
      console.log("✅ تم تحديث symbol بنجاح");
    } else {
      console.log("⚠️ لم يتم التعديل (قد يكون موجود مسبقًا)");
    }
  } catch (err) {
    console.error("❌ خطأ:", err);
  } finally {
    await client.close();
  }
}

updateSymbol();
