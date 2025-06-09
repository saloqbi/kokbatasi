/** @jsxImportSource react */
import { render } from "@testing-library/react";
import ProtectedRoute from "../src/routes/ProtectedRoute";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";

test("renders protected route", () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    </MemoryRouter>
  );
});
