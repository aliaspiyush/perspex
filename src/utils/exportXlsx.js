export function exportXlsx(results) {
  if (typeof window.XLSX === 'undefined') {
    throw new Error('XLSX library is not loaded.');
  }

  const XLSX = window.XLSX;
  const wb = XLSX.utils.book_new();

  const wsData = [
    ['Rank', 'Candidate ID', 'Final Score', 'Semantic', 'Behavioral', 'Experience', 'Preference'],
    ...results.map((c) => [
      c.rank,
      c.candidate_id,
      c.final,
      c.semantic,
      c.behavioral,
      c.experience,
      c.preference,
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Formatting rules
  // Header row bold
  for (let C = 0; C < 7; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!ws[cellAddress]) continue;
    ws[cellAddress].s = { font: { bold: true } };
  }

  // Set number formats
  for (let R = 1; R <= results.length; ++R) {
    // Score columns: Final (2), Semantic (3), Behavioral (4), Experience (5), Preference (6)
    for (let C = 2; C <= 6; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].z = '0.000'; // 3 decimal places
    }
  }

  // Auto-width all columns based on content length
  const colWidths = wsData[0].map((_, colIndex) => {
    const maxWidth = wsData.reduce((max, row) => {
      const cellValue = row[colIndex] ? row[colIndex].toString() : '';
      return Math.max(max, cellValue.length);
    }, 10);
    return { wch: maxWidth + 2 }; // Add a little padding
  });
  ws['!cols'] = colWidths;

  // Freeze the first row
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  XLSX.utils.book_append_sheet(wb, ws, 'Perspex Results');
  XLSX.writeFile(wb, 'perspex_results.xlsx');
}
