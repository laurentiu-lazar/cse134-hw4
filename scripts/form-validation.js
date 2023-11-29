const form_errors = [];

window.addEventListener('DOMContentLoaded', function(){
    let submit = this.document.getElementById("submit-button");
    let form = document.forms[0];
    let inputs = document.querySelectorAll("form input, form textarea");
    let message = document.querySelector("#message");
    let errorInput = document.getElementById('errors');

    form.noValidate=true;

    for(let field of inputs)
        field.addEventListener("input", function(e){e.target.setCustomValidity('');})

    function updateErrors(fieldName, validity){
        for(let key in validity)
            if(validity[key])
                form_errors.push({field: fieldName, error:key});
    }

    function checkAndSubmit(e){
        for(let field of inputs) field.setCustomValidity('');
        
        if(form.checkValidity()){
            
            if(!/^[\w!?.\/\-\s]{1,500}$/.test(message.value)){
                e.preventDefault();
                e.stopImmediatePropagation();
                message.setCustomValidity("Please only use allowed characters");
                message.reportValidity();
                updateErrors('message', message.validity);
                return;
            }

            errorInput.value = JSON.stringify(form_errors);
        } else {

            e.preventDefault();
            e.stopImmediatePropagation();

            let reported=false;

            for(let field of inputs){
                if(field.checkValidity()) continue;
                updateErrors(field.name, field.validity);

                if(field.validity.tooShort)
                    field.setCustomValidity(`Min length is ${field.minLength}. You're using ${field.value.length} characters.`)
                else if(field.validity.tooLong)
                    field.setCustomValidity(`Max length is ${field.maxLength}. You're using ${field.value.length} characters.`)
                else if(field.validity.typeMismatch)
                    field.setCustomValidity("Please use proper format");
                else if(field.validity.patternMismatch)
                    field.setCustomValidity("Please only use allowed characters");

                if(!reported){
                    field.reportValidity();
                    reported=true;
                }
            }
        }
    }

    form.addEventListener('submit', checkAndSubmit);
    
    
    function filterAndReport(inputElement, errorOutput, pattern){
        let illegalCharacters = inputElement.value.match(pattern);
        if(illegalCharacters === null)
            return;
        inputElement.style.border = "5px solid red";
        setTimeout(() => {inputElement.style.border = "none"}, 250);

        for(let character of illegalCharacters){
            let el = document.createElement('p');
            el.innerText = `Illegal character: ${character}`;
            errorOutput.appendChild(el);
            el.className='visible';
            setTimeout(() => { el.className='hidden'; }, 1);
            setTimeout(() => { el.remove(); }, 1000);
        }

        inputElement.value = inputElement.value.replace(pattern, "");
        console.log(inputElement.value);
    }

    let messageOutput = document.querySelector("#message ~ output.error-message");
    message.addEventListener("input", (e) => (filterAndReport(message, messageOutput, /[^\w!?.\/\-\s]/g)));

    let name = document.querySelector("#name");
    let nameOutput = document.querySelector("#name ~ output.error-message");
    name.addEventListener("input", (e) => (filterAndReport(name, nameOutput, /[^a-zA-Z\s]/g)));

    let characterCount = document.createElement('span');
    characterCount.innerText=`0/${message.maxLength}`;
    document.getElementById('message-labels').appendChild(characterCount);

    function updateCounter(){
        characterCount.innerText=`${message.value.length}/${message.maxLength}`;

        if(message.value.length >= message.maxLength)
            characterCount.className='count-error';
        else if(message.value.length >= message.maxLength*3/4)
            characterCount.className='count-warning';
        else
            characterCount.className='count-info';
    }

    message.addEventListener('input', updateCounter);
});