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
            postToServer(toSQL(query), loadTable, undefined, args);
        }

      });
}

function onClickEdit(event) {
    var currentId = event.currentTarget.galleryId;
    var formGroupIds = event.currentTarget.formGroupIds;
    
    for (var i = 0; i < formGroupIds.length; i++) {
        const previousInnerHTML = document.getElementById(formGroupIds[i]).innerHTML;
        document.getElementById(formGroupIds[i]).previousInnerHTML = previousInnerHTML;

        document.getElementById(formGroupIds[i]).innerHTML = "<input type='text' class='form-control' id=edit-" + currentId +
                                                             "' name='td-edit-" + currentId +
                                                             "' value='" + 
                                                             previousInnerHTML + "'>";
    }

    document.getElementById("button-edit-"+ currentId).style.display = "none";
    document.getElementById("button-update-" + currentId).style.display = "block";
    document.getElementById("button-cancel-" + currentId).style.display = "block";
    document.getElementById("button-delete-" + currentId).style.display = "none";
}

function onClickUpdate(event) {
    var currentId = event.currentTarget.galleryId;
    var formGroupIds = event.currentTarget.formGroupIds;
}

function onClickCancel(event) {
    var currentId = event.currentTarget.galleryId;
    var formGroupIds = event.currentTarget.formGroupIds;

    for (var i = 0; i < formGroupIds.length; i++) {
        document.getElementById(formGroupIds[i]).innerHTML = document.getElementById(formGroupIds[i]).previousInnerHTML;

        document.getElementById(formGroupIds[i]).previousInnerHTML = null;
    }

    document.getElementById("button-edit-"+ currentId).style.display = "block";
    document.getElementById("button-update-" + currentId).style.display = "none";
    document.getElementById("button-cancel-" + currentId).style.display = "none";
    document.getElementById("button-delete-" + currentId).style.display = "block";
}

function onClickDelete(event) {
    var currentId = event.currentTarget.galleryId;
    var formGroupIds = event.currentTarget.formGroupIds;
}

