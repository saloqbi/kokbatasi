const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🧑‍⚖️ لوحة تحكم المشرف</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-2">📊 عدد التوصيات</h3>
          <p className="text-3xl font-bold text-blue-600">145</p>
        </div>
        <div className="bg-white p-4 shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-2">👥 عدد المستخدمين</h3>
          <p className="text-3xl font-bold text-green-600">58</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
