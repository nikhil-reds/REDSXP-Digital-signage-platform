import React from "react";
import { Metadata } from "next";
import RegisterForm from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Set up your workspace and user profile on Rubenious CMS to schedule content across your network.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
