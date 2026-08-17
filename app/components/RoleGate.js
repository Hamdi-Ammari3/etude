"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../../lib/auth";

const TEACHER_ZONE_PREFIX = "/enseignant";

const SHARED_ROUTE_PREFIXES = ["/room"];

export default function RoleGate({ children }) {
  const { user, hydrated } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const inTeacherZone = pathname.startsWith(TEACHER_ZONE_PREFIX);
  const inSharedRoute = SHARED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isTeacher = user?.role === "teacher";

  useEffect(() => {
    if (!hydrated) return;

    if (inTeacherZone) {
      if (user && !isTeacher) {
        router.replace("/");
      }
      return;
    }

    if (inSharedRoute) {
      return;
    }

    if (isTeacher) {
      router.replace(TEACHER_ZONE_PREFIX);
    }
  }, [hydrated, user, isTeacher, inTeacherZone, inSharedRoute, pathname, router]);

  return children;
}