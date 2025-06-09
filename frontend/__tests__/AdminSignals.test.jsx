import { render, screen } from "@testing-library/react";
import AdminSignals from "../src/pages/AdminSignals"; // تأكد أن المسار صحيح

describe("AdminSignals", () => {
  it("renders Admin Signals page", () => {
    render(<AdminSignals />);
    expect(screen.getByText(/إشارات المشرف/i)).toBeInTheDocument(); // عدل النص حسب ما يظهر في الصفحة
  });
});
