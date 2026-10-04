"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../../lib/auth";

const TEACHER_ZONE = "/enseignant";

// Pages both students and teachers can open.
// "/enseignants/…" = public teacher profiles (a teacher opens his own from "Mon profil public").
const SHARED_ROUTE_PREFIXES = ["/room", "/enseignants"];

// Matches "/enseignant" and "/enseignant/…", but NOT "/enseignants/…".
function startsWithSegment(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export default function RoleGate({ children }) {
  const { user, hydrated } = useUser();
  const pathname = usePathname() || "/";
  const router = useRouter();

  const inTeacherZone = startsWithSegment(pathname, TEACHER_ZONE);
  const inSharedRoute = SHARED_ROUTE_PREFIXES.some((prefix) => startsWithSegment(pathname, prefix));
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
      router.replace(TEACHER_ZONE);
    }
  }, [hydrated, user, isTeacher, inTeacherZone, inSharedRoute, pathname, router]);

  return children;
}