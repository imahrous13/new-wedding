import { CoupleNames, IntroMessage, RSVP, SaveTheDate } from "./scenes";

export function InvitationPaper() {
  return (
    <div className="paper" data-layer="paper">
      <div className="paper-texture" />
      <div className="paper-wash" />
      <div className="paper-vignette" />
      <IntroMessage />
      <CoupleNames />
      <SaveTheDate />
      <RSVP />
    </div>
  );
}
