import "@testing-library/jest-dom";
import React from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Providerë¥?ì¡°ê±´ë¶€ë¡?import?˜ì—¬ mock ì¶©ëŒ ë°©ì?
let ToastProvider: any;
let AuthProvider: any;

try {
  const toastModule = require("../contexts/ToastContext");
  ToastProvider = toastModule.ToastProvider;
} catch (error) {
  // ToastProviderë¥??¬ìš©?????†ëŠ” ê²½ìš° ë¹?ì»´í¬?ŒíŠ¸ë¡??€ì²?
  ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
}

try {
  const authModule = require("../modules/auth/hooks/useAuth");
  AuthProvider = authModule.AuthProvider;
} catch (error) {
  // AuthProviderë¥??¬ìš©?????†ëŠ” ê²½ìš° ë¹?ì»´í¬?ŒíŠ¸ë¡??€ì²?
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


