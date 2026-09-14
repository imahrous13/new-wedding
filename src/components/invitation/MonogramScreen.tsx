import { getInitials, weddingData } from "@/data/wedding";
import { asset } from "@/lib/assets";

export function MonogramScreen() {
  const initials = getInitials(weddingData);

  return (
    <div className="monogram" data-layer="monogram">
      <div className="monogram-paper" />
      <div className="monogram-mark">
        <img
          className="monogram-frame"
          src={asset("/textures/monogram.png")}
          alt=""
          draggable={false}
        />
        <div className="monogram-initials" aria-label={`${initials.first} ${initials.second}`}>
          <span className="mono-letter mono-first">{initials.first}</span>
          <span className="mono-letter mono-second">{initials.second}</span>
        </div>
      </div>
    </div>
  );
}
