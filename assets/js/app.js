// ===============================
// UTILITÁRIOS
// ===============================

function getNumber(v){
    if(!v) return 0;

    return parseFloat(
        String(v)
        .replace(/\s/g,'')
        .replace(',', '.')
    ) || 0;
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

// ===============================
// HISTÓRICO
// ===============================

function salvar(analise){
    let h = JSON.parse(localStorage.getItem("analises")) || [];
    h.push(analise);
    localStorage.setItem("analises", JSON.stringify(h));
}

// ===============================
// TIR (CORRETA - MÉTODO BISEÇÃO)
// ===============================

function calcularTIR(investimento, fluxos){

    let min = -0.99;
    let max = 10;
    let tir = 0;

    for(let i = 0; i < 200; i++){

        let taxa = (min + max) / 2;

        let vpl = -investimento;

        for(let j = 0; j < fluxos.length; j++){
            vpl += fluxos[j] / Math.pow(1 + taxa, j + 1);
        }

        if(Math.abs(vpl) < 0.01){
            tir = taxa;
            break;
        }

        if(vpl > 0){
            min = taxa;
        } else {
            max = taxa;
        }

        tir = taxa;
    }

    return tir * 100;
}

// ===============================
// FORM SUBMIT
// ===============================

document.getElementById("investmentForm").addEventListener("submit",function(e){

    e.preventDefault();

    let empresa = document.getElementById("empresa").value;
    let nif = document.getElementById("nif").value;

    let inv = getNumber(document.getElementById("investimento").value);
    let taxa = getNumber(document.getElementById("taxa").value) / 100;

    let fluxos = getFluxos();

    // ===============================
    // VPL (CORRETO)
    // ===============================

    let vpl = -inv;

    fluxos.forEach((f,i)=>{
        vpl += f / Math.pow(1 + taxa, i + 1);
    });

    // ===============================
    // ROI (OK - mantido)
    // ===============================

    let soma = fluxos.reduce((a,b)=>a+b,0);
    let roi = ((soma - inv) / inv) * 100;

    // ===============================
    // TIR (CORRIGIDO)
    // ===============================

    let tir = calcularTIR(inv, fluxos);

    // ===============================
    // PAYBACK (FRACIONADO)
    // ===============================

    let acumulado = -inv;
    let payback = null;

    for(let i = 0; i < fluxos.length; i++){

        let anterior = acumulado;

        acumulado += fluxos[i];

        if(acumulado >= 0){

            let faltava = Math.abs(anterior);

            payback =
                i +
                (faltava / fluxos[i]);

            break;
        }
    }

    // ===============================
    // OBJETO FINAL
    // ===============================

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
        data: new Date().toLocaleDateString()
    };

    salvar(analise);

    // ===============================
    // LOCALSTORAGE PARA RESULTADOS
    // ===============================

    localStorage.setItem("vpl", vpl);
    localStorage.setItem("roi", roi);
    localStorage.setItem("tir", tir);
    localStorage.setItem("payback", payback);
    localStorage.setItem("fluxos", JSON.stringify(fluxos));
    localStorage.setItem("empresa", empresa);
    localStorage.setItem("nif", nif);

    // ===============================
    // REDIRECIONA
    // ===============================

    window.location.href = "results.html";
});
