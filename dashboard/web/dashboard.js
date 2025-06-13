async function fetchData() {
  const response = await fetch('/visits.json');
  return response.json();
}

async function drawChart() {
  const data = await fetchData();
  const ctx = document.getElementById('chart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: 'Visitas',
        data: Object.values(data)
      }]
    }
  });
}

drawChart();
setInterval(drawChart, 60000);
