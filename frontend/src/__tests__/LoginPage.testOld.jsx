import { render, screen } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";

test("renders login page", () => {
  render(<LoginPage />);
  expect(screen.getByText(/تسجيل الدخول/i)).toBeInTheDocument();
});
