import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">🔮 كوكبة تاسي</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">🏠 الرئيسية</Link>
        <Link to="/all-signals" className="hover:underline">📜 كل التوصيات السابقة</Link>
      </div>
    </nav>
  );
};

export default Navbar;
