import {postToServer, toSQL, alertDatabaseError, sanitize, replaceUndefined} from "../shared.js";

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
        const textName = document.getElementById("text-name").value;
        const textAddress = document.getElementById("text-address").value;
        const textCity = document.getElementById("text-city").value;
        const textStateProvince = document.getElementById("text-state-province").value;
        const textPostalCode = document.getElementById("text-postal-code").value;
        const textCountry = document.getElementById("text-country").value;
        const textURL = document.getElementById("text-url").value;
        if (type == "museum" || type == "art gallery") {
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
            var query = "INSERT INTO Gallery (name) VALUES (" +
                        "'" + sanitize(textName) + "'" + ");";
            var args = [];
            if (type == "museum" || type == "art-gallery") {
                args = [type, textAddress, textCity, textStateProvince, textPostalCode, textCountry]
            } else if (type == "virtual-art-gallery") {
                args = [type, textURL];
            }            

            alert(query);
            postToServer(toSQL(query), addGalleryToSubclassTable, alertDatabaseError, args);
        }

      });
}

function addGalleryToSubclassTable(response, args) {
    if (args.length == 0)
        return;
    
    var query = "INSERT INTO " + args[0] + " VALUES ("
    for (var i = 1; i < args.length; i++) {
        if (i == args.length - 1) {
            query += "'" + sanitize(args[i]) + "'";
        } else {
            query += "'" + sanitize(args[i]) + "'" + ", ";
        }
    }

    query += ");";
    alert(query);
    postToServer(toSQL(query), undefined, alertDatabaseError);
}

$(function() {
    document.getElementById("div-physical-group").style.display = "block";
    document.getElementById("div-virtual-group").style.display = "none";
    setupRadioType();
    setupForm();
});