
// =========================
// FORMATADOR KZ
// =========================
function formatKz(valor){
    return valor.toLocaleString("pt-PT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// =========================
// KPI BANK STYLE
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
// MOSTRAR RESULTADOS
// =========================
function mostrar(){

    let vpl = Number(localStorage.getItem("vpl") || 0);
    let roi = Number(localStorage.getItem("roi") || 0);
    let tir = Number(localStorage.getItem("tir") || 0);
    let payback = localStorage.getItem("payback");

    let fluxos = JSON.parse(localStorage.getItem("fluxos") || "[]");

    // =========================
    // VPL
    // =========================
    setKPI(
        "vpl",
        "Kz " + formatKz(vpl),
        vpl > 0 ? "good" : "bad"
    );

    // =========================
    // ROI
    // =========================
    setKPI(
        "roi",
        roi.toFixed(2) + " %",
        roi > 0 ? "good" : "bad"
    );

    // =========================
    // TIR
    // =========================
    setKPI(
        "tir",
        tir.toFixed(2) + " %",
        tir > 0 ? "good" : "bad"
    );

    // =========================
    // PAYBACK
    // =========================
    if(payback && !isNaN(payback)){

        let anos = Math.floor(payback);
        let meses = Math.round((payback - anos) * 12);

        let txt = `${anos} anos e ${meses} meses`;

        setKPI(
            "payback",
            txt,
            payback <= 3 ? "good" : "bad"
        );

    } else {
        setKPI("payback","Não atingido","bad");
    }

    // =========================
    // CONCLUSÃO
    // =========================
    let conclusao = "❌ Projeto NÃO viável.";

    if(vpl > 0 && roi > 0 && tir > 0){
        conclusao = "✔ Projeto VIÁVEL economicamente.";
    }

    document.getElementById("conclusao").innerText = conclusao;

    // =========================
    // GRÁFICO FLUXO
    // =========================
    new Chart(document.getElementById("c1"), {
        type: "bar",
        data: {
            labels: fluxos.map((_,i)=>`Ano ${i+1}`),
            datasets: [{
                label: "Fluxo de Caixa",
                data: fluxos,
                backgroundColor: "#3b82f6"
            }]
        }
    });

    // =========================
    // GRÁFICO ACUMULADO
    // =========================
    let acumulado = 0;
    let acc = [];

    for(let f of fluxos){
        acumulado += f;
        acc.push(acumulado);
    }

    new Chart(document.getElementById("c2"), {
        type: "line",
        data: {
            labels: fluxos.map((_,i)=>`Ano ${i+1}`),
            datasets: [{
                label: "Fluxo Acumulado",
                data: acc,
                borderColor: "#22c55e",
                fill: false,
                tension: 0.3
            }]
        }
    });
}
