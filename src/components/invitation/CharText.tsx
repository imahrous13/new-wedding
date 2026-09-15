type CharTextProps = {
  text: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "div" | "span";
  charClassName?: string;
  part?: string;
  connected?: boolean;
};

export function CharText({
  text,
  className,
  as: Tag = "p",
  charClassName = "ch",
  part,
  connected = false,
}: CharTextProps) {
  if (connected) {
    return (
      <Tag className={className} aria-label={text} data-part={part}>
        <span className={`${charClassName} ch-connected`} aria-hidden="true">
          {text}
        </span>
      </Tag>
    );
  }
  const tokens = text.split(/(\s+)/);

  return (
    <Tag className={className} aria-label={text} data-part={part}>
      {tokens.map((token, tokenIndex) => {
        if (/^\s+$/.test(token)) {
          return (
            <span className={`${charClassName} ch-space`} aria-hidden="true" key={`space-${tokenIndex}`}>
              {" "}
            </span>
          );
        }

        return (
          <span className="ch-word" key={`word-${tokenIndex}`}>
            {Array.from(token).map((char, index) => (
              <span className={charClassName} aria-hidden="true" key={`${char}-${index}`}>
                {char}
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}

type LineTextProps = {
  lines: string[];
  className?: string;
  lineClassName?: string;
};

export function LineText({ lines, className, lineClassName }: LineTextProps) {
  return (
    <div className={className} aria-label={lines.join(" ")}>
      {lines.map((line) => (
        <CharText className={lineClassName} text={line} key={line} />
      ))}
    </div>
  );
}
