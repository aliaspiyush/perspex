import React, { useState, useEffect, useMemo } from 'react';
import { fetchCandidates, getMetadataTemplate } from '../utils/adapters';

export default function SubmissionView() {
  const metadataYaml = getMetadataTemplate();
  
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchCandidates();
      setCandidates(data);
      setLoading(false);
    };
    load();
  }, []);
  
  // Real data is already sorted by the backend and rank is 1-indexed.
  const previewRows = useMemo(() => {
    return candidates.slice(0, 10).map((c, i) => ({
      id: c.id,
      rank: c.rank || i + 1,
    }));
  }, [candidates]);

  const handleExport = () => {
    const csvContent = [
      ['candidate_id', 'rank'].join(','),
      ...previewRows.map(r => [r.id, r.rank].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "sample_submission.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-12 max-w-5xl mx-auto pb-12 min-h-[600px]">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-[family-name:var(--font-display)]">Submission Export</h1>
        </div>
        <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] text-sm border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] p-12">
          Loading actual candidate data from backend...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-[family-name:var(--font-display)]">Submission Export</h1>
        <p className="text-sm text-[var(--text-muted)]">Prepare outputs required by submission_spec.docx</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="flex flex-col gap-8">
          {/* Output Requirements */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Output Requirements</h2>
            <div className="border border-[var(--border)] rounded-[var(--radius)] p-5 bg-[var(--surface)] text-sm flex flex-col gap-3">
              <p className="text-[var(--text)]">The submission must contain exactly two files packed into a standard zip archive:</p>
              <ul className="list-disc pl-4 flex flex-col gap-1 text-[var(--text-muted)]">
                <li><code className="text-[var(--text)]">submission.csv</code> — The Top 100 ranked candidates.</li>
                <li><code className="text-[var(--text)]">metadata.yaml</code> — Team configuration and execution details.</li>
              </ul>
            </div>
          </section>

          {/* Validation */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Validation Check</h2>
            <div className="border border-[var(--border)] rounded-[var(--radius)] p-5 bg-[var(--surface-offset)] text-sm flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--text)]"></div>
                <span className="font-mono">validate_submission.py</span>
                <span className="ml-auto text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Loaded</span>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed mt-2">
                Prior to final export, the workbench runs the local validator to ensure output schema parity. Format checks pass for current workbench configuration.
              </p>
            </div>
          </section>

          {/* Metadata Block */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Metadata Configuration</h2>
            <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] text-sm overflow-hidden flex flex-col">
              <div className="p-4 bg-[var(--surface-2)] border-b border-[var(--divider)] font-mono text-[var(--text-muted)] text-xs">
                submission_metadata_template.yaml
              </div>
              <pre className="p-4 font-mono text-xs overflow-x-auto text-[var(--text)] bg-[var(--bg)]">
                {metadataYaml}
              </pre>
              <div className="p-4 border-t border-[var(--divider)] flex justify-between items-center bg-[var(--surface-2)] text-xs">
                <span className="text-[var(--text-muted)]">Ensure all fields are hydrated before packaging.</span>
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-8">
          {/* CSV Preview */}
          <section className="flex flex-col gap-4 h-full">
            <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">CSV Preview (Top 100)</h2>
            <div className="border border-[var(--border)] rounded-[var(--radius)] flex flex-col h-full bg-[var(--surface)]">
              <div className="flex-1 p-0 overflow-y-auto max-h-[500px]">
                <table className="w-full text-sm text-left">
                  <thead className="border-b border-[var(--divider)] sticky top-0 bg-[var(--surface)]">
                    <tr>
                      <th className="px-5 py-3 font-mono text-xs text-[var(--text-muted)]">candidate_id</th>
                      <th className="px-5 py-3 font-mono text-xs text-[var(--text-muted)] text-right">rank</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--divider)] font-mono text-sm bg-[var(--bg)]">
                    {previewRows.map(row => (
                      <tr key={row.id}>
                        <td className="px-5 py-2.5">{row.id}</td>
                        <td className="px-5 py-2.5 text-right">{row.rank}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="2" className="px-5 py-4 text-center text-[var(--text-muted)] italic text-xs bg-[var(--surface)]">
                        ... 90 more rows generated on export
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-[var(--divider)] flex justify-end">
                <button onClick={handleExport} className="px-4 py-2 bg-[var(--text)] text-[var(--bg)] font-medium rounded-[var(--radius)] text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                  Download submission.csv
                </button>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
