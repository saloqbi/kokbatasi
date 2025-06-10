
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // نحاكي تسجيل دخول ناجح
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
