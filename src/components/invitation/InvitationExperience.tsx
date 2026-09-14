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

const TEXTURES = [
  "/textures/envelope-closed.png",
  "/textures/wax-seal.png",
  "/textures/envelope-botanical.png",
  "/textures/paper.png",
  "/textures/burgundy.png",
  "/textures/monogram.png",
  "/textures/grain.png",
];

const LUXE_EASE = "power2.inOut";
const TEXT_EASE = "power2.out";

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
          const stamp = root.querySelector('[data-stamp="seal"]');
          if (stamp) {
            gsap.set(stamp, {
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
            });
          }
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
    const mark = q(".monogram-mark");
    const initials = q(".monogram-initials");
    const replay = q("[data-layer='replay']");
    const grain = q(".grain");
    const cover = q('[data-cover="closed"]');
    const stamp = q('[data-stamp="seal"]');

    gsap.set(stamp, { xPercent: -50, yPercent: -50, y: 0, rotation: 0, scale: 1, opacity: 1 });

    timeline.set(q(".scene"), { opacity: 0, visibility: "hidden", filter: "none" }, 0);
    timeline.set(
      q(".ch"),
      { opacity: 0, y: 8, filter: "blur(5px)" },
      0,
    );
    timeline.set(q(".countdown-wrap, .map-link"), {
      opacity: 0,
      y: 8,
      filter: "blur(5px)",
    }, 0);
    timeline.set(monogram, { opacity: 0, visibility: "hidden" }, 0);
    timeline.set(mark, { opacity: 0, scale: 0.96 }, 0);
    timeline.set(initials, { opacity: 0 }, 0);
    timeline.set(replay, { opacity: 0, scale: 0.92, pointerEvents: "none" }, 0);
    timeline.set(paper, { opacity: 1 }, 0);
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

      timeline.to(paper, { opacity: 0, duration: 0.8, ease: TEXT_EASE }, 17.8);
      timeline.set(monogram, { visibility: "visible" }, 18.0);
      timeline.to(monogram, { opacity: 1, duration: 0.8, ease: TEXT_EASE }, 18.0);
      timeline.to(mark, { opacity: 1, scale: 1, duration: 1.0, ease: TEXT_EASE }, 18.2);
      timeline.to(initials, { opacity: 1, duration: 0.8, ease: TEXT_EASE }, 18.8);
      timeline.to(monogram, { opacity: 0, duration: 0.7, ease: TEXT_EASE }, 24.0);
      timeline.set(envelope, { visibility: "visible" }, 24.4);
      timeline.set(cover, { visibility: "visible" }, 24.4);
      timeline.to(envelope, { opacity: 1, duration: 0.8, ease: TEXT_EASE }, 24.4);
      timeline.to(cover, { opacity: 1, duration: 0.6, ease: TEXT_EASE }, 24.5);
      timeline.to(
        replay,
        { opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.5, ease: TEXT_EASE },
        25.0,
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
          { selector: '[data-part="venue"] .ch, [data-part="address"] .ch', at: 13.2, stagger: 0.018 },
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
          { selector: '[data-part="deadline"] .ch, [data-part="rsvp-name"] .ch, [data-part="call"] .ch', at: 19.7, stagger: 0.02 },
          { selector: ".scene-rsvp .map-link", at: 20.2, stagger: 0.03 },
          { selector: '[data-part="kindly"] .ch', at: 20.55, stagger: 0.07 },
        ],
      });

      timeline.to(paper, { opacity: 0, duration: 1.05, ease: "power2.inOut" }, 24.85);
      timeline.set(monogram, { visibility: "visible" }, 25.2);
      timeline.to(monogram, { opacity: 1, duration: 1.05, ease: "power2.inOut" }, 25.2);
      timeline.to(grain, { opacity: 0.045, duration: 0.8 }, 25.4);
      timeline.to(
        mark,
        { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
        26.5,
      );
      timeline.to(initials, { opacity: 1, duration: 1.1, ease: TEXT_EASE }, 27.35);
      timeline.to(monogram, { opacity: 0, duration: 0.9, ease: "power2.inOut" }, 33.6);
      timeline.set(
        [left, right, top, bottom, leftShadow, rightShadow, topShadow, bottomShadow],
        { xPercent: 0, yPercent: 0, rotateX: 0, rotateY: 0, opacity: 1 },
        34.2,
      );
      timeline.set(leftShadow, { opacity: 0 }, 34.2);
      timeline.set(rightShadow, { opacity: 0 }, 34.2);
      timeline.set(topShadow, { opacity: 0 }, 34.2);
      timeline.set(bottomShadow, { opacity: 0 }, 34.2);
      timeline.set(envelope, { visibility: "visible" }, 34.2);
      timeline.set(cover, { visibility: "visible" }, 34.2);
      timeline.fromTo(
        envelope,
        { opacity: 0 },
        { opacity: 1, duration: 0.95, ease: "power2.inOut", immediateRender: false },
        34.25,
      );
      timeline.fromTo(
        cover,
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: "power2.inOut", immediateRender: false },
        34.35,
      );
      timeline.to(grain, { opacity: 0.07, duration: 0.6 }, 34.3);
      timeline.to(
        replay,
        { opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.55, ease: TEXT_EASE },
        35.0,
      );
    }

    timelineRef.current = timeline;

    return () => {
      timeline.kill();
      timelineRef.current = null;
    };
  }, []);

  const dropSeal = () => {
    const root = rootRef.current;
    if (!root || phase !== "sealed") return;

    const stamp = root.querySelector('[data-stamp="seal"]');
    setPhase("unsealed");

    if (!stamp) return;

    gsap.killTweensOf(stamp);
    gsap.set(stamp, { xPercent: -50, yPercent: -50, y: 0, rotation: 0, scale: 1, opacity: 1 });
    gsap
      .timeline()
      .to(stamp, { scale: 0.96, duration: 0.12, ease: "power1.out" })
      .to(stamp, { y: 10, duration: 0.1, ease: "power1.in" })
      .to(stamp, {
        y: "78vh",
        rotation: 21,
        duration: 0.95,
        ease: "power3.in",
      })
      .to(stamp, { opacity: 0, duration: 0.2 }, "-=0.18");
  };

  const begin = () => {
    const timeline = timelineRef.current;
    if (!timeline || phase !== "unsealed") return;
    setPhase("playing");
    timeline.play(0);
  };

  const replay = () => {
    const timeline = timelineRef.current;
    const root = rootRef.current;
    if (!timeline || phase === "playing") return;

    const stamp = root?.querySelector('[data-stamp="seal"]');
    gsap.killTweensOf(stamp);
    gsap.set(stamp, {
      xPercent: -50,
      yPercent: -50,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
    });
    timeline.pause(0);
    setPhase("sealed");
  };

  const onStageClick = () => {
    if (phase === "sealed") {
      dropSeal();
      return;
    }
    if (phase === "unsealed") {
      begin();
    }
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
          onClick={phase === "sealed" || phase === "unsealed" ? onStageClick : undefined}
          onKeyDown={(event) => {
            if (phase !== "sealed" && phase !== "unsealed") return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onStageClick();
            }
          }}
          role={phase === "sealed" || phase === "unsealed" ? "button" : undefined}
          tabIndex={phase === "sealed" || phase === "unsealed" ? 0 : -1}
          aria-label={
            phase === "sealed"
              ? "Break the wax seal"
              : phase === "unsealed"
                ? "Open wedding invitation"
                : undefined
          }
        >
          <InvitationPaper />
          <MonogramScreen />
          <Envelope />
          <div className="grain" />
          <p className="open-hint">
            {phase === "unsealed" ? "Tap to open" : "Tap to break the seal"}
          </p>
          <div className="end-sheet">
            <Countdown />
            <p className="end-venue">{weddingData.venue}</p>
            <p className="end-address">{weddingData.address}</p>
            <a
              className="end-map"
              href={weddingData.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              View map
            </a>
          </div>
          <ReplayButton onReplay={replay} />
          <BackgroundMusic active={phase !== "sealed"} />
        </div>
      </div>
    </div>
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
