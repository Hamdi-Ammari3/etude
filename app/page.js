"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {FiLoader} from "react-icons/fi";

export default function Home() {

  const { user, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {

    if (!loading) {

      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }

    }

  }, [user, loading, router]);

  return (
    <div>
      <FiLoader className="spin-icon" />
    </div>
  );
}