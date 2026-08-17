"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "../../../lib/firebaseConfig";
import { useUser } from "../../../lib/auth";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./room.css";

export default function RoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const { user, hydrated } = useUser();

  const callFrameRef = useRef(null);
  const containerRef = useRef(null);

  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null); // { token, roomUrl, role }
  const [finishing, setFinishing] = useState(false);
  const [finishMsg, setFinishMsg] = useState(null);

  useEffect(() => {
    if (hydrated && !user) router.push("/login");
  }, [hydrated, user, router]);

  // Fetch a per-user, per-role meeting token — this is the actual
  // access check; the room simply won't accept a bad/missing token.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function joinRoom() {
      setStatus("loading");
      setErrorMsg(null);
      try {
        const idToken = await auth.currentUser.getIdToken();
        const res = await fetch(`/api/rooms/${roomId}/token`, {
          method: "POST",
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setErrorMsg(data.error || "Impossible de rejoindre cette séance.");
          setStatus("error");
          return;
        }
        setRoomInfo(data);
        setStatus("ready");
      } catch (err) {
        console.error(err);
        if (cancelled) return;
        setErrorMsg("Connexion impossible. Vérifiez votre réseau.");
        setStatus("error");
      }
    }

    joinRoom();
    return () => {
      cancelled = true;
    };
  }, [user, roomId]);

  // Embed Daily's prebuilt call UI once we have a valid token — this
  // gives mute/camera/screen-share/chat/leave for free, no custom video
  // UI needed.
  useEffect(() => {
    if (status !== "ready" || !roomInfo || !containerRef.current) return;
    let destroyed = false;

    async function embed() {
      const DailyIframe = (await import("@daily-co/daily-js")).default;
      if (destroyed) return;
      const frame = DailyIframe.createFrame(containerRef.current, {
        showLeaveButton: true,
        iframeStyle: { width: "100%", height: "100%", border: "0" },
      });
      callFrameRef.current = frame;
      await frame.join({ url: roomInfo.roomUrl, token: roomInfo.token });
    }

    embed();

    return () => {
      destroyed = true;
      callFrameRef.current?.destroy();
      callFrameRef.current = null;
    };
  }, [status, roomInfo]);

  async function handleFinish() {
    const confirmed = window.confirm("Terminer la séance pour tous les élèves ?");
    if (!confirmed) return;

    setFinishing(true);
    setFinishMsg(null);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("/api/sessions/finish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ roomId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFinishMsg(data.error || "Une erreur est survenue.");
        return;
      }
      callFrameRef.current?.destroy();
      router.push("/enseignant");
    } catch (err) {
      console.error(err);
      setFinishMsg("Connexion impossible. Vérifiez votre réseau.");
    } finally {
      setFinishing(false);
    }
  }

  if (!hydrated || status === "loading") {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="room-error-page">
        <p className="room-error-text">{errorMsg}</p>
        <button type="button" onClick={() => router.push("/")} className="room-error-btn">
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="room-page">
      <div className="room-header">
        <span className="room-header-title">🎥 Séance en direct</span>
        {roomInfo?.role === "teacher" && (
          <button type="button" onClick={handleFinish} disabled={finishing} className="room-finish-btn">
            {finishing ? "Fin en cours..." : "Terminer la séance"}
          </button>
        )}
      </div>
      {finishMsg && <p className="room-finish-msg">{finishMsg}</p>}
      <div ref={containerRef} className="room-frame-container" />
    </div>
  );
}