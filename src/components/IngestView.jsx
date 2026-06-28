import React from 'react';
import { getChallengeFiles } from '../utils/adapters';

export default function IngestView() {
  const files = getChallengeFiles();

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-[family-name:var(--font-display)]">Challenge Ingestion</h1>
        <p className="text-sm text-[var(--text-muted)]">Verify and load Redrob challenge artifacts into the workbench.</p>
      </div>

      {/* A. Challenge Artifacts */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Challenge Artifacts</h2>
        <div className="border border-[var(--border)] rounded-[var(--radius)] overflow-x-auto bg-[var(--surface)]">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-[var(--divider)] bg-[var(--surface-2)]">
              <tr>
                <th className="px-4 py-3 font-medium text-[var(--text-muted)]">File Name</th>
                <th className="px-4 py-3 font-medium text-[var(--text-muted)]">Type</th>
                <th className="px-4 py-3 font-medium text-[var(--text-muted)]">Role in Pipeline</th>
                <th className="px-4 py-3 font-medium text-[var(--text-muted)]">Status</th>
                <th className="px-4 py-3 font-medium text-[var(--text-muted)] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--divider)]">
              {files.map(f => (
                <tr key={f.name} className="hover:bg-[var(--surface-offset)] transition-colors">
                  <td className="px-4 py-3 font-mono">{f.name}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{f.type}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{f.role}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-[var(--border)] bg-[var(--bg)] capitalize">
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors underline underline-offset-2">
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* B. File Role Summary */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">File Role Summary</h2>
          <div className="border border-[var(--border)] rounded-[var(--radius)] p-5 bg-[var(--surface)] flex flex-col gap-3 text-sm">
            <div className="flex justify-between border-b border-[var(--divider)] pb-2">
              <span className="text-[var(--text-muted)]">JD Source</span>
              <span className="font-mono">job_description.docx</span>
            </div>
            <div className="flex justify-between border-b border-[var(--divider)] pb-2">
              <span className="text-[var(--text-muted)]">Candidate Sample</span>
              <span className="font-mono">sample_candidates.json</span>
            </div>
            <div className="flex justify-between border-b border-[var(--divider)] pb-2">
              <span className="text-[var(--text-muted)]">Schema</span>
              <span className="font-mono">candidate_schema.json</span>
            </div>
            <div className="flex justify-between border-b border-[var(--divider)] pb-2">
              <span className="text-[var(--text-muted)]">Signals Reference</span>
              <span className="font-mono">redrob_signals_doc.docx</span>
            </div>
            <div className="flex justify-between border-b border-[var(--divider)] pb-2">
              <span className="text-[var(--text-muted)]">Submission Rules</span>
              <span className="font-mono">submission_spec.docx</span>
            </div>
            <div className="flex justify-between border-b border-[var(--divider)] pb-2">
              <span className="text-[var(--text-muted)]">Validator</span>
              <span className="font-mono">validate_submission.py</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Metadata Template</span>
              <span className="font-mono">submission_metadata_template.yaml</span>
            </div>
          </div>
        </section>

        {/* C. Ingest Validation */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Ingest Validation</h2>
          <div className="border border-[var(--border)] rounded-[var(--radius)] p-5 bg-[var(--surface)] flex flex-col gap-4 text-sm h-full">
            <p className="text-[var(--text-muted)] mb-2">Minimum viable build inputs check:</p>
            {[
              { label: 'JD loaded', done: true },
              { label: 'Candidate sample loaded', done: true },
              { label: 'Schema loaded', done: true },
              { label: 'Signal doc loaded', done: true },
              { label: 'Spec loaded', done: true }
            ].map((check, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-4 h-4 border rounded flex items-center justify-center text-[10px] ${check.done ? 'border-[var(--text)] text-[var(--text)]' : 'border-[var(--border)]'}`}>
                  {check.done && '✓'}
                </div>
                <span className={check.done ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}>{check.label}</span>
              </div>
            ))}
            
            <div className="mt-auto pt-4 flex justify-end">
              <button className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-fg)] font-medium rounded-[var(--radius)] text-sm hover:bg-[var(--primary-hover)] transition-colors">
                Proceed to Role Profile
              </button>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
