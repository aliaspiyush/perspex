export function exportCsv(results) {
  const rows = [
    ['candidateid', 'rank', 'score', 'reasoning'],
    ...results.map((r) => [
      r.candidate_id || r.id, 
      r.rank, 
      r.overall_score ?? 0, 
      `"${(r.reasoning || '').replace(/"/g, '""')}"`
    ])
  ]
  const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv' })
  const a = document.createElement('a')

  a.href = URL.createObjectURL(blob)
  a.download = 'perspex_submission.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}
