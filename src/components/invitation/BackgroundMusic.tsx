"use client";

import { useEffect, useRef, useState } from "react";
import { weddingData } from "@/data/wedding";

type YTPlayer = {
  mute?: () => void;
  unMute?: () => void;
  playVideo?: () => void;
  pauseVideo?: () => void;
  seekTo?: (seconds: number, allowSeekAhead: boolean) => void;
  destroy?: () => void;
};

type ReadyPlayer = Required<YTPlayer>;

function isReadyPlayer(player: YTPlayer | null): player is ReadyPlayer {
  return Boolean(
    player &&
      typeof player.mute === "function" &&
      typeof player.unMute === "function" &&
      typeof player.playVideo === "function" &&
      typeof player.pauseVideo === "function" &&
      typeof player.seekTo === "function",
  );
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        config: Record<string, unknown>,
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

export function BackgroundMusic({ active }: { active: boolean }) {
  const playerRef = useRef<YTPlayer | null>(null);
  const activeRef = useRef(active);
  const userMutedRef = useRef(false);
  const pendingGestureRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    activeRef.current = active;
    if (!isReadyPlayer(playerRef.current)) return;

    if (!active) {
      playerRef.current.pauseVideo();
    } else if (!userMutedRef.current) {
      playerRef.current.unMute();
      playerRef.current.playVideo();
    }
  }, [active]);

  useEffect(() => {
    let cancelled = false;

    const startFromUserGesture = () => {
      pendingGestureRef.current = true;
      const player = playerRef.current;
      if (!isReadyPlayer(player) || !activeRef.current || userMutedRef.current) return;
      player.unMute();
      player.playVideo();
      setMuted(false);
    };

    const onVisibilityChange = () => {
      const player = playerRef.current;
      if (!isReadyPlayer(player) || !activeRef.current) return;

      if (document.visibilityState === "hidden") {
        player.pauseVideo();
      } else if (!userMutedRef.current) {
        player.unMute();
        player.playVideo();
      }
    };

    window.addEventListener("pointerdown", startFromUserGesture, { passive: true });
    window.addEventListener("touchstart", startFromUserGesture, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT?.Player) return;

      playerRef.current = new window.YT.Player("wedding-song", {
        videoId: weddingData.song.youtubeId,
        playerVars: {
          autoplay: 1,
          start: weddingData.song.startSeconds,
          controls: 0,
          loop: 1,
          playlist: weddingData.song.youtubeId,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event: { target: YTPlayer }) => {
            playerRef.current = event.target;
            if (!isReadyPlayer(event.target)) return;
            event.target.mute();
            event.target.seekTo(weddingData.song.startSeconds, true);
            if (activeRef.current && pendingGestureRef.current && !userMutedRef.current) {
              event.target.unMute();
              event.target.playVideo();
              setMuted(false);
            }
          },
          onStateChange: (event: { target: YTPlayer; data: number }) => {
            if (!isReadyPlayer(event.target) || !activeRef.current || userMutedRef.current) return;
            const readyPlayer = event.target;

            const shouldResume =
              document.visibilityState === "visible" &&
              pendingGestureRef.current &&
              (event.data === 0 || event.data === 2);
            if (!shouldResume) return;

            if (resumeTimeoutRef.current !== null) {
              window.clearTimeout(resumeTimeoutRef.current);
            }
            resumeTimeoutRef.current = window.setTimeout(() => {
              resumeTimeoutRef.current = null;
              if (!activeRef.current || userMutedRef.current || document.visibilityState !== "visible") return;
              if (event.data === 0) readyPlayer.seekTo(weddingData.song.startSeconds, true);
              readyPlayer.playVideo();
            }, 180);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = null;
      }
      window.removeEventListener("pointerdown", startFromUserGesture);
      window.removeEventListener("touchstart", startFromUserGesture);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, []);

  const toggleMute = () => {
    const player = playerRef.current;
    pendingGestureRef.current = true;
    if (!isReadyPlayer(player)) {
      const nextMuted = !userMutedRef.current;
      userMutedRef.current = nextMuted;
      setMuted(nextMuted);
      return;
    }

    if (userMutedRef.current) {
      userMutedRef.current = false;
      player.unMute();
      player.playVideo();
      setMuted(false);
    } else {
      userMutedRef.current = true;
      player.mute();
      setMuted(true);
    }
  };

  return (
    <>
      <div className="yt-bg" aria-hidden="true">
        <div id="wedding-song" />
      </div>
      {active ? (
        <button
          className="music-toggle"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleMute();
          }}
          aria-label={muted ? "Unmute song" : "Mute song"}
        >
          {muted ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M4 9v6h4l5 4V5L8 9H4zm12.5 3l2.1-2.1 1.4 1.4L18 13.4l2 2-1.4 1.4-2.1-2.1-2.1 2.1-1.4-1.4 2.1-2 2-2.1-1.4-1.4 2.1 2.1z"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4zM16 6.3v1.5c2 .8 3.5 2.8 3.5 5.2s-1.5 4.4-3.5 5.2v1.5c2.8-1 4.8-3.7 4.8-6.7S18.8 7.3 16 6.3z"
              />
            </svg>
          )}
        </button>
      ) : null}
    </>
  );
}
