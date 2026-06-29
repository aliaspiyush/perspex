import React, { useState, useEffect } from 'react';

export default function PythonTerminal() {
  const [cursorBlink, setCursorBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setCursorBlink(c => !c), 500);
    return () => clearInterval(interval);
  }, []);

  const files = [
    {
      name: 'index_builder.py',
      code: `import faiss, numpy as np
from sentence_transformers import (
    SentenceTransformer
)

MODEL = "all-MiniLM-L6-v2"
DIM   = 384

def build_index(records):
    model = SentenceTransformer(MODEL)
    texts = [
        build_text(r) for r in records
    ]
    emb = model.encode(
        texts,
        batch_size=512,
        show_progress_bar=True
    )
    idx = faiss.IndexFlatL2(DIM)
    idx.add(emb.astype(np.float32))
    return idx, emb`
    },
    {
      name: 'honeypot_detector.py',
      code: `def is_honeypot(c: dict) -> bool:
    for skill in c.get("skills", []):
        if (skill["proficiency"] == "expert"
                and skill["duration_months"] == 0):
            return True
    return False`
    },
    {
      name: 'ranker.py',
      code: `WEIGHTS = {
    "semantic":    0.40,
    "behavioral":  0.30,
    "experience":  0.20,
    "preference":  0.10
}

def score(candidate, jd_emb, idx):
    s = semantic_score(candidate, jd_emb)
    b = behavioral_score(candidate)
    e = experience_score(candidate)
    p = preference_score(candidate)
    return (
        WEIGHTS["semantic"]   * s
      + WEIGHTS["behavioral"] * b
      + WEIGHTS["experience"] * e
      + WEIGHTS["preference"] * p
    )`
    }
  ];

  // Helper to format keywords inside code purely via styling classes
  const highlightCode = (codeStr) => {
    // A primitive syntax highlighter just for aesthetics based on prompt instructions
    // "Keywords are bold, strings are italic. No syntax color."
    const keywords = ["import", "from", "def", "return", "for", "in", "if", "and", "bool", "dict", "True", "False"];
    const tokens = codeStr.split(/(\\n|\\s+|"[^"]*"|'[^']*'|[a-zA-Z_]\\w*)/g);
    
    return tokens.map((token, i) => {
      if (!token) return null;
      if (token.startsWith('"') || token.startsWith("'")) {
        return <span key={i} className="italic text-[var(--text-muted)]">{token}</span>;
      }
      if (keywords.includes(token)) {
        return <strong key={i} className="font-semibold text-[var(--text)]">{token}</strong>;
      }
      return <span key={i}>{token}</span>;
    });
  };

  return (
    <div className="h-full bg-[var(--surface-offset)] border-r border-[var(--border)] overflow-y-auto flex flex-col font-mono text-[13px] leading-relaxed">
      <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--bg)] sticky top-0 flex items-center justify-between z-10">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">BACKGROUND PROCESS</span>
      </div>
      
      <div className="flex flex-col p-4 gap-6 text-[var(--text)]">
        {files.map((f, i) => {
          const lines = f.code.split('\\n');
          return (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[var(--text-faint)] select-none">
                <span>───</span>
                <span className="font-medium text-[var(--text)]">{f.name}</span>
                <span className="flex-1 border-t border-[var(--border)] mt-[1px]"></span>
              </div>
              <div className="flex">
                <div className="flex flex-col text-right text-[var(--text-faint)] select-none pr-4 min-w-[2.5rem]">
                  {lines.map((_, idx) => <div key={idx}>{idx + 1}</div>)}
                </div>
                <div className="flex flex-col whitespace-pre flex-1">
                  {lines.map((line, idx) => (
                    <div key={idx} className="min-h-[1.2em]">
                      {highlightCode(line)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="flex items-center gap-2 text-[var(--text-faint)] mt-2">
          <span>{cursorBlink ? '█' : '\u00A0'}</span>
        </div>
      </div>
    </div>
  );
}
