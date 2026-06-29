import { useMemo } from 'react';

function mulberry32(seed) {
  return function() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const useMockData = () => {
  const data = useMemo(() => {
    const rng = mulberry32(42);
    const candidates = [];

    const randomBetween = (min, max) => rng() * (max - min) + min;

    for (let i = 0; i < 100; i++) {
      const isTopTier = i < 20;
      const semantic = isTopTier ? randomBetween(0.55, 0.98) : randomBetween(0.35, 0.75);
      const behavioral = isTopTier ? randomBetween(0.6, 0.95) : randomBetween(0.2, 0.7);
      const experience = isTopTier ? randomBetween(0.65, 0.99) : randomBetween(0.4, 0.8);
      const preference = randomBetween(0.5, 0.9);

      const final = 0.4 * semantic + 0.3 * behavioral + 0.2 * experience + 0.1 * preference;

      const lastActiveDate = new Date();
      lastActiveDate.setDate(lastActiveDate.getDate() - Math.floor(rng() * 180));

      candidates.push({
        candidate_id: `CAND_${String(i + 1).padStart(5, '0')}`,
        semantic_fit: semantic * 100,
        behavioral_score: behavioral * 100,
        experience_fit: experience * 100,
        preference_fit: preference * 100,
        overall_score: final * 100,
        is_honeypot: false,
        redrob_signals: {
          open_to_work_flag: rng() > 0.3,
          notice_period_days: [0, 30, 60, 90][Math.floor(rng() * 4)],
          recruiter_response_rate: randomBetween(0.1, 0.95),
          github_activity_score: rng() > 0.2 ? randomBetween(20, 95) : -1,
          last_active_date: lastActiveDate.toISOString(),
        },
        profile: {
            location: "San Francisco, CA",
            work_mode: ["remote", "hybrid", "onsite", "flexible"][Math.floor(rng() * 4)],
        }
      });
    }

    // Inject honeypots
    for (let i = 87; i <= 90; i++) {
      candidates[i] = {
        ...candidates[i],
        candidate_id: `CAND_${String(i + 1).padStart(5, '0')}`,
        semantic_fit: 91,
        behavioral_score: 12,
        experience_fit: randomBetween(0.4, 0.6) * 100,
        preference_fit: randomBetween(0.5, 0.8) * 100,
        is_honeypot: true,
        redrob_signals: {
            ...candidates[i].redrob_signals,
            open_to_work_flag: false,
            recruiter_response_rate: 0.03,
        },
      };
       candidates[i].overall_score = 0.4 * (candidates[i].semantic_fit / 100) + 0.3 * (candidates[i].behavioral_score / 100) + 0.2 * (candidates[i].experience_fit / 100) + 0.1 * (candidates[i].preference_fit / 100);
       candidates[i].overall_score *= 100;
    }

    const sorted = candidates.sort((a, b) => b.overall_score - a.overall_score);

    return sorted.map((c, i) => ({
      ...c,
      rank: i + 1,
      overall_score: c.overall_score.toFixed(3),
      semantic_fit: c.semantic_fit.toFixed(2),
      career_relevance: c.experience_fit.toFixed(2), // Using experience_fit for career_relevance
      signal_quality: c.behavioral_score.toFixed(2), // Using behavioral_score for signal_quality
    }));
  }, []);

  return data;
};

export default useMockData;