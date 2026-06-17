
function mostrar(){

let vpl = Number(localStorage.getItem("vpl")||0);
let roi = Number(localStorage.getItem("roi")||0);
let tir = Number(localStorage.getItem("tir")||0);
let payback = Number(localStorage.getItem("payback"));

let fluxos = JSON.parse(localStorage.getItem("fluxos")||"[]");

// 📊 formato
document.getElementById("vpl").innerText =
"Kz " + vpl.toLocaleString("pt-PT",{minimumFractionDigits:2});

document.getElementById("roi").innerText = roi.toFixed(2)+"%";
document.getElementById("tir").innerText = tir.toFixed(2)+"%";

// ⏱ payback
if(payback !== null && !isNaN(payback)){
    let anos = Math.floor(payback);
    let meses = Math.round((payback-anos)*12);

    document.getElementById("payback").innerText =
    `${anos} anos e ${meses} meses`;
}else{
    document.getElementById("payback").innerText = "Não atingido";
}

// 🧠 conclusão simples
document.getElementById("conclusao").innerText =
vpl > 0 ? "Projeto viável economicamente." : "Projeto não viável.";

// 📊 ANO (labels reais)
let anos = fluxos.map((_,i)=>"Ano "+(i+1));

// 📈 GRÁFICO 1 — FLUXOS REAIS
new Chart(document.getElementById("c1"),{
type:"bar",
data:{
labels:anos,
datasets:[{
label:"Fluxos de Caixa",
data:fluxos,
backgroundColor:"#3b82f6"
}]
},
options:{
responsive:true
}
});

// 📉 GRÁFICO 2 — ACUMULADO (PAYBACK VISUAL)
let acumulado = 0;
let acumulados = [];

for(let f of fluxos){
    acumulado += f;
    acumulados.push(acumulado);
}

new Chart(document.getElementById("c2"),{
type:"line",
data:{
labels:anos,
datasets:[{
label:"Fluxo Acumulado",
data:acumulados,
borderColor:"#22c55e",
fill:false,
tension:0.3
}]
},
options:{
responsive:true
}
});

}

window.onload = mostrar;