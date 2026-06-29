export function scoreCandidate(candidate, weights) {
  return (
    (weights.semantic / 100) * candidate.semantic +
    (weights.behavioral / 100) * candidate.behavioral +
    (weights.experience / 100) * candidate.experience +
    (weights.preference / 100) * candidate.preference
  )
}
