"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Envelope } from "./Envelope";
import { InvitationPaper } from "./InvitationPaper";
import { MonogramScreen } from "./MonogramScreen";
import { ReplayButton } from "./ReplayButton";
import { BackgroundMusic } from "./BackgroundMusic";
import { Countdown } from "./Countdown";
import { weddingData } from "@/data/wedding";
import { asset } from "@/lib/assets";
import { MapLink } from "./MapLink";

const TEXTURES = [
  asset("/textures/envelope-closed.png"),
  asset("/textures/wax-seal.png"),
  asset("/textures/envelope-botanical.png"),
  asset("/textures/end-botanical.png"),
  asset("/textures/paper.png"),
  asset("/textures/paper-plain.png"),
  asset("/textures/pampas-a.png"),
  asset("/textures/pampas-b.png"),
  asset("/textures/pampas-c.png"),
  asset("/textures/pampas-d.png"),
  asset("/textures/pampas-e.png"),
  asset("/textures/pampas-full.png"),
  asset("/textures/burgundy.png"),
  asset("/textures/ra-crest.png"),
  asset("/textures/grain.png"),
];

const LUXE_EASE = "power2.inOut";
const TEXT_EASE = "power2.out";

function resetStamp(root: HTMLElement | null) {
  const stamp = root?.querySelector<HTMLElement>('[data-stamp="seal"]');
  if (!stamp) return;

  stamp.getAnimations().forEach((animation) => animation.cancel());
  stamp.style.removeProperty("transform");
  stamp.style.removeProperty("opacity");
  stamp.style.removeProperty("visibility");
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    const done = () => resolve();
    image.onload = done;
    image.onerror = done;
    image.src = src;
  });
}

function useTexturesReady(urls: string[]) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    const timeout = window.setTimeout(() => {
      if (live) setReady(true);
    }, 1200);

    Promise.all(urls.map(loadImage)).finally(() => {
      window.clearTimeout(timeout);
      if (live) setReady(true);
    });

    return () => {
      live = false;
      window.clearTimeout(timeout);
    };
  }, [urls]);

  return ready;
}

