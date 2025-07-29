import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Provider�?조건부�?import?�여 mock 충돌 방�?
let ToastProvider: any;
let AuthProvider: any;

try {
  const toastModule = require("../contexts/ToastContext");
  ToastProvider = toastModule.ToastProvider;
} catch (error) {
  // ToastProvider�??�용?????�는 경우 �?컴포?�트�??��?
  ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
}

try {
  const authModule = require("../modules/auth/hooks/useAuth");
  AuthProvider = authModule.AuthProvider;
} catch (error) {
  // AuthProvider�??�용?????�는 경우 �?컴포?�트�??��?
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


