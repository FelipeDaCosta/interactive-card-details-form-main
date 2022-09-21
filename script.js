class formElement {
    constructor(elementId, regexValidation, errorElementId, errorMsg, previewElementId, defaultValue, inputEvent=null) {
        this.element = document.getElementById(elementId);
        this.errorElement = document.getElementById(errorElementId);
        this.errorMsg = errorMsg;
        this.previewElement = document.getElementById(previewElementId);
        this.defaultValue = defaultValue;
        this.regexValidation = regexValidation;

        this.element.addEventListener('input', (event) => {
            let previewContent = this.element.value == "" ? this.defaultValue : this.element.value;
            if(inputEvent != null) {
                previewContent = inputEvent(event, defaultValue=this.defaultValue);
            }
            this.previewElement.textContent = previewContent;
        });
    }

    validate() {
        if(!this.regexValidation.test(this.element.value)) {
            this.element.classList.add("invalid-fill");
            this.errorElement.innerText = this.element.value == "" ? "Can't be blank" : this.errorMsg;
            this.errorElement.classList.remove("hidden");
            return false;
        } else {
            this.errorElement.classList.add("hidden");
            this.element.classList.remove("invalid-fill")
        }
        return true;
    }

    setDefaultPreview() {
        this.previewElement.textContent = this.defaultValue;
    }
}

const formElements = [
    new formElement("fname", /^[A-Za-z\. ]+$/, "fname-error", "Wrong format, letters only", 
                    "cardholder-name", "Jane Appleseed"),

    new formElement("fnumber", /^[\d]{4}\s?[\d]{4}\s?[\d]{4}\s?[\d]{4}$/, "fnumber-error", 
                    "Wrong format, 12 numbers only", "card-number", "0000 0000 0000 0000", (event, defaultValue) => {
                        let spacedCardNumber = "";
                        if(event.target.value) {
                            spacedCardNumber = event.target.value.match(/[^ ]{1,4}/g).join(' ');
                        } 
                        event.target.value = spacedCardNumber;
                        return spacedCardNumber == "" ? defaultValue : spacedCardNumber;
                    }),
    
    new formElement("fexpdatemm", /^[\d]{2}$/, "fexpdatemmyy-error", "Wrong format, 2 numbers only", "exp-month", "00"),

    new formElement("fexpdateyy", /^[\d]{2}$/, "fexpdatemmyy-error", "Wrong format, 2 numbers only", "exp-year", "00"),

    new formElement("fcvc", /^[\d]{3}$/, "fcvc-error", "Wrong format, 3 numbers only", "card-back-cvc", "000")
]

const submitButton = document.getElementById("submit-button");
const divCardForm = document.getElementById("card-form");
const thankYou = document.getElementById("thank-you");
const continueButton = document.getElementById("continue-button");
const cardForm = document.getElementById("input-form-element");

submitButton.addEventListener('click', (event) => {
    let formValidation = true;
    formElements.forEach((element) => {
        if(!element.validate()) {
            formValidation = false;
        }
    })
    if(formValidation) {
        divCardForm.classList.add("hidden");
        thankYou.classList.remove("hidden");
    }
})

continueButton.addEventListener('click', (event) => {
    cardForm.reset();
    formElements.forEach((element) => {
        element.setDefaultPreview();
    })
    divCardForm.classList.remove("hidden");
    thankYou.classList.add("hidden");
})