export function InvitationExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [phase, setPhase] = useState<"sealed" | "unsealed" | "playing" | "ended">("sealed");
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const openTimeoutRef = useRef<number | null>(null);
  const speedRef = useRef(1);
  const holdingRef = useRef(false);
  const restoreTimeoutRef = useRef<number | null>(null);
  const texturesReady = useTexturesReady(TEXTURES);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const q = gsap.utils.selector(root);
    const reduced = prefersReducedMotion();
    let timeline: gsap.core.Timeline;

    try {
      timeline = gsap.timeline({
        paused: true,
        defaults: { ease: LUXE_EASE, immediateRender: false },
        onComplete: () => {
          holdingRef.current = false;
          speedRef.current = 1;
          timeline.timeScale(1);
          root.setAttribute("data-speed", "1");
          phaseRef.current = "ended";
          setPhase("ended");
        },
      });
    } catch {
      return;
    }

    const left = q('[data-flap="left"]');
    const right = q('[data-flap="right"]');
    const top = q('[data-flap="top"]');
    const bottom = q('[data-flap="bottom"]');
    const leftShadow = q('[data-shadow="left"]');
    const rightShadow = q('[data-shadow="right"]');
    const topShadow = q('[data-shadow="top"]');
    const bottomShadow = q('[data-shadow="bottom"]');
    const envelope = q('[data-layer="envelope"]');
    const paper = q('[data-layer="paper"]');
    const monogram = q('[data-layer="monogram"]');
    const crest = q("[data-crest='ra']");
    const replay = q("[data-layer='replay']");
    const grain = q(".grain");
    const cover = q('[data-cover="closed"]');
    const endSheet = q(".end-sheet");

    timeline.set(q(".scene"), { opacity: 0, visibility: "hidden", filter: "none" }, 0);
    timeline.set(
      q(".ch"),
      { opacity: 0, y: 8, filter: "blur(5px)" },
      0,
    );
    timeline.set(q(".countdown-wrap, .scene .map-link"), {
      opacity: 0,
      y: 8,
      filter: "blur(5px)",
    }, 0);
    timeline.set(monogram, { opacity: 0, visibility: "hidden" }, 0);
    timeline.set(crest, { opacity: 0, scale: 0.96 }, 0);
    timeline.set(replay, { opacity: 0, scale: 0.92, xPercent: -50, pointerEvents: "none" }, 0);
    timeline.set(endSheet, { opacity: 0 }, 0);
    timeline.set(paper, { opacity: 1 }, 0);
    timeline.set(
      q("[data-stem]"),
      { opacity: 0, scaleX: 0.22, scaleY: 0.05, filter: "contrast(0.82) brightness(1.04)" },
      0,
    );
    timeline.set(q('[data-stem="full"]'), { scaleX: 1, scaleY: 1, filter: "none" }, 0);
    timeline.set(envelope, { opacity: 1, visibility: "visible" }, 0);
    timeline.set(cover, { opacity: 1, visibility: "visible" }, 0);
    timeline.set(grain, { opacity: 0.07 }, 0);
    timeline.set(
      [left, right, top, bottom],
      {
        xPercent: 0,
        yPercent: 0,
        rotateX: 0,
        rotateY: 0,
        opacity: 1,
        transformPerspective: 1600,
      },
      0,
    );
    timeline.set(
      [leftShadow, rightShadow, topShadow, bottomShadow],
      { xPercent: 0, yPercent: 0, opacity: 0 },
      0,
    );

    if (reduced) {
      timeline.to(cover, { opacity: 0, duration: 0.6, ease: TEXT_EASE }, 0.1);
      timeline.to(envelope, { opacity: 0, duration: 0.9, ease: TEXT_EASE }, 0.15);
      timeline.set(envelope, { visibility: "hidden" });

      addScene(timeline, q, "intro", 1.0, 3.8);
      addScene(timeline, q, "names", 4.2, 8.6);
      addScene(timeline, q, "date", 9.0, 13.2);
      addScene(timeline, q, "rsvp", 13.6, 17.6);

      timeline.set(q("[data-stem]"), {
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        filter: "contrast(1) brightness(1)",
      }, 1.0);

      timeline.to(paper, { opacity: 0, duration: 0.8, ease: TEXT_EASE }, 17.8);
      timeline.set(monogram, { visibility: "visible" }, 18.0);
      timeline.to(monogram, { opacity: 1, duration: 0.8, ease: TEXT_EASE }, 18.0);
      timeline.to(crest, { opacity: 1, scale: 1, duration: 1.0, ease: TEXT_EASE }, 18.15);
      timeline.to(endSheet, { opacity: 1, duration: 0.8, ease: TEXT_EASE }, 18.25);
      timeline.to(
        replay,
        { opacity: 1, scale: 1, xPercent: -50, pointerEvents: "auto", duration: 0.5, ease: TEXT_EASE },
        18.7,
      );
    } else {
      timeline.to(cover, { opacity: 0, duration: 0.28, ease: "power2.out" }, 0.08);
      timeline.set(cover, { visibility: "hidden" }, 0.4);

      timeline.to(
        left,
        { xPercent: -118, rotateY: -8, duration: 2.45, ease: "power2.inOut" },
        0.22,
      );
      timeline.to(
        leftShadow,
        { xPercent: -118, opacity: 0.72, duration: 1.05, ease: "power2.out" },
        0.22,
      );
      timeline.to(leftShadow, { opacity: 0, duration: 1.15, ease: "power2.in" }, 1.2);

      timeline.to(
        right,
        { xPercent: 118, rotateY: 8, duration: 2.45, ease: "power2.inOut" },
        0.42,
      );
      timeline.to(
        rightShadow,
        { xPercent: 118, opacity: 0.72, duration: 1.05, ease: "power2.out" },
        0.42,
      );
      timeline.to(rightShadow, { opacity: 0, duration: 1.15, ease: "power2.in" }, 1.4);

      timeline.to(
        top,
        { yPercent: -118, rotateX: 8, duration: 2.5, ease: "power2.inOut" },
        0.68,
      );
      timeline.to(
        topShadow,
        { yPercent: -118, opacity: 0.65, duration: 1.1, ease: "power2.out" },
        0.68,
      );
      timeline.to(topShadow, { opacity: 0, duration: 1.15, ease: "power2.in" }, 1.7);

      timeline.to(
        bottom,
        { yPercent: 118, rotateX: -8, duration: 2.5, ease: "power2.inOut" },
        0.92,
      );
      timeline.to(
        bottomShadow,
        { yPercent: 118, opacity: 0.65, duration: 1.1, ease: "power2.out" },
        0.92,
      );
      timeline.to(bottomShadow, { opacity: 0, duration: 1.15, ease: "power2.in" }, 1.95);

      timeline.set(envelope, { visibility: "hidden" }, 3.2);

      addCinematicScene(timeline, q, "intro", {
        start: 3.2,
        fadeOut: 6.15,
        hidden: 6.85,
        groups: [
          { selector: '[data-part="youre"] .ch', at: 3.25, stagger: 0.055 },
          { selector: '[data-part="cordially"] .ch', at: 3.55, stagger: 0.04 },
          { selector: '[data-part="invited"] .ch', at: 3.85, stagger: 0.05 },
        ],
      });

      growStems(timeline, q);

      addCinematicScene(timeline, q, "names", {
        start: 7.0,
        fadeOut: 12.15,
        hidden: 12.85,
        groups: [
          { selector: '[data-part="getting"] .ch, [data-part="married"] .ch', at: 7.05, stagger: { amount: 0.7, from: "random" } },
          { selector: '[data-part="groom"] .ch', at: 7.45, stagger: 0.06 },
          { selector: '[data-part="ampersand"] .ch', at: 8.15, stagger: 0.04 },
          { selector: '[data-part="bride"] .ch', at: 8.35, stagger: 0.08 },
        ],
      });

      addCinematicScene(timeline, q, "date", {
        start: 13.0,
        fadeOut: 18.15,
        hidden: 18.85,
        groups: [
          { selector: '[data-part="date"] .ch', at: 13.05, stagger: 0.035 },
          { selector: '[data-part="venue"] .ch, [data-part="address"] .ch, [data-part="city"] .ch', at: 13.2, stagger: 0.018 },
          { selector: '[data-part="save"] .ch', at: 13.45, stagger: 0.09 },
          { selector: '[data-part="the"] .ch', at: 13.85, stagger: 0.08 },
          { selector: '[data-part="date-word"] .ch', at: 14.15, stagger: 0.09 },
          { selector: ".scene-date .countdown-wrap, .scene-date .map-link", at: 13.55, stagger: 0.12 },
        ],
      });

      addCinematicScene(timeline, q, "rsvp", {
        start: 19.0,
        fadeOut: 24.55,
        hidden: 25.15,
        groups: [
          { selector: '[data-part="rsvp"] .ch', at: 19.05, stagger: 0.1 },
          { selector: '[data-part="deadline"] .ch, [data-part="rsvp-name"] .ch, [data-part="call"] .ch, [data-part="city"] .ch', at: 19.7, stagger: 0.02 },
          { selector: ".scene-rsvp .map-link", at: 20.2, stagger: 0.03 },
          { selector: '[data-part="kindly"] .ch', at: 20.55, stagger: 0.07 },
        ],
      });

      timeline.to(paper, { opacity: 0, duration: 1.05, ease: "power2.inOut" }, 24.85);
      timeline.set(monogram, { visibility: "visible" }, 25.2);
      timeline.to(monogram, { opacity: 1, duration: 1.05, ease: "power2.inOut" }, 25.2);
      timeline.to(grain, { opacity: 0.045, duration: 0.8 }, 25.4);
      timeline.to(
        crest,
        { opacity: 1, scale: 1, duration: 1.25, ease: "power2.out" },
        25.55,
      );
      timeline.to(endSheet, { opacity: 1, duration: 1.1, ease: "power2.out" }, 25.85);
      timeline.to(
        replay,
        { opacity: 1, scale: 1, xPercent: -50, pointerEvents: "auto", duration: 0.55, ease: TEXT_EASE },
        26.55,
      );
    }

    timelineRef.current = timeline;

    return () => {
      timeline.kill();
      timelineRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    if (phase !== "unsealed") return;
    const stamp = rootRef.current?.querySelector<HTMLElement>('[data-stamp="seal"]');
    if (!stamp) return;

    const fall = Math.round((rootRef.current?.querySelector(".stage")?.getBoundingClientRect().height ?? 720) * 1.15);
    const dropMs = 980;
    const animation = stamp.animate(
      [
        { transform: "translate(-50%, -50%) rotate(0deg) scale(1)", opacity: 1, offset: 0 },
        { transform: "translate(-50%, -50%) rotate(-4deg) scale(0.94)", opacity: 1, offset: 0.1 },
        { transform: "translate(-50%, calc(-50% + 18px)) rotate(8deg) scale(1)", opacity: 1, offset: 0.18 },
        { transform: `translate(-50%, ${fall}px) rotate(26deg) scale(1)`, opacity: 0, offset: 1 },
      ],
      {
        duration: dropMs,
        easing: "cubic-bezier(0.55, 0.06, 0.85, 0.19)",
        fill: "forwards",
      },
    );

    openTimeoutRef.current = window.setTimeout(() => {
      openTimeoutRef.current = null;
      const timeline = timelineRef.current;
      if (!timeline || phaseRef.current !== "unsealed") return;
      phaseRef.current = "playing";
      speedRef.current = 1;
      setPhase("playing");
      timeline.timeScale(1);
      rootRef.current?.setAttribute("data-speed", "1");
      timeline.play(0);
      if (holdingRef.current) {
        speedRef.current = 2.55;
        timeline.timeScale(2.55);
        rootRef.current?.setAttribute("data-speed", "2.55");
      }
    }, dropMs + 220);

    return () => {
      if (openTimeoutRef.current !== null) {
        window.clearTimeout(openTimeoutRef.current);
        openTimeoutRef.current = null;
      }
      if (phaseRef.current !== "playing") animation.cancel();
    };
  }, [phase]);

  useLayoutEffect(() => {
    if (phase !== "sealed") return;
    resetStamp(rootRef.current);
  }, [phase]);

  useEffect(() => {
    return () => {
      if (restoreTimeoutRef.current !== null) {
        window.clearTimeout(restoreTimeoutRef.current);
      }
    };
  }, []);

  const begin = () => {
    if (phaseRef.current !== "sealed") return;
    phaseRef.current = "unsealed";
    setPhase("unsealed");
  };

  const replay = () => {
    const timeline = timelineRef.current;
    if (!timeline || phaseRef.current === "playing") return;
    if (openTimeoutRef.current !== null) {
      window.clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    timeline.pause(0);
    timeline.timeScale(1);
    speedRef.current = 1;
    rootRef.current?.setAttribute("data-speed", "1");
    holdingRef.current = false;
    if (restoreTimeoutRef.current !== null) {
      window.clearTimeout(restoreTimeoutRef.current);
      restoreTimeoutRef.current = null;
    }
    resetStamp(rootRef.current);
    phaseRef.current = "sealed";
    setPhase("sealed");
  };

  const skipSealDelay = () => {
    const timeline = timelineRef.current;
    if (phaseRef.current !== "unsealed" || !timeline) return;
    if (openTimeoutRef.current !== null) {
      window.clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    phaseRef.current = "playing";
    speedRef.current = 1;
    setPhase("playing");
    timeline.timeScale(1);
    timeline.play(0);
    if (holdingRef.current) setPlaybackSpeed(2.55, true);
  };

  const setPlaybackSpeed = (value: number, instant = false) => {
    const timeline = timelineRef.current;
    if (!timeline || phaseRef.current !== "playing") return;
    speedRef.current = value;
    rootRef.current?.setAttribute("data-speed", String(value));
    gsap.killTweensOf(timeline);
    if (instant) {
      timeline.timeScale(value);
      return;
    }
    gsap.to(timeline, { timeScale: value, duration: 0.18, ease: "power2.out", overwrite: true });
  };

  const startFast = () => {
    holdingRef.current = true;
    if (restoreTimeoutRef.current !== null) {
      window.clearTimeout(restoreTimeoutRef.current);
      restoreTimeoutRef.current = null;
    }
    if (phaseRef.current === "playing") setPlaybackSpeed(2.55, true);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a, button")) return;
    startFast();
    if (phaseRef.current === "sealed") {
      begin();
      return;
    }
    if (phaseRef.current === "unsealed") {
      skipSealDelay();
    }
  };

  const onPointerEnd = () => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    restoreTimeoutRef.current = window.setTimeout(() => {
      restoreTimeoutRef.current = null;
      if (holdingRef.current) return;
      setPlaybackSpeed(1);
    }, 220);
  };

  return (
    <div
      ref={rootRef}
      className={`invitation ${phase}`}
      data-ready={texturesReady}
    >
      <div className="stage-frame">
        <div
          className="stage"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onPointerLeave={onPointerEnd}
          onKeyDown={(event) => {
            if (phase === "ended") return;
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            if (event.repeat) return;
            startFast();
            if (phaseRef.current === "sealed") begin();
            else if (phaseRef.current === "unsealed") skipSealDelay();
          }}
          onKeyUp={(event) => {
            if (event.key === "Enter" || event.key === " ") onPointerEnd();
          }}
          role={phase === "ended" ? undefined : "button"}
          tabIndex={phase === "ended" ? -1 : 0}
          aria-label={
            phase === "sealed"
              ? "Open wedding invitation"
              : phase === "playing"
                ? "Hold to speed up invitation"
                : undefined
          }
        >
          <InvitationPaper />
          <MonogramScreen />
          <Envelope />
          <div className="wax-seal" data-stamp="seal" aria-hidden="true">
            <img src={asset("/textures/wax-seal.png")} alt="" draggable={false} />
          </div>
          <div className="grain" />
          <p className="open-hint">
            {phase === "sealed" ? "Tap to open" : ""}
          </p>
          <div className="end-sheet">
            <Countdown />
            <p className="end-venue">{weddingData.venue}</p>
            <p className="end-address">{weddingData.address}</p>
            <MapLink className="end-map" />
          </div>
          <ReplayButton onReplay={replay} />
          <BackgroundMusic active={phase !== "sealed"} />
        </div>
      </div>
    </div>
  );
}

