import React from 'react';
import { parseJobDescription } from '../utils/adapters';

export default function RoleProfileView() {
  const profile = parseJobDescription();

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-[family-name:var(--font-display)]">Role Profile</h1>
        <p className="text-sm text-[var(--text-muted)]">Parsed attributes from job_description.docx</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Structured Specification */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Parsed Specification</h2>
          <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] text-sm flex flex-col">
            
            <div className="flex flex-col gap-1 p-5 border-b border-[var(--divider)]">
              <span className="text-[var(--text-muted)] text-xs">Role Title</span>
              <span className="font-medium text-base">{profile.title}</span>
            </div>

            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-1 p-5 border-r border-b border-[var(--divider)]">
                <span className="text-[var(--text-muted)] text-xs">Seniority</span>
                <span>{profile.seniority}</span>
              </div>
              <div className="flex flex-col gap-1 p-5 border-b border-[var(--divider)]">
                <span className="text-[var(--text-muted)] text-xs">Experience</span>
                <span>{profile.years_experience}</span>
              </div>
              <div className="flex flex-col gap-1 p-5 border-r border-b border-[var(--divider)]">
                <span className="text-[var(--text-muted)] text-xs">Location</span>
                <span>{profile.location}</span>
              </div>
              <div className="flex flex-col gap-1 p-5 border-b border-[var(--divider)]">
                <span className="text-[var(--text-muted)] text-xs">Work Mode</span>
                <span>{profile.work_mode}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 p-5 border-b border-[var(--divider)]">
              <span className="text-[var(--text-muted)] text-xs">Required Skills</span>
              <div className="flex flex-wrap gap-2">
                {profile.required_skills.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-[var(--bg)] border border-[var(--border)] rounded text-xs">{skill}</span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 p-5 border-b border-[var(--divider)]">
              <span className="text-[var(--text-muted)] text-xs">Preferred Skills</span>
              <div className="flex flex-wrap gap-2">
                {profile.preferred_skills.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] rounded text-xs">{skill}</span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 p-5 border-b border-[var(--divider)] bg-[var(--surface-offset)]">
              <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">Must-Have Filters</span>
              <ul className="list-disc pl-4 text-[var(--text)] flex flex-col gap-1">
                {profile.must_have_filters.map(filter => <li key={filter}>{filter}</li>)}
              </ul>
            </div>

            <div className="flex flex-col gap-2 p-5 bg-[var(--surface-offset)]">
              <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">Good-to-Have Signals</span>
              <ul className="list-disc pl-4 text-[var(--text)] flex flex-col gap-1">
                {profile.good_to_have_signals.map(sig => <li key={sig}>{sig}</li>)}
              </ul>
            </div>

          </div>
        </section>

        {/* Normalized Role Profile */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Normalized Role Profile</h2>
          <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] text-sm flex flex-col">
            <div className="p-5 border-b border-[var(--divider)]">
              <p className="text-[var(--text-muted)] mb-4">Machine-usable ranking dimensions extracted from JD:</p>
              
              <div className="flex flex-col gap-6 font-mono">
                
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-[var(--text-muted)]">Semantic Target Terms</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.normalized.semantic_terms.map(term => (
                      <span key={term} className="px-1.5 py-0.5 bg-[var(--text)] text-[var(--bg)] rounded-sm text-xs">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs text-[var(--text-muted)]">Experience Band</span>
                  <div className="flex items-center gap-4 border border-[var(--border)] bg-[var(--bg)] p-3 rounded">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase">Min</span>
                      <span>{profile.normalized.experience_band.min} years</span>
                    </div>
                    <div className="h-6 w-px bg-[var(--divider)]"></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase">Ideal</span>
                      <span>{profile.normalized.experience_band.ideal} years</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs text-[var(--text-muted)]">Logistics Fit</span>
                  <div className="flex gap-2 text-xs">
                    {profile.normalized.logistics.map(l => (
                      <span key={l} className="underline decoration-[var(--border)] underline-offset-4">{l}</span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs text-[var(--text-muted)]">Behavioral Preferences</span>
                  <div className="flex flex-col gap-1">
                    {profile.normalized.behavioral.map(b => (
                      <div key={b} className="flex items-center gap-2 text-xs before:content-['└'] before:text-[var(--border)]">
                        {b}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
            <div className="p-5 flex justify-end">
              <button className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-fg)] font-medium rounded-[var(--radius)] text-sm hover:bg-[var(--primary-hover)] transition-colors">
                Proceed to Explorer
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
