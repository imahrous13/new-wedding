"use client";

import { useEffect, useRef, useState } from "react";
import { weddingData } from "@/data/wedding";

type YTPlayer = {
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy: () => void;
};

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
  const startedRef = useRef(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;

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
            event.target.seekTo(weddingData.song.startSeconds, true);
            event.target.playVideo();
          },
        },
      });
    });

    return () => {
      cancelled = true;
    };
  }, [active]);

  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;

    if (player.isMuted()) {
      player.unMute();
      setMuted(false);
    } else {
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
