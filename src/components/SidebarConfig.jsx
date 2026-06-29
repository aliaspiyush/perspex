import React from 'react';

function Slider({ label, value, max = 100 }) {
  const blocksTotal = 15;
  const blocksFilled = Math.round((value / max) * blocksTotal);
  const trackString = `[${'█'.repeat(blocksFilled)}${'░'.repeat(blocksTotal - blocksFilled)}]`;

  return (
    <div className="flex flex-col gap-1 font-mono text-[13px] leading-tight mb-4">
      <div className="text-[var(--text)] font-sans text-sm">{label}</div>
      <div className="flex items-center justify-between">
        <div className="text-[var(--text)] tracking-widest">{trackString}</div>
        <div className="text-[var(--text)]">{value}</div>
      </div>
    </div>
  );
}

export default function SidebarConfig() {
  return (
    <div className="h-full bg-[var(--surface-offset)] border-l border-[var(--border)] overflow-y-auto flex flex-col p-6 gap-8">
      
      {/* Scoring Config */}
      <div className="flex flex-col gap-3">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)] font-mono border-b border-[var(--border)] pb-2 mb-2">
          RANKING WEIGHTS
        </div>
        <Slider label="Semantic Match" value={40} />
        <Slider label="Behavioral Signals" value={30} />
        <Slider label="Experience Fit" value={20} />
        <Slider label="Preference Fit" value={10} />
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-2 font-mono text-[13px]">
          <span className="uppercase font-semibold">TOTAL</span>
          <span>100 / 100 ✓</span>
        </div>
      </div>

      {/* Constraints */}
      <div className="flex flex-col gap-3">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)] font-mono border-b border-[var(--border)] pb-2 mb-1">
          COMPUTE CONSTRAINTS
        </div>
        <div className="flex flex-col gap-2 font-mono text-[13px]">
          {[
            { k: 'Runtime budget', v: '5 min' },
            { k: 'RAM limit', v: '16 GB' },
            { k: 'Network', v: 'offline' },
            { k: 'GPU', v: 'none' },
            { k: 'Mode', v: 'CPU-only' }
          ].map(r => (
            <div key={r.k} className="flex justify-between items-center">
              <span className="text-[var(--text-muted)]">{r.k}</span>
              <span>{r.v}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--border)] mt-1"></div>
      </div>

      {/* Dataset Stats */}
      <div className="flex flex-col gap-3">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)] font-mono border-b border-[var(--border)] pb-2 mb-1">
          DATASET
        </div>
        <div className="flex flex-col gap-2 font-mono text-[13px]">
          {[
            { k: 'Records', v: '100,000' },
            { k: 'Open to work', v: '34.6%' },
            { k: 'Honeypots', v: '~80' },
            { k: 'Signals', v: '23' },
            { k: 'Pool size', v: '487 MB' }
          ].map(r => (
            <div key={r.k} className="flex justify-between items-center">
              <span className="text-[var(--text-muted)]">{r.k}</span>
              <span>{r.v}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--border)] mt-1"></div>
      </div>

    </div>
  );
}