function growStems(
  timeline: gsap.core.Timeline,
  q: ReturnType<typeof gsap.utils.selector>,
) {
  const stems = [
    { id: "a", at: 5.48, origin: "7% 100%", duration: 3.1, scaleX: 0.18 },
    { id: "b", at: 6.22, origin: "12% 100%", duration: 2.85, scaleX: 0.24 },
    { id: "c", at: 6.95, origin: "18% 100%", duration: 2.65, scaleX: 0.32 },
    { id: "d", at: 7.42, origin: "10% 100%", duration: 2.35, scaleX: 0.38 },
    { id: "e", at: 7.92, origin: "23% 100%", duration: 2.5, scaleX: 0.28 },
  ];

  for (const stem of stems) {
    const el = q(`[data-stem="${stem.id}"]`);
    timeline.set(
      el,
      {
        opacity: 0,
        scaleX: stem.scaleX,
        scaleY: 0.04,
        transformOrigin: stem.origin,
        filter: "contrast(0.8) brightness(1.05)",
      },
      0,
    );
    timeline.to(el, { opacity: 1, duration: 0.42, ease: "power1.out" }, stem.at);
    timeline.to(
      el,
      { scaleY: 1, duration: stem.duration, ease: "power2.out" },
      stem.at,
    );
    timeline.to(
      el,
      { scaleX: 1, duration: stem.duration * 0.82, ease: "power2.out" },
      stem.at + 0.32,
    );
    timeline.to(
      el,
      { filter: "contrast(1) brightness(1)", duration: stem.duration * 0.7, ease: "power1.out" },
      stem.at + 0.45,
    );
  }

  timeline.to(
    q('[data-stem="full"]'),
    { opacity: 1, duration: 1.85, ease: "power1.inOut" },
    8.7,
  );
}

