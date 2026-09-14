import { asset } from "@/lib/assets";

export function Envelope() {
  return (
    <div className="envelope" data-layer="envelope">
      <div className="flap-shadow flap-shadow-top" data-shadow="top" />
      <div className="flap-shadow flap-shadow-bottom" data-shadow="bottom" />
      <div className="flap-shadow flap-shadow-left" data-shadow="left" />
      <div className="flap-shadow flap-shadow-right" data-shadow="right" />

      <div className="flap flap-top" data-flap="top">
        <div className="flap-face" />
      </div>
      <div className="flap flap-bottom" data-flap="bottom">
        <div className="flap-face" />
      </div>
      <div className="flap flap-left" data-flap="left">
        <div className="flap-face" />
      </div>
      <div className="flap flap-right" data-flap="right">
        <div className="flap-face" />
      </div>

      <img
        className="envelope-cover"
        data-cover="closed"
        src={asset("/textures/envelope-closed.png")}
        alt=""
        draggable={false}
      />
    </div>
  );
}
