async function loadData() {
  const stats = await fetch('./world_stock_indices_summary_stats.json').then(r=>r.json());
  const data = await fetch('./world_stock_indices_dashboard_rows.json').then(r=>r.json());

  document.getElementById('stats').innerHTML = `
    <p>Total Indices: ${stats.total}</p>
  `;

  let table = '<table><tr><th>Name</th><th>Region</th><th>Provider</th></tr>';
  data.slice(0,50).forEach(row=>{
    table += `<tr><td>${row.name}</td><td>${row.region}</td><td>${row.provider}</td></tr>`;
  });
  table += '</table>';

  document.getElementById('table').innerHTML = table;
}

loadData();
