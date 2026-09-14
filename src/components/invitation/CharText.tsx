type CharTextProps = {
  text: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "div" | "span";
  charClassName?: string;
  part?: string;
};

export function CharText({
  text,
  className,
  as: Tag = "p",
  charClassName = "ch",
  part,
}: CharTextProps) {
  return (
    <Tag className={className} aria-label={text} data-part={part}>
      {Array.from(text).map((char, index) => (
        <span className={charClassName} aria-hidden="true" key={`${char}-${index}`}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
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
        <p className={lineClassName} key={line}>
          {Array.from(line).map((char, index) => (
            <span className="ch" aria-hidden="true" key={`${line}-${char}-${index}`}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
