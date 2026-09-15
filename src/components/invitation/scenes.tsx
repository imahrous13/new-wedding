"use client";

import { useLayoutEffect, useRef } from "react";
import { getVenueLines, weddingData } from "@/data/wedding";
import { CharText } from "./CharText";
import { Countdown } from "./Countdown";
import { MapLink } from "./MapLink";

export function IntroMessage() {
  return (
    <div className="scene scene-intro" data-scene="intro">
      <CharText className="kicker kicker-lg" part="youre" text="YOU'RE" />
      <CharText className="script-soft" part="cordially" text="cordially" connected />
      <CharText className="kicker kicker-lg" part="invited" text="INVITED" />
    </div>
  );
}

export function CoupleNames() {
  const stackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    const fit = () => {
      const names = [...stack.querySelectorAll<HTMLElement>(".script-name")];
      if (!names.length) return;

      const maxWidth = stack.clientWidth * 0.9;
      names.forEach((name) => {
        name.style.fontSize = "100px";
      });

      const longestWidth = Math.max(
        ...names.map((name) => name.querySelector(".ch-connected")?.scrollWidth ?? name.scrollWidth),
      );
      if (!longestWidth) return;

      const size = Math.max(36, Math.min(100 * (maxWidth / longestWidth), 110));
      names.forEach((name) => {
        name.style.fontSize = `${size}px`;
      });
    };

    fit();
    void document.fonts?.ready.then(fit);
    const observer = new ResizeObserver(fit);
    observer.observe(stack);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="scene scene-names" data-scene="names">
      <div className="kicker-block">
        <CharText className="kicker" part="getting" text="WE'RE GETTING" />
        <CharText className="kicker" part="married" text="MARRIED" />
      </div>
      <div className="names-stack" ref={stackRef}>
        <CharText className="script-name script-name-groom" part="groom" text={weddingData.groom} connected />
        <div className="ampersand" data-part="ampersand" aria-label="and">
          <span className="amp-flourish ch" aria-hidden="true" />
          <span className="amp-mark ch">&</span>
          <span className="amp-flourish amp-flourish-end ch" aria-hidden="true" />
        </div>
        <CharText className="script-name script-name-bride" part="bride" text={weddingData.bride} connected />
      </div>
    </div>
  );
}

export function SaveTheDate() {
  const { hotel, city } = getVenueLines();

  return (
    <div className="scene scene-date" data-scene="date">
      <div className="save-stack">
        <CharText className="script-save" part="save" text="Save" connected />
        <CharText className="script-the" part="the" text="the" connected />
        <CharText className="script-save" part="date-word" text="Date" connected />
      </div>
      <CharText className="date-line" part="date" text={weddingData.date.toUpperCase()} />
      <div className="countdown-wrap" data-part="countdown">
        <Countdown />
      </div>
      <div className="venue-block">
        <CharText className="venue-line" part="venue" text={weddingData.venue.toUpperCase()} />
        <CharText className="venue-line" part="address" text={hotel.toUpperCase()} />
        {city ? <CharText className="venue-line" part="city" text={city.toUpperCase()} /> : null}
        <MapLink part="map" />
      </div>
    </div>
  );
}

export function RSVP() {
  const { hotel, city } = getVenueLines();

  return (
    <div className="scene scene-rsvp" data-scene="rsvp">
      <CharText className="script-kindly" part="kindly" text="kindly" connected />
      <CharText className="rsvp-title" part="rsvp" text="JOIN US" />
      <CharText className="rsvp-meta" part="deadline" text="AT" />
      <div className="rsvp-contact">
        <CharText className="rsvp-meta rsvp-name" part="rsvp-name" text={weddingData.venue.toUpperCase()} />
        <CharText className="rsvp-meta rsvp-place" part="call" text={hotel.toUpperCase()} />
        {city ? <CharText className="rsvp-meta rsvp-city" part="city" text={city.toUpperCase()} /> : null}
      </div>
      <MapLink className="rsvp-web rsvp-map" part="website" />
    </div>
  );
}
