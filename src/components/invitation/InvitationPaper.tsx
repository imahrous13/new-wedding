import { asset } from "@/lib/assets";
import { CoupleNames, IntroMessage, RSVP, SaveTheDate } from "./scenes";

const STEMS = ["a", "b", "c", "d", "e"] as const;

export function InvitationPaper() {
  return (
    <div className="paper" data-layer="paper">
      <div className="paper-texture" />
      <div className="paper-flora" data-flora="pampas" aria-hidden="true">
        {STEMS.map((id) => (
          <img
            key={id}
            data-stem={id}
            src={asset(`/textures/pampas-${id}.png`)}
            alt=""
            draggable={false}
          />
        ))}
        <img
          data-stem="full"
          src={asset("/textures/pampas-full.png")}
          alt=""
          draggable={false}
        />
      </div>
      <div className="paper-wash" />
      <div className="paper-vignette" />
      <IntroMessage />
      <CoupleNames />
      <SaveTheDate />
      <RSVP />
    </div>
  );
}
