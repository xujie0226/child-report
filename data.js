
let data = {};
fetch('data_tscore.json')
  .then(response => response.json())
  .then(json => {
    data = json;
    const kgSelect = document.getElementById("kindergarten");
    for (const kg in data) {
      const option = document.createElement("option");
      option.value = kg;
      option.text = kg;
      kgSelect.appendChild(option);
    }
  });

let chart = null;

function search() {
  const kg = document.getElementById("kindergarten").value;
  const name = document.getElementById("childName").value.trim();
  const child = data[kg]?.[name];
  const title = document.getElementById("childTitle");
  const output = document.getElementById("reportText");
  if (!child) {
    title.innerHTML = "";
    output.innerHTML = "<p style='color:red;'>未找到该儿童数据，请检查输入。</p>";
    if (chart) chart.destroy();
    return;
  }

  title.innerHTML = `${kg} - ${name} 的测评报告`;

  const labels = [], scores = [], html = [];
  for (const key in child) {
    if (key.endsWith("能力")) {
      const dim = key.replace("能力", "");
      const t = child[key];
      const level = child[dim + "等级"];
      const suggestion = child[dim + "建议"];
      const cls = level === "高" ? "high" : level === "低" ? "low" : "mid";
      labels.push(dim);
      scores.push(t);
      html.push(`<li><span class="${cls}">${dim}：${level}</span>（T=${t}）<br>${suggestion}</li>`);
    }
  }
  output.innerHTML = `<ul>${html.join('')}</ul>`;

  if (chart) chart.destroy();
  const ctx = document.getElementById("radarChart").getContext("2d");
  chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'T分数',
        data: scores,
        fill: true,
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        pointBackgroundColor: 'blue'
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          min: 40,
          max: 100,
          ticks: { stepSize: 10 }
        }
      }
    }
  });
}
