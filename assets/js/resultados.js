let chart1 = null;
let chart2 = null;

// =========================
// FORMATADOR KZ
// =========================
function formatKz(valor){
    return Number(valor).toLocaleString("pt-PT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// =========================
// KPI STYLE
// =========================
function setKPI(id, value, type){

    let el = document.getElementById(id);
    el.innerText = value;

    let card = el.parentElement;

    card.classList.remove("positive","negative","neutral");

    if(type === "good"){
        card.classList.add("positive");
    } else if(type === "bad"){
        card.classList.add("negative");
    } else {
        card.classList.add("neutral");
    }
}

// =========================
// DESTROY SAFE
// =========================
function destroyCharts(){
    if(chart1) chart1.destroy();
    if(chart2) chart2.destroy();
}

// =========================
// MAIN
// =========================
function mostrar(){

    // =========================
    // GET LOCAL STORAGE
    // =========================
    let vpl = Number(localStorage.getItem("vpl") || 0);
    let roi = Number(localStorage.getItem("roi") || 0);
    let tir = Number(localStorage.getItem("tir") || 0);
    let payback = Number(localStorage.getItem("payback") || 0);

    let fluxos = JSON.parse(localStorage.getItem("fluxos") || "[]");
    let taxa = Number(localStorage.getItem("taxa") || 0);

    // =========================
    // KPIs
    // =========================
    setKPI("vpl", "Kz " + formatKz(vpl), vpl > 0 ? "good" : "bad");
    setKPI("roi", roi.toFixed(2) + "%", roi > 0 ? "good" : "bad");
    setKPI("tir", tir.toFixed(2) + "%", tir > 0 ? "good" : "bad");

    if(payback && !isNaN(payback)){
        let a = Math.floor(payback);
        let m = Math.round((payback - a) * 12);

        setKPI(
            "payback",
            `${a} anos e ${m} meses`,
            payback <= 3 ? "good" : "bad"
        );
    } else {
        setKPI("payback", "Não atingido", "bad");
    }

 // =========================
// CONCLUSÃO "INTELIGENTE" (GENESIS STYLE LIGHT)
// =========================

let conclusoes = {
    excelente: [
        "✔ Projeto altamente viável. Forte geração de valor e baixo risco financeiro.",
        "✔ Estrutura financeira sólida. Indicadores demonstram excelente performance.",
        "✔ Investimento com forte potencial de retorno e consistência económica."
    ],

    bom: [
        "✔ Projeto viável com bons indicadores financeiros.",
        "✔ Retorno positivo, mas com margem de risco moderada.",
        "✔ Investimento aceitável com desempenho satisfatório."
    ],

    neutro: [
        "⚠ Projeto no limite de viabilidade. Requer atenção nos parâmetros.",
        "⚠ Indicadores equilibrados, mas sem grande margem de segurança.",
        "⚠ Viabilidade incerta dependendo do cenário económico."
    ],

    ruim: [
        "❌ Projeto financeiramente não recomendado.",
        "❌ Indicadores abaixo do esperado, risco elevado.",
        "❌ O investimento não demonstra viabilidade económica consistente."
    ]
};

// =========================
// SCORE SIMPLES DE QUALIDADE
// =========================
let scoreFinal = 0;

if(vpl > 0) scoreFinal += 40;
if(roi > 0) scoreFinal += 30;
if(tir > 0) scoreFinal += 30;

// =========================
// CLASSIFICAÇÃO
// =========================
let tipo = "ruim";

if(scoreFinal >= 90) tipo = "excelente";
else if(scoreFinal >= 70) tipo = "bom";
else if(scoreFinal >= 40) tipo = "neutro";

// =========================
// ESCOLHA FINAL
// =========================
let conclusao = conclusoes[tipo][Math.floor(Math.random() * conclusoes[tipo].length)];

    document.getElementById("conclusao").innerText = conclusao;

    // =========================
    // ACUMULADO
    // =========================
    let acumulado = [];
    let total = 0;

    fluxos.forEach(f => {
        total += f;
        acumulado.push(total);
    });

    // =========================
    // DESTROY OLD CHARTS
    // =========================
    destroyCharts();

    // =========================
    // GRÁFICO 1 - FLUXO
    // =========================
    const ctx1 = document.getElementById("c1").getContext("2d");

    chart1 = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: fluxos.map((_, i) => `Ano ${i + 1}`),
            datasets: [{
                label: "Fluxo de Caixa",
                data: fluxos,
                backgroundColor: fluxos.map(v =>
                    v >= 0 ? "rgba(34,197,94,0.85)" : "rgba(239,68,68,0.85)"
                ),
                borderRadius: 10,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1600,
                easing: "easeOutQuart"
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#0b1220",
                    titleColor: "#93c5fd",
                    bodyColor: "#fff",
                    borderColor: "#2563eb",
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context){
                            return "Kz " + Number(context.raw).toLocaleString("pt-PT", {
                                minimumFractionDigits: 2
                            });
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: "#cbd5e1" }
                },
                y: {
                    grid: { color: "rgba(255,255,255,0.05)" },
                    ticks: { color: "#cbd5e1" }
                }
            }
        }
    });

    // =========================
    // GRÁFICO 2 - ACUMULADO
    // =========================
    const ctx2 = document.getElementById("c2").getContext("2d");

    chart2 = new Chart(ctx2, {
        type: "line",
        data: {
            labels: fluxos.map((_, i) => `Ano ${i + 1}`),
            datasets: [{
                label: "Fluxo Acumulado",
                data: acumulado,
                borderColor: "#22c55e",
                backgroundColor: "rgba(34,197,94,0.15)",
                fill: true,
                tension: 0.45,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1600,
                easing: "easeOutQuart"
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#0b1220",
                    titleColor: "#93c5fd",
                    bodyColor: "#fff",
                    borderColor: "#22c55e",
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context){
                            return "Kz " + Number(context.raw).toLocaleString("pt-PT", {
                                minimumFractionDigits: 2
                            });
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: "#cbd5e1" }
                },
                y: {
                    grid: { color: "rgba(255,255,255,0.05)" },
                    ticks: { color: "#cbd5e1" }
                }
            }
        }
    });
}
