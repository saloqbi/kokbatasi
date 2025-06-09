
import { render, screen } from "@testing-library/react";
import SignalsPage from "../src/pages/SignalsPage";
import { describe, it, expect } from "vitest";

describe("SignalsPage", () => {
  it("renders Signals Page", () => {
    render(<SignalsPage />);
    expect(screen.getByText(/إشارات/i)).toBeInTheDocument();
  });
});
