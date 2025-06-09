import { render, screen } from "@testing-library/react";
import AdminSignals from "../pages/AdminSignals";

test("renders Admin Signals", () => {
  render(<AdminSignals />);
  expect(screen.getByText(/إشارات المشرف/i)).toBeInTheDocument();
});
