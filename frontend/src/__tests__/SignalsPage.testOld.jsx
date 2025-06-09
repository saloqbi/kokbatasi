import { render, screen } from "@testing-library/react";
import SignalsPage from "../pages/SignalsPage";

test("renders Signals Page", () => {
  render(<SignalsPage />);
  expect(screen.getByText(/إشارات/i)).toBeInTheDocument();
});
