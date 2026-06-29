import { useMemo } from 'react'
import { scoreCandidate } from '../utils/scorer.js'

function mulberry32(seed) {
  return function random() {
    seed |= 0
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function ranged(random, min, max) {
  return min + random() * (max - min)
}

function isoWithinPastSixMonths(random) {
  const now = new Date()
  const daysBack = Math.floor(ranged(random, 1, 180))
  const date = new Date(now)
  date.setDate(now.getDate() - daysBack)
  return date.toISOString()
}

function generateSignals(random, overrides = {}) {
  const modes = ['remote', 'hybrid', 'onsite', 'flexible']
  const githubRoll = random()

  return {
    open_to_work: random() > 0.22,
    notice_period: Math.floor(ranged(random, 0, 91)),
    response_rate: Number(ranged(random, 0.18, 0.98).toFixed(2)),
    github_score: githubRoll < 0.16 ? -1 : Math.floor(ranged(random, 20, 96)),
    last_active: isoWithinPastSixMonths(random),
    work_mode: modes[Math.floor(random() * modes.length)],
    ...overrides,
  }
}

export function useMockData(weights) {
  return useMemo(() => {
    const random = mulberry32(42)
    const candidates = Array.from({ length: 100 }, (_, index) => {
      const isTopBand = index < 20
      const baseRange = isTopBand ? [0.55, 0.98] : [0.35, 0.75]
      const candidate = {
        candidate_id: `CAND_${String(index + 1).padStart(5, '0')}`,
        semantic: ranged(random, baseRange[0], baseRange[1]),
        behavioral: ranged(random, baseRange[0], baseRange[1]),
        experience: ranged(random, baseRange[0], baseRange[1]),
        preference: ranged(random, baseRange[0], baseRange[1]),
        signals: generateSignals(random),
        honeypot: false,
      }

      if (index >= 87 && index <= 90) {
        candidate.semantic = 0.91
        candidate.behavioral = 0.12
        candidate.experience = ranged(random, 0.38, 0.58)
        candidate.preference = ranged(random, 0.32, 0.62)
        candidate.signals = generateSignals(random, {
          open_to_work: false,
          response_rate: 0.03,
        })
        candidate.honeypot = true
      }

      return {
        ...candidate,
        final: scoreCandidate(candidate, weights),
      }
    })

    return candidates
      .sort((a, b) => b.final - a.final)
      .map((candidate, index) => ({
        ...candidate,
        id: candidate.candidate_id,
        rank: index + 1,
      }))
  }, [weights])
}
