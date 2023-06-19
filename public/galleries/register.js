import {postToServer, toSQL, sanitize} from "/public/shared.js";

var physical = true;

function radioTypeSelected(e) {
    console.log(e);
    if (this.checked) {
        console.log(this.id);
        if (this.id == 'radio-type-museum' || this.id == 'radio-type-art-gallery') {
            physical = true;
            document.getElementById("div-physical-group").style.display = "block";
            document.getElementById("div-virtual-group").style.display = "none";
        } else {
            physical = false;
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
        if (physical) {
            if (validator.isAlphanumeric(document.getElementById("text-name").value, undefined, {ignore:" -"}) &&
            validator.isAlphanumeric(document.getElementById("text-address").value, undefined, {ignore:" -"}) &&
            validator.isAlphanumeric(document.getElementById("text-city").value, undefined, {ignore:" -"}) &&
            validator.isAlphanumeric(document.getElementById("text-state-province").value, undefined, {ignore:" -"}) &&
            validator.isAlphanumeric(document.getElementById("text-postal-code").value, undefined, {ignore:" -"}) &&
            validator.isAlphanumeric(document.getElementById("text-country").value, undefined, {ignore:" -"})) {
                validInput = true;
                alert("Input is valid.");
            } else {
                alert("Input is invalid.");
            }
        } else {
            if (validator.isAlphanumeric(document.getElementById("text-name").value, undefined, {ignore:" -"}) &&
            validator.isURL(document.getElementById("text-url").value)) {
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