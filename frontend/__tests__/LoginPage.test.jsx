import { render, screen } from "@testing-library/react";
import LoginPage from "../src/pages/LoginPage";

describe("LoginPage", () => {
  it("renders login button", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /تسجيل الدخول/i })).toBeInTheDocument();
  });
});