type SceneOptions = {
  start: number;
  fadeOut: number;
  hidden: number;
  groups: Array<{
    selector: string;
    at: number;
    stagger: number | { amount?: number; from?: "start" | "center" | "random" | "end"; each?: number };
  }>;
};

function addCinematicScene(
  timeline: gsap.core.Timeline,
  q: ReturnType<typeof gsap.utils.selector>,
  name: string,
  options: SceneOptions,
) {
  const scene = q(`[data-scene="${name}"]`);

  timeline.set(scene, { visibility: "visible", opacity: 1 }, options.start);

  for (const group of options.groups) {
    timeline.to(
      q(group.selector),
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.15,
        stagger: group.stagger,
        ease: TEXT_EASE,
      },
      group.at,
    );
  }

  timeline.to(
    scene,
    { opacity: 0, filter: "blur(4px)", duration: 0.75, ease: "power2.inOut" },
    options.fadeOut,
  );
  timeline.set(q(`[data-scene="${name}"] .ch`), {
    opacity: 0,
    y: 8,
    filter: "blur(5px)",
  }, options.hidden);
  timeline.set(scene, { visibility: "hidden", filter: "blur(0px)" }, options.hidden);
}

function addScene(
  timeline: gsap.core.Timeline,
  q: ReturnType<typeof gsap.utils.selector>,
  name: string,
  start: number,
  end: number,
) {
  const scene = q(`[data-scene="${name}"]`);
  timeline.set(scene, { visibility: "visible" }, start);
  timeline.fromTo(
    scene,
    { opacity: 0 },
    { opacity: 1, duration: 0.7, ease: TEXT_EASE },
    start,
  );
  timeline.to(q(`[data-scene="${name}"] .ch`), {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    duration: 0.01,
  }, start);
  timeline.to(scene, { opacity: 0, duration: 0.6, ease: TEXT_EASE }, end);
  timeline.set(scene, { visibility: "hidden" }, end + 0.6);
}
