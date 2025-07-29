import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Provider를 조건부로 import하여 mock 충돌 방지
let ToastProvider: any;
let AuthProvider: any;

try {
  const toastModule = require("../contexts/ToastContext");
  ToastProvider = toastModule.ToastProvider;
} catch (error) {
  // ToastProvider를 사용할 수 없는 경우 빈 컴포넌트로 대체
  ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
}

try {
  const authModule = require("../modules/auth/hooks/useAuth");
  AuthProvider = authModule.AuthProvider;
} catch (error) {
  // AuthProvider를 사용할 수 없는 경우 빈 컴포넌트로 대체
  AuthProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
}

const queryClient = new QueryClient();

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
