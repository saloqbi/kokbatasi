
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // في الوقت الحالي نفترض النجاح مباشرة
    // لاحقًا يمكنك ربطه بـ AuthContext أو API
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
