if(localStorage.getItem('userTheme') === 'dark'){ //to prevent initial style switch flash as much as possible, redundant
    document.documentElement.setAttribute('data-theme', 'dark');
}

function updateTheme(){
    let switchLabel = document.querySelector('#toggle-switch span');
    let theme = localStorage.getItem('userTheme');
    // alert(1);

    if(theme == 'dark'){
        switchLabel.innerText='🌑';
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    else{
        switchLabel.innerText='☀️';
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

document.addEventListener('DOMContentLoaded', function(){
    let checkBox = document.querySelector('#toggle-switch input');

    if(localStorage.getItem('userTheme') === null){ //initialise theme
        // alert(2);
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
            localStorage.setItem('userTheme', 'dark');
        } else {
            localStorage.setItem('userTheme', 'light');
        }
    }
    if(localStorage.getItem('userTheme') == 'dark')checkBox.checked = true;
    else checkBox.checked = false;

    checkBox.addEventListener('change', function(){
        if(checkBox.checked){
            localStorage.setItem('userTheme', 'dark');
        } else {
            localStorage.setItem('userTheme', 'light');
        }
        // console.log(localStorage.getItem('userTheme'));
        updateTheme();
    });
    updateTheme();
});