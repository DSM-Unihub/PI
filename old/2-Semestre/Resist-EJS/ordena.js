function ordenacaoLexicograficaRecursiva(arr) {
    if (arr.length <= 1) {
        return arr;
    } else {
        const pivot = arr[0];
        const menores = [];
        const iguais = [];
        const maiores = [];

        for (let str of arr) {
            if (str < pivot) {
                menores.push(str);
            } else if (str === pivot) {
                iguais.push(str);
            } else {
                maiores.push(str);
            }
        }

        return ordenacaoLexicograficaRecursiva(menores).concat(iguais, ordenacaoLexicograficaRecursiva(maiores));
    }
}

let array = ["12.34.56.78",
"192.168.1.1",
"10.0.0.1",
"172.16.254.1",
"8.8.8.8",
"255.255.255.255",
"123.45.67.89",
"172.217.3.110",
"192.0.2.1",
"198.51.100.42"];
let arrayOrdenado = ordenacaoLexicograficaRecursiva(array);
console.log("Array ordenado lexicograficamente:", arrayOrdenado);