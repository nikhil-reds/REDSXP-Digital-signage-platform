import React from "react";
import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your Rubenious CMS password to recover account access.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
