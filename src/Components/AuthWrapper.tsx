"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          setLoading(false);
        } else {
          throw new Error("Session expired");
        }
      } catch {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return loading ? <LinearProgress /> : <>{children}</>;
}
