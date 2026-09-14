"use client";

import { weddingData } from "@/data/wedding";
import { CharText } from "./CharText";
import { Countdown } from "./Countdown";

export function IntroMessage() {
  return (
    <div className="scene scene-intro" data-scene="intro">
      <CharText className="kicker kicker-lg" part="youre" text="YOU'RE" />
      <CharText className="script-soft" part="cordially" text="cordially" />
      <CharText className="kicker kicker-lg" part="invited" text="INVITED" />
    </div>
  );
}

export function CoupleNames() {
  return (
    <div className="scene scene-names" data-scene="names">
      <div className="kicker-block">
        <CharText className="kicker" part="getting" text="WE'RE GETTING" />
        <CharText className="kicker" part="married" text="MARRIED" />
      </div>
      <div className="names-stack">
        <CharText className="script-name" part="groom" text={weddingData.groom} />
        <div className="ampersand" data-part="ampersand" aria-label="and">
          <span className="amp-flourish ch" aria-hidden="true" />
          <span className="amp-mark ch">&</span>
          <span className="amp-flourish amp-flourish-end ch" aria-hidden="true" />
        </div>
        <CharText className="script-name" part="bride" text={weddingData.bride} />
      </div>
    </div>
  );
}

export function SaveTheDate() {
  return (
    <div className="scene scene-date" data-scene="date">
      <div className="save-stack">
        <CharText className="script-save" part="save" text="Save" />
        <CharText className="script-the" part="the" text="the" />
        <CharText className="script-save" part="date-word" text="Date" />
      </div>
      <CharText className="date-line" part="date" text={weddingData.date.toUpperCase()} />
      <div className="countdown-wrap" data-part="countdown">
        <Countdown />
      </div>
      <div className="venue-block">
        <CharText className="venue-line" part="venue" text={weddingData.venue.toUpperCase()} />
        <CharText className="venue-line" part="address" text={weddingData.address.toUpperCase()} />
        <a
          className="map-link"
          href={weddingData.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-part="map"
          onClick={(event) => event.stopPropagation()}
        >
          View map
        </a>
      </div>
    </div>
  );
}

export function RSVP() {
  return (
    <div className="scene scene-rsvp" data-scene="rsvp">
      <CharText className="script-kindly" part="kindly" text="kindly" />
      <CharText className="rsvp-title" part="rsvp" text="JOIN US" />
      <CharText className="rsvp-meta" part="deadline" text="AT" />
      <div className="rsvp-contact">
        <CharText className="rsvp-meta rsvp-name" part="rsvp-name" text={weddingData.venue.toUpperCase()} />
        <CharText className="rsvp-meta" part="call" text={weddingData.address.toUpperCase()} />
      </div>
      <a
        className="rsvp-web map-link rsvp-map"
        href={weddingData.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-part="website"
        onClick={(event) => event.stopPropagation()}
      >
        View map
      </a>
    </div>
  );
}
