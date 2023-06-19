import {postToServer, toSQL} from "/public/shared.js";

function radioTypeSelected(e) {
    console.log(e);
    if (this.checked) {
        console.log(this.id);
        if (this.id == 'radio-type-museum' || this.id == 'radio-type-art-gallery') {
            document.getElementById("div-physical-group").style.display = "block";
            document.getElementById("div-virtual-group").style.display = "none";
        } else {
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
        
        // TO DO: handle form submit
      });
}

$(function() {
    document.getElementById("div-physical-group").style.display = "block";
    document.getElementById("div-virtual-group").style.display = "none";
    setupRadioType();
    setupForm();
});