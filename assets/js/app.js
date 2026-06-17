
function getNumber(v){
    if(!v) return 0;
    return parseFloat(String(v).replace(",",".").replace(/\./g,'')) || 0;
}

function getFluxos(){
    let inputs = document.querySelectorAll(".fluxo");
    let arr = [];

    inputs.forEach(i=>{
        let v = getNumber(i.value);
        if(!isNaN(v)) arr.push(v);
    });

    return arr;
}

function salvar(analise){
    let h = JSON.parse(localStorage.getItem("analises")) || [];
    h.push(analise);
    localStorage.setItem("analises",JSON.stringify(h));
}

document.getElementById("investmentForm").addEventListener("submit",function(e){

    e.preventDefault();

    let empresa = document.getElementById("empresa").value;
    let nif = document.getElementById("nif").value;

    let inv = getNumber(document.getElementById("investimento").value);
    let taxa = getNumber(document.getElementById("taxa").value)/100;

    let fluxos = getFluxos();

    let vpl = 0;

    fluxos.forEach((f,i)=>{
        vpl += f/Math.pow((1+taxa),i+1);
    });

    vpl -= inv;

    let soma = fluxos.reduce((a,b)=>a+b,0);

    let roi = ((soma-inv)/inv)*100;

    let tir = taxa*100;

    let acc = -inv;
    let payback = null;

    for(let i=0;i<fluxos.length;i++){
        acc += fluxos[i];
        if(acc>=0){
            payback = i+1;
            break;
        }
    }

    let analise = {
        empresa,
        nif,
        inv,
        taxa,
        fluxos,
        vpl,
        roi,
        tir,
        payback,
        data:new Date().toLocaleDateString()
    };

    salvar(analise);

    localStorage.setItem("vpl",vpl);
    localStorage.setItem("roi",roi);
    localStorage.setItem("tir",tir);
    localStorage.setItem("payback",payback);
    localStorage.setItem("fluxos",JSON.stringify(fluxos));
    localStorage.setItem("empresa",empresa);
    localStorage.setItem("nif",nif);

    window.location.href="results.html";
});