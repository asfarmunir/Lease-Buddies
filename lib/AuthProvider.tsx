"use client";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

const AuthSessionProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <Suspense fallback={null}>{children}</Suspense>
    </SessionProvider>
  );
};

export default AuthSessionProvider;
