import {postToServer, toSQL, sanitize} from "/public/shared.js";

var type = "museum";

function radioTypeSelected(e) {
    console.log(e);
    if (this.checked) {
        console.log(this.id);
        if (this.id == 'radio-type-museum') {
            type = "museum";
            document.getElementById("div-physical-group").style.display = "block";
            document.getElementById("div-virtual-group").style.display = "none";
        } else if (this.id == 'radio-type-art-gallery') {
            type = "art-gallery"
            document.getElementById("div-physical-group").style.display = "block";
            document.getElementById("div-virtual-group").style.display = "none";
        } else {
            type = "virtual-art-gallery"
            document.getElementById("div-physical-group").style.display = "none";
            document.getElementById("div-virtual-group").style.display = "block";
        }
    }
}

function setupRadioType() {
    const radioButtons = document.querySelectorAll('input[name="radio-type"]');
    for(const radioButton of radioButtons){
        radioButton.addEventListener('change', radioTypeSelected);
    }   
}

function setupForm() {
    var registerForm = document.getElementById("form-register-a-gallery");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        var validInput = false;
        // TO DO: validate inputs
        const textName = document.getElementById("text-name").value;
        if (type == "museum" || type == "art gallery") {
            const textAddress = document.getElementById("text-address").value;
            const textCity = document.getElementById("text-city").value;
            const textStateProvince = document.getElementById("text-state-province").value;
            const textPostalCode = document.getElementById("text-postal-code").value;
            const textCountry = document.getElementById("text-country").value;
            if (
                validator.isAlphanumeric(textName, undefined, {ignore:" -"}) && validator.isLength(textName, { min: 0, max: 255 }) &&
                ((validator.isAlphanumeric(textAddress, undefined, {ignore:" -"}) && validator.isLength(textAddress, { min: 0, max: 255 })) || validator.isEmpty(textAddress)) &&
                ((validator.isAlphanumeric(textCity, undefined, {ignore:" -"}) && validator.isLength(textCity, { min: 0, max: 255 })) || validator.isEmpty(textCity)) &&
                ((validator.isAlphanumeric(textStateProvince, undefined, {ignore:" -"}) && validator.isLength(textStateProvince, { min: 0, max: 255 })) || validator.isEmpty(textStateProvince)) &&
                ((validator.isAlphanumeric(textPostalCode, undefined, {ignore:" -"}) && validator.isLength(textPostalCode, { min: 0, max: 255 })) || validator.isEmpty(textPostalCode)) &&
                ((validator.isAlphanumeric(textCountry, undefined, {ignore:" -"}) && validator.isLength(textCountry, { min: 0, max: 255 })) || validator.isEmpty(textCountry))
                ) {
                validInput = true;
                alert("Input is valid.");
            } else {
                alert("Input is invalid.");
            }
        } else if (type == "virtual-art-gallery") {
            const textURL = document.getElementById("text-url").value;
            if (
                validator.isAlphanumeric(textName, undefined, {ignore:" -"}) && validator.isLength(textName, { min: 0, max: 255 }) &&
                ((validator.isAlphanumeric(textURL, undefined, {ignore:" -"}) && validator.isLength(textURL, { min: 0, max: 255 })) || validator.isEmpty(textURL))
                ) {
                validInput = true;
                alert("Input is valid.");
            } else {
                alert("Input is invalid.");
            }
        }

        if (validInput) {
            // TO DO: convert form inputs to SQL query
            
        }

      });
}

$(function() {
    document.getElementById("div-physical-group").style.display = "block";
    document.getElementById("div-virtual-group").style.display = "none";
    setupRadioType();
    setupForm();
});