
function calcularVPL(investimento, fluxos, taxa) {
    let vpl = 0;

    for (let t = 0; t < fluxos.length; t++) {
        vpl += fluxos[t] / Math.pow(1 + taxa, t + 1);
    }

    return vpl - investimento;
}

function calcularROI(investimento, fluxos) {
    let receita = fluxos.reduce((a, b) => a + b, 0);
    let lucro = receita - investimento;

    return (lucro / investimento) * 100;
}

function calcularPayback(investimento, fluxos) {

    let acumulado = 0;

    for (let i = 0; i < fluxos.length; i++) {

        let acumuladoAnterior = acumulado;

        acumulado += fluxos[i];

        if (acumulado >= investimento) {

            let faltaRecuperar = investimento - acumuladoAnterior;

            let fracaoPeriodo = faltaRecuperar / fluxos[i];

            let payback = i + fracaoPeriodo;

            return Number(payback.toFixed(2));
        }
    }

    return null;
}

function calcularTIR(investimento, fluxos) {
    let taxa = 0.01;

    for (let i = 0; i < 1000; i++) {
        let vpl = -investimento;

        for (let t = 0; t < fluxos.length; t++) {
            vpl += fluxos[t] / Math.pow(1 + taxa, t + 1);
        }

        if (Math.abs(vpl) < 1) break;

        if (vpl > 0) taxa += 0.001;
        else taxa -= 0.001;
    }

    return taxa * 100;
}