export function exportCsv(results) {
  const rows = [['candidate_id', 'rank'], ...results.map((result) => [result.id, result.rank])]
  const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv' })
  const a = document.createElement('a')

  a.href = URL.createObjectURL(blob)
  a.download = 'perspex_submission.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}
