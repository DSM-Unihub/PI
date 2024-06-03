
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