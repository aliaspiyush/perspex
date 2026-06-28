import React, { useState, useEffect, useMemo } from 'react';
import { fetchCandidates } from '../utils/adapters';

export default function CandidateExplorerView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
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
  
  const filteredCandidates = useMemo(() => {
    if (!searchQuery) return candidates;
    const q = searchQuery.toLowerCase();
    return candidates.filter(c => 
      c.id.toLowerCase().includes(q) ||
      (c.profile?.title || '').toLowerCase().includes(q) ||
      (c.profile?.current_company || '').toLowerCase().includes(q) ||
      (c.skills || []).some(s => s.name.toLowerCase().includes(q))
    );
  }, [candidates, searchQuery]);

  const selectedCandidate = candidates.find(c => c.id === selectedId);

  // Consistency Check Logic
  const getFlags = (c) => {
    if (!c) return [];
    const flags = [];
    c.skills.forEach(s => {
      if ((s.proficiency === 'Expert' || s.proficiency === 'Advanced') && s.duration_months === 0) {
        flags.push(`Suspicious: ${s.proficiency} in ${s.name} with 0 months duration.`);
      }
    });
    if (c.redrob_signals.response_rate === '0%') {
      flags.push('Missing behavioral credibility: 0% response rate.');
    }
    return flags;
  };
  const flags = getFlags(selectedCandidate);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 h-[calc(100vh-140px)]">
        <div className="flex flex-col gap-2 shrink-0">
          <h1 className="text-2xl font-[family-name:var(--font-display)]">Candidate Explorer</h1>
        </div>
        <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] text-sm border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)]">
          Loading actual candidate data from backend...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-140px)]">
      <div className="flex flex-col gap-2 shrink-0">
        <h1 className="text-2xl font-[family-name:var(--font-display)]">Candidate Explorer</h1>
        <p className="text-sm text-[var(--text-muted)]">Inspect raw candidate artifacts mapped to candidate_schema.json</p>
      </div>

      <div className="flex h-full min-h-0 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] overflow-hidden">
        
        {/* Left Panel - List */}
        <div className="w-1/3 flex flex-col border-r border-[var(--border)] min-w-[280px]">
          <div className="p-4 border-b border-[var(--divider)] bg-[var(--surface-2)]">
            <input 
              type="text" 
              placeholder="Search ID, title, company, skill..."
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] focus:outline-none focus:border-[var(--text-muted)] transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredCandidates.map(c => (
              <div 
                key={c.id} 
                onClick={() => setSelectedId(c.id)}
                className={`p-4 border-b border-[var(--divider)] cursor-pointer transition-colors ${selectedId === c.id ? 'bg-[var(--surface-offset)] border-l-2 border-l-[var(--text)]' : 'hover:bg-[var(--surface-offset)] border-l-2 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-sm font-medium">{c.id}</span>
                </div>
                <div className="text-sm truncate text-[var(--text)]">{c.profile?.current_title}</div>
                <div className="text-xs text-[var(--text-muted)] truncate">{c.profile?.current_company}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Detail */}
        <div className="w-2/3 flex flex-col min-w-0 bg-[var(--bg)]">
          {selectedCandidate ? (
            <>
              {/* Header */}
              <div className="px-8 py-6 border-b border-[var(--divider)] flex flex-col gap-2">
                <div className="text-xl font-mono font-medium">{selectedCandidate.id}</div>
                <div className="text-sm text-[var(--text-muted)]">{selectedCandidate.profile?.current_title} at {selectedCandidate.profile?.current_company}</div>
              </div>

              {/* Tabs */}
              <div className="px-8 border-b border-[var(--divider)] flex gap-6 text-sm overflow-x-auto shrink-0">
                {['profile', 'career history', 'education', 'skills', 'signals'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 capitalize transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-[var(--text)] font-medium' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
                
                {flags.length > 0 && (
                  <div className="p-4 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface-offset)] flex flex-col gap-2">
                    <div className="text-xs font-semibold uppercase tracking-wider">Consistency Check Flags</div>
                    <ul className="text-sm list-disc pl-4 flex flex-col gap-1">
                      {flags.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="flex flex-col gap-4 text-sm">
                    <div className="grid grid-cols-2 gap-y-4">
                      <div className="flex flex-col gap-1"><span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Title</span><span>{selectedCandidate.profile?.current_title}</span></div>
                      <div className="flex flex-col gap-1"><span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Company</span><span>{selectedCandidate.profile?.current_company}</span></div>
                      <div className="flex flex-col gap-1"><span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Location</span><span>{selectedCandidate.profile?.location}</span></div>
                      <div className="flex flex-col gap-1"><span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Experience</span><span>{selectedCandidate.profile?.years_of_experience} years</span></div>
                    </div>
                  </div>
                )}

                {activeTab === 'career history' && (
                  <div className="flex flex-col gap-6">
                    {(selectedCandidate.career_history || []).map((job, idx) => (
                      <div key={idx} className="flex flex-col gap-2 pb-6 border-b border-[var(--divider)] last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">{job.title}</div>
                          <div className="text-xs text-[var(--text-muted)] font-mono">{job.duration_months} mo</div>
                        </div>
                        <div className="text-sm text-[var(--text-muted)]">{job.company} {job.is_current ? '(Current)' : ''}</div>
                        <div className="text-sm mt-1">{job.description}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="flex flex-col gap-4">
                    {(selectedCandidate.education || []).map((edu, idx) => (
                      <div key={idx} className="flex flex-col gap-1 text-sm">
                        <span className="font-medium">{edu.degree}</span>
                        <span className="text-[var(--text-muted)]">{edu.institution} ({edu.end_year || edu.year})</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="w-full border border-[var(--divider)] rounded">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[var(--surface-2)] border-b border-[var(--divider)]">
                        <tr>
                          <th className="px-4 py-2 font-medium text-[var(--text-muted)]">Skill Name</th>
                          <th className="px-4 py-2 font-medium text-[var(--text-muted)]">Proficiency</th>
                          <th className="px-4 py-2 font-medium text-[var(--text-muted)]">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--divider)]">
                        {(selectedCandidate.skills || []).map((s, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2">{s.name}</td>
                            <td className="px-4 py-2 text-[var(--text-muted)] capitalize">{s.proficiency}</td>
                            <td className="px-4 py-2 font-mono text-xs">{s.duration_months || 0} mo</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'signals' && (
                  <div className="flex flex-col gap-6">
                    <h3 className="text-sm text-[var(--text-muted)]">Extracted from redrob_signals payload</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedCandidate.redrob_signals || {}).map(([key, value]) => {
                        if (typeof value === 'object') return null; // skip nested for simplicity
                        return (
                          <div key={key} className="flex flex-col gap-1 border border-[var(--border)] p-4 rounded bg-[var(--surface-2)]">
                            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
                            <span className="font-mono text-sm truncate" title={String(value)}>{String(value)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
              Select a candidate to view structure
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
