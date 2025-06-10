
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = () => {
    setUser({ name: "demoUser" }); // تعيين مستخدم وهمي لتجاوز الحماية
    navigate("/signals");
  };

  return (
    <div>
      <h1>صفحة تسجيل الدخول</h1>
      <button onClick={handleLogin}>تسجيل الدخول</button>
    </div>
  );
};

export default LoginPage;
