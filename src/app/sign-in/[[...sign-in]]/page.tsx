'use client'

import { SignIn, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function SignInPage() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    redirect("/dashboard");
  }  

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn  />
    </div>
  );
}