function setupButtons(editButtons, updateButtons, cancelButtons, deleteButtons, args) {
    
    for (var i = 0; i < editButtons.length; i++) {
        var formGroupIds = [];
        formGroupIds.push("form-group-gallery-name-" + editButtons[i].id);
        if (document.getElementById("tr-gallery-" + editButtons[i].id).galleryType == "Museum" || 
            document.getElementById("tr-gallery-" + editButtons[i].id).galleryType == "Art Gallery") {
            if (args[0]) formGroupIds.push("form-group-gallery-address-" + editButtons[i].id);
            if (args[1]) formGroupIds.push("form-group-gallery-city-" + editButtons[i].id);
            if (args[2]) formGroupIds.push("form-group-gallery-state-province-" + editButtons[i].id);
            if (args[3]) formGroupIds.push("form-group-gallery-postal-code-" + editButtons[i].id);
            if (args[4]) formGroupIds.push("form-group-gallery-country-" + editButtons[i].id);
        } else if (document.getElementById("tr-gallery-" + editButtons[i].id).galleryType == "Virtual Art Gallery") {
            if (args[5]) formGroupIds.push("form-group-gallery-url-" + editButtons[i].id);
        }
        document.getElementById(editButtons[i].button_id).addEventListener("click", onClickEdit); 
        document.getElementById(editButtons[i].button_id).galleryId = editButtons[i].id;
        document.getElementById(editButtons[i].button_id).formGroupIds = formGroupIds;

        document.getElementById(updateButtons[i].button_id).addEventListener("click", onClickUpdate); 
        document.getElementById(updateButtons[i].button_id).galleryId = updateButtons[i].id;
        document.getElementById(updateButtons[i].button_id).formGroupIds = formGroupIds;

        document.getElementById(cancelButtons[i].button_id).addEventListener("click", onClickCancel); 
        document.getElementById(cancelButtons[i].button_id).galleryId = cancelButtons[i].id;
        document.getElementById(cancelButtons[i].button_id).formGroupIds = formGroupIds;
        
        document.getElementById(deleteButtons[i].button_id).addEventListener("click", onClickDelete); 
        document.getElementById(deleteButtons[i].button_id).galleryId = deleteButtons[i].id;
    }

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
    colnamesHTML += "<th>Actions</th>";

    document.getElementById("tr-galleries-colnames").innerHTML = colnamesHTML;

    var tableHTML = "";
    var editButtons = [];
    var updateButtons = [];
    var cancelButtons = [];
    var deleteButtons = [];
    for (var i = 0; i < data.length; i++) {
        var currentId = data[i].gallery_id;
        tableHTML += "<tr id='tr-gallery-" + currentId + "'>" +
                     "<form class='form-horizontal' id='tr-edit-" + currentId + "' action=''>" +
                     "<td id='td-gallery-type-" + currentId + "'>" + data[i].type + "</td>" +
                     "<td id='td-gallery-id-" + currentId + "'>" + data[i].gallery_id + "</td>" +
                     "<td id='td-gallery-name-" + currentId + "'><div class='form-group' id='form-group-gallery-name-" + currentId + "'>" + data[i].name + "</div></td>";
        if (args[0]) tableHTML += "<td id='td-gallery-address-" + currentId + "'><div class='form-group' id='form-group-gallery-address-" + currentId + "'>" + replaceUndefined(data[i].address) + "</div></td>";
        if (args[1]) tableHTML += "<td id='td-gallery-city-" + currentId + "'><div class='form-group' id='form-group-gallery-city-" + currentId + "'>" + replaceUndefined(data[i].city) + "</div></td>";
        if (args[2]) tableHTML += "<td id='td-gallery-state-province-" + currentId + "'><div class='form-group' id='form-group-gallery-state-province-" + currentId + "'>" + replaceUndefined(data[i].state_province) + "</div></td>";
        if (args[3]) tableHTML += "<td id='td-gallery-postal-code-" + currentId + "'><div class='form-group' id='form-group-gallery-postal-code-" + currentId + "'>" + replaceUndefined(data[i].postal_code) + "</div></td>";
        if (args[4]) tableHTML += "<td id='td-gallery-country-" + currentId + "'><div class='form-group' id='form-group-gallery-country-" + currentId + "'>" + replaceUndefined(data[i].country) + "</div></td>";
        if (args[5]) tableHTML += "<td id='td-gallery-url-" + currentId + "'><div class='form-group' id='form-group-gallery-url-" + currentId + "'>" + replaceUndefined(data[i].url) + "</div></td>";
        tableHTML += "<td style='width: 150px' id='td-edit-delete-" + currentId + "'>" +
                     "<button class='btn btn-primary' id='button-edit-" + currentId + "' style='margin-right: 5px'>Edit</button>" +
                     "<button class='btn btn-primary' id='button-update-" + currentId + "' style='display: none'>Update</button>" +
                     "<button class='btn btn-secondary' id='button-cancel-" + currentId + "' style='display: none'>Cancel</button>" +
                     "<button class='btn btn-danger' id='button-delete-" + currentId + "'>Delete</button>" +
                     "</td>" +
                     "</form>" +
                     "</tr>"; 
        editButtons.push({button_id: "button-edit-" + currentId, id: currentId});
        updateButtons.push({button_id: "button-update-" + currentId, id: currentId});
        cancelButtons.push({button_id: "button-cancel-" + currentId, id: currentId});
        deleteButtons.push({button_id: "button-delete-" + currentId, id: currentId});
    }

    document.getElementById("tbody-galleries").innerHTML = tableHTML;

    for (var i = 0; i < data.length; i++) {
        var currentId = data[i].gallery_id;
        document.getElementById("tr-gallery-" + currentId).galleryType = data[i].type;
    }

    setupButtons(editButtons, updateButtons, cancelButtons, deleteButtons, args);
}

$(function() {
    setupForm();
});