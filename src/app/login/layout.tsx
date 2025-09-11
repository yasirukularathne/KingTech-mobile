import React from "react";
import { AuthSessionProvider } from "@/components/AuthSessionProvider";

export const metadata = {
  title: "Login",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
