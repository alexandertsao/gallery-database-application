import {postToServer, toSQL, alertDatabaseError, sanitize} from "/public/shared.js";

function setupForm() {
    var registerForm = document.getElementById("form-view-galleries");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        var validInput = false;
        const textQuery = document.getElementById("text-query").value;
        const checkboxFilterMuseum = document.getElementById("checkbox-filter-museum").checked;
        const checkboxFilterArtGallery = document.getElementById("checkbox-filter-art-gallery").checked;
        const checkboxFilterVirtualArtGallery = document.getElementById("checkbox-filter-virtual-art-gallery").checked;
        // const checkboxDisplayType = document.getElementById("checkbox-display-type").checked;
        // const checkboxDisplayId = document.getElementById("checkbox-display-id").checked;
        // const checkboxDisplayName = document.getElementById("checkbox-display-name").checked;
        const checkboxDisplayAddress = document.getElementById("checkbox-display-address").checked;
        const checkboxDisplayCity = document.getElementById("checkbox-display-city").checked;
        const checkboxDisplayStateProvince = document.getElementById("checkbox-display-state-province").checked;
        const checkboxDisplayPostalCode = document.getElementById("checkbox-display-postal-code").checked;
        const checkboxDisplayCountry = document.getElementById("checkbox-display-country").checked;
        const checkboxDisplayUrl = document.getElementById("checkbox-display-url").checked;
        if (
            (validator.isAlphanumeric(textQuery, undefined, {ignore:" -"}) && validator.isLength(textQuery, { min: 0, max: 255 })) || validator.isEmpty(textQuery)
            ) {
            validInput = true;
            alert("Input is valid.");
        } else {
            alert("Input is invalid.");
        }

        if (validInput) {
            var query = "";
            if (checkboxFilterMuseum) {
                query += "SELECT gallery_id, name";
                if (checkboxDisplayAddress) query += ", address";
                if (checkboxDisplayCity) query += ", city";
                if (checkboxDisplayStateProvince) query += ", state_province";
                if (checkboxDisplayPostalCode) query += ", postal_code";
                if (checkboxDisplayCountry) query += ", country";
                query += " " +
                         "FROM Gallery, Museum " +
                         "WHERE gallery_id LIKE " +
                         "&#39;%" + textQuery + "%&#39; " +
                         "OR name LIKE " +
                         "&#39;%" + textQuery + "%&#39;";
            }
            if (checkboxFilterArtGallery) {
                if (checkboxFilterMuseum) query += " UNION ";
                query += "SELECT gallery_id, name";
                if (checkboxDisplayAddress) query += ", address";
                if (checkboxDisplayCity) query += ", city";
                if (checkboxDisplayStateProvince) query += ", state_province";
                if (checkboxDisplayPostalCode) query += ", postal_code";
                if (checkboxDisplayCountry) query += ", country";
                query += " " +
                         "FROM Gallery, Art_Gallery " +
                         "WHERE gallery_id LIKE " +
                         "&#39;%" + textQuery + "%&#39; " +
                         "OR name LIKE " +
                         "&#39;%" + textQuery + "%&#39;";
            }
            if (checkboxFilterVirtualArtGallery) {
                if (checkboxFilterMuseum || checkboxFilterArtGallery) query += " UNION ";
                query += "SELECT gallery_id, name";
                if (checkboxDisplayUrl) query += ", url";
                query += " " +
                         "FROM Gallery, Virtual_Art_Gallery " +
                         "WHERE gallery_id LIKE " +
                         "&#39;%" + textQuery + "%&#39; " +
                         "OR name LIKE " +
                         "&#39;%" + textQuery + "%&#39;";
            }
            query += ";";     
            postToServer(toSQL(query), loadTable);
        }

      });
}

function loadTable(response) {
    var tableHTML = "";
    document.getElementById("tbody-galleries").innerHTML = tableHTML;
}

$(function() {
    setupForm();
});