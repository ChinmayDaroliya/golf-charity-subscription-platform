"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    } else if (isLoaded && isSignedIn) {
      fetch("/api/admin/check")
        .then((res) => res.json())
        .then((data) => {
          if (!data.isAdmin) {
            router.push("/dashboard");
          } else {
            setIsAdmin(true);
          }
        });
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isAdmin) return <div>Loading...</div>;

  return <>{children}</>;
}