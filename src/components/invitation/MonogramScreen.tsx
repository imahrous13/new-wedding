import { asset } from "@/lib/assets";

export function MonogramScreen() {
  return (
    <div className="monogram" data-layer="monogram">
      <div className="monogram-paper" />
      <div className="monogram-crest-wrap">
        <img
          className="monogram-crest"
          data-crest="ra"
          src={asset("/textures/ra-crest.png")}
          alt=""
          draggable={false}
        />
      </div>
    </div>
  );
}
