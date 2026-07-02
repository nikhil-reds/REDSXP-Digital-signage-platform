import React from "react";
import { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Rubenious CMS account to manage content scheduling.",
};

export default function LoginPage() {
  return <LoginForm />;
}
