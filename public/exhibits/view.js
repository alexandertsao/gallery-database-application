import {postToServer, toSQL, alertDatabaseError, sanitize, replaceUndefined} from "../shared.js";

function setupForm() {
    var registerForm = document.getElementById("form-view-galleries");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        var validInput = false;
        const textQuery = document.getElementById("text-query").value;
        const checkboxFilterMuseum = document.getElementById("checkbox-filter-museum").checked;
        const checkboxFilterArtGallery = document.getElementById("checkbox-filter-art-gallery").checked;
        const checkboxFilterVirtualArtGallery = document.getElementById("checkbox-filter-virtual-art-gallery").checked;
        const checkboxDisplayAddress = document.getElementById("checkbox-display-address").checked;
        const checkboxDisplayCity = document.getElementById("checkbox-display-city").checked;
        const checkboxDisplayStateProvince = document.getElementById("checkbox-display-state-province").checked;
        const checkboxDisplayPostalCode = document.getElementById("checkbox-display-postal-code").checked;
        const checkboxDisplayCountry = document.getElementById("checkbox-display-country").checked;
        const checkboxDisplayUrl = document.getElementById("checkbox-display-url").checked;

        var args = [checkboxDisplayAddress, checkboxDisplayCity, checkboxDisplayStateProvince,
                    checkboxDisplayPostalCode, checkboxDisplayCountry, checkboxDisplayUrl];

        if (
            (validator.isAlphanumeric(textQuery, undefined, {ignore:" -"}) && validator.isLength(textQuery, { min: 0, max: 255 })) || validator.isEmpty(textQuery)
            ) {
            validInput = true;
            //alert("Input is valid.");
        } else {
            alert("Input is invalid.");
        }

        if (validInput) {
            var query = "";
            if (checkboxFilterMuseum) {
                query += "SELECT 'Museum' AS 'type', g1.gallery_id, g1.name";
                if (checkboxDisplayAddress) query += ", address";
                if (checkboxDisplayCity) query += ", city";
                if (checkboxDisplayStateProvince) query += ", state_province";
                if (checkboxDisplayPostalCode) query += ", postal_code";
                if (checkboxDisplayCountry) query += ", country";
                if (checkboxDisplayUrl) query += ", NULL AS url";
                query += " " +
                         "FROM Gallery g1, Museum m " +
                         "WHERE g1.gallery_id = m.gallery_id AND (g1.gallery_id LIKE " +
                         "'%" + sanitize(textQuery) + "%' " +
                         "OR g1.name LIKE " +
                         "'%" + sanitize(textQuery) + "%')";
            }
            if (checkboxFilterArtGallery) {
                if (checkboxFilterMuseum) query += " UNION ";
                query += "SELECT 'Art Gallery' AS 'type', g2.gallery_id, g2.name";
                if (checkboxDisplayAddress) query += ", address";
                if (checkboxDisplayCity) query += ", city";
                if (checkboxDisplayStateProvince) query += ", state_province";
                if (checkboxDisplayPostalCode) query += ", postal_code";
                if (checkboxDisplayCountry) query += ", country";
                if (checkboxDisplayUrl) query += ", NULL AS url";
                query += " " +
                         "FROM Gallery g2, Art_Gallery a " +
                         "WHERE g2.gallery_id = a.gallery_id AND (g2.gallery_id LIKE " +
                         "'%" + sanitize(textQuery) + "%' " +
                         "OR g2.name LIKE " +
                         "'%" + sanitize(textQuery) + "%')";
            }
            if (checkboxFilterVirtualArtGallery) {
                if (checkboxFilterMuseum || checkboxFilterArtGallery) query += " UNION ";
                query += "SELECT 'Virtual Art Gallery' AS 'type', g3.gallery_id, g3.name";
                if (checkboxDisplayAddress) query += ", NULL AS address";
                if (checkboxDisplayCity) query += ", NULL AS city";
                if (checkboxDisplayStateProvince) query += ", NULL AS state_province";
                if (checkboxDisplayPostalCode) query += ", NULL AS postal_code";
                if (checkboxDisplayCountry) query += ", NULL AS country";
                if (checkboxDisplayUrl) query += ", url";
                query += " " +
                         "FROM Gallery g3, Virtual_Art_Gallery v " +
                         "WHERE g3.gallery_id = v.gallery_id AND (g3.gallery_id LIKE " +
                         "'%" + sanitize(textQuery) + "%' " +
                         "OR g3.name LIKE " +
                         "'%" + sanitize(textQuery) + "%')";
            }
            query += ";";     
            //alert(query);
            postToServer(toSQL(query), loadTable, undefined, args);
        }

      });
}

function loadTable(response, args) {
    document.getElementById("tr-galleries-colnames").innerHTML = null;
    document.getElementById("tbody-galleries").innerHTML = null;

    var data = JSON.parse(response);
    if (data.length == 0) {
        document.getElementById("tbody-galleries").innerHTML = "No results matching the provided query found.";
        return;
    }

    var colnamesHTML = "<th>Type</th><th>ID #</th><th>Name</th>";
    if (args[0]) colnamesHTML += "<th>Address</th>";
    if (args[1]) colnamesHTML += "<th>City</th>";
    if (args[2]) colnamesHTML += "<th>State/Province</th>";
    if (args[3]) colnamesHTML += "<th>Postal Code</th>";
    if (args[4]) colnamesHTML += "<th>Country</th>";
    if (args[5]) colnamesHTML += "<th>URL</th>";

    document.getElementById("tr-galleries-colnames").innerHTML = colnamesHTML;

    var tableHTML = "";
    for (var i = 0; i < data.length; i++) {
        var currentId = data[i].gallery_id;
        tableHTML += "<tr id='tr-gallery-" + currentId + "'>" +
                     "<td id='td-gallery-type-" + currentId + "'>" + data[i].type + "</td>" +
                     "<td id='td-gallery-id-" + currentId + "'>" + data[i].gallery_id + "</td>" +
                     "<td id='td-gallery-name-" + currentId + "'>" + data[i].name + "</td>" +
                     "<td id='td-gallery-address-" + currentId + "'>" + replaceUndefined(data[i].address) + "</td>" +
                     "<td id='td-gallery-city-" + currentId + "'>" + replaceUndefined(data[i].city) + "</td>" +
                     "<td id='td-gallery-state-province-" + currentId + "'>" + replaceUndefined(data[i].state_province) + "</td>" +
                     "<td id='td-gallery-postal-code-" + currentId + "'>" + replaceUndefined(data[i].postal_code) + "</td>" +
                     "<td id='td-gallery-country-" + currentId + "'>" + replaceUndefined(data[i].country) + "</td>" +
                     "<td id='td-gallery-url-" + currentId + "'>" + replaceUndefined(data[i].url) + "</td>" +
                     "</tr>";
    }

    document.getElementById("tbody-galleries").innerHTML = tableHTML;
}

$(function() {
    setupForm();
});