
function setupInputFocusTransfer(firstInputId, secondInputId) {
    const firstInput = document.getElementById(firstInputId);
    const secondInput = document.getElementById(secondInputId);
    firstInput.addEventListener('input', function() {
        if (this.value.length === this.maxLength) {
            secondInput.focus();
        }
    });
}

document.addEventListener('DOMContentLoaded', function(){
    setupInputFocusTransfer('tel-ddd', 'tel-number')
    setupInputFocusTransfer('cel-ddd', 'cel-number')
    setupInputFocusTransfer('user-cel-ddd', 'user-cel-number');
    const form = document.getElementById('multiPageForm')
    const pages = document.querySelectorAll('.form-page')
    let currentPage = 0

    function showPage(pageIndex){
        pages.forEach((page, index)=>{
            page.style.display = index === pageIndex ? 'block' : 'none'
        })

     // Adjust button behavior based on current page
    const backButton = document.getElementById('btn-back');
    const nextButton = document.getElementById('btn-next');

    if (currentPage === 0) {
        backButton.onclick = function() {
            window.location.href = '/';
        };
    } else {
        backButton.onclick = function() {
            previousPage();
        };
    }

    if (currentPage === pages.length - 1) {
        nextButton.textContent = 'Send';
        nextButton.onclick = function() {
            form.submit(); // Submit the form
        };
    } else {
        nextButton.textContent = 'Próximo';
        nextButton.onclick = function() {
            nextPage();
        };
    }
}

    window.nextPage = function(){
        if(currentPage  < pages.length -1){
            currentPage++
            showPage(currentPage)
        }
    }

    window.previousPage = function(){
        if (currentPage > 0){
            currentPage --
            showPage(currentPage)
        }
        
    }

   
    showPage(currentPage)
})

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

function ordenarURLs() {
    const rows = Array.from(document.querySelectorAll('.bloqueio-row'));
    const urls = rows.map(row => ({
        element: row,
        url: row.querySelector('.url').textContent.trim()
    }));

    const urlsOrdenadas = ordenacaoLexicograficaRecursiva(urls.map(entry => entry.url));

    const sortedRows = urlsOrdenadas.map(url => urls.find(entry => entry.url === url).element);

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    sortedRows.forEach(row => tbody.appendChild(row));
}