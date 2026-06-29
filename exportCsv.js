export const exportCsv = (results) => {
    const headers = ['rank', 'candidate_id', 'overall_score', 'semantic_fit', 'career_relevance', 'signal_quality', 'is_honeypot', 'reasoning'];
    const rows = results.map(r => [
      r.rank, r.candidate_id, r.overall_score, r.semantic_fit, r.career_relevance, r.signal_quality, r.is_honeypot, `"${(r.reasoning || '').replace(/"/g, "''")}"`
    ]);
  
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'perspex_ranking.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };