import { useLang } from '../context/LanguageContext';

interface DiagramProps {
  /** Monospace flow / schematic art. Rendered verbatim. */
  art: string;
  /** Short mono label shown in the header rule, e.g. "flow · state transition". */
  bnLabel: string;
  enLabel: string;
  /** Optional one-line explanation under the art. */
  bnCaption?: string;
  enCaption?: string;
}

/**
 * A flow / block diagram set apart from the prose.
 *
 * Deliberately styled unlike the `<pre>` code blocks used for binary and
 * source listings: no fill, ruled top and bottom, centred art. A diagram is
 * a figure the reader looks *at*, not a listing they read line by line.
 */
export function Diagram({ art, bnLabel, enLabel, bnCaption, enCaption }: DiagramProps) {
  const { bn } = useLang();
  const caption = bn ? bnCaption : enCaption;

  return (
    <figure data-role="diagram" style={{ margin: '26px 0 26px' }}>
      <div
        className="flex items-center gap-3"
        style={{ marginBottom: 10 }}
      >
        <span
          className="font-mono text-[11px] text-machine-green"
          style={{ letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
        >
          {bn ? bnLabel : enLabel}
        </span>
        <div className="flex-1 h-px bg-rule" />
      </div>

      <div style={{ overflowX: 'auto', padding: '4px 0' }}>
        <pre
          style={{
            fontFamily: "'Departure Mono',monospace",
            fontSize: '12.5px',
            lineHeight: 1.55,
            color: '#33301F',
            // .article-root pre paints a dark well; a diagram sits on the paper.
            background: 'transparent',
            border: 'none',
            margin: 0,
            padding: '0 2px',
            display: 'inline-block',
            minWidth: 'min-content',
          }}
        >
          {art}
        </pre>
      </div>

      <div className="h-px bg-rule" style={{ marginTop: 10 }} />

      {caption && (
        <figcaption
          data-role="caption"
          className="font-mono text-[11.5px] text-ink-faint"
          style={{ marginTop: 8 }}
          {...(bn ? { lang: 'bn' } : {})}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
