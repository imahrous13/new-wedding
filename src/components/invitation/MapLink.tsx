import { weddingData } from "@/data/wedding";

type MapLinkProps = {
  className?: string;
  part?: string;
};

export function MapLink({ className = "", part }: MapLinkProps) {
  return (
    <a
      className={`map-link ${className}`.trim()}
      href={weddingData.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-part={part}
      onClick={(event) => event.stopPropagation()}
    >
      <svg className="map-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2.25c-3.45 0-6.25 2.76-6.25 6.16 0 4.64 5.4 11.37 5.63 11.65a.88.88 0 0 0 1.24 0c.23-.28 5.63-7.01 5.63-11.65 0-3.4-2.8-6.16-6.25-6.16Zm0 8.35a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4Z"
        />
      </svg>
      <span>View map</span>
    </a>
  );
}
