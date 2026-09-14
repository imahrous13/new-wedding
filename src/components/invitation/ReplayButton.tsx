type ReplayButtonProps = {
  onReplay: () => void;
};

export function ReplayButton({ onReplay }: ReplayButtonProps) {
  return (
    <button
      className="replay"
      type="button"
      data-layer="replay"
      onClick={onReplay}
      aria-label="Replay invitation"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M8 5.75v12.5L19 12 8 5.75z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
