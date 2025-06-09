import { render } from "@testing-library/react";
import ProtectedRoute from "../routes/ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";
import { MemoryRouter } from "react-router-dom";

test("redirects unauthenticated users", () => {
  const { getByText } = render(
    <AuthProvider>
      <MemoryRouter>
        <ProtectedRoute>
          <div>محتوى محمي</div>
        </ProtectedRoute>
      </MemoryRouter>
    </AuthProvider>
  );
  expect(getByText(/محتوى محمي/i)).toBeTruthy();
});
