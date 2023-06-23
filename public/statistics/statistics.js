import {postToServer, 
    multiPostToServer, 
    toSQL, 
    alertDatabaseError, 
    sanitize, 
    replaceUndefined, 
    addSingleQuotesOrNULL,
    inputArrayToString} from "../shared.js";

/**
 * Loads a list of all galleries into the select (dropdown) menu.
 */
function setupSelectGalleryMultiple() {
    var query = "SELECT * FROM Gallery;"
    postToServer(toSQL(query), (response) => {
        var galleries = JSON.parse(response);
        var optionHTML = "";
        for (var i = 0; i < galleries.length; i++) {
            optionHTML += "<option value=" + galleries[i].gallery_id + ">" + galleries[i].name + "</option>"
        }
        document.getElementById("select-gallery-multiple").innerHTML = optionHTML;
    }, alertDatabaseError);
}

/**
 * Loads a list of all galleries into the select (dropdown) menu.
 */
function setupSelectGallery() {
    var query = "SELECT * FROM Gallery;"
    postToServer(toSQL(query), (response) => {
        document.getElementById("select-gallery-oaoa").innerHTML = "<option selected>Select a Gallery</option>";
        document.getElementById("select-gallery-loyal-customers").innerHTML = "<option selected>Select a Gallery</option>";
        var galleries = JSON.parse(response);
        var optionHTML = "";
        for (var i = 0; i < galleries.length; i++) {
            optionHTML += "<option value=" + galleries[i].gallery_id + ">" + galleries[i].name + "</option>"
        }
        optionHTML += "<option value=0 selected>Select a Gallery</option>";
        document.getElementById("select-gallery-oaoa").innerHTML = optionHTML;
        document.getElementById("select-gallery-loyal-customers").innerHTML = optionHTML;
    }, alertDatabaseError);
}

/**
* Callback function to load the table after a successful database retrieval.
* @param {*} response 
* @param {*} args 
* @returns 
*/
function loadTableArtworksPerGallery(response, args) {
    document.getElementById("tr-artworks-per-gallery-colnames").innerHTML = null;
    document.getElementById("tbody-artworks-per-gallery").innerHTML = null;

    var data = JSON.parse(response);
    if (data.length == 0) {
        document.getElementById("tbody-artworks-per-gallery").innerHTML = "No data found.";
        return;
    }

    var colnamesHTML = "<th>Gallery ID #</th>" +
                       "<th>Gallery Name</th>" +
                       "<th>Number of Artworks</th>";

    document.getElementById("tr-artworks-per-gallery-colnames").innerHTML = colnamesHTML;

    var tableHTML = "";
    for (var i = 0; i < data.length; i++) {
        var currentId = data[i].gallery_id;
        tableHTML += "<tr id='tr-apg-" + currentId + "'>" +
                     "<td id='td-apg-gallery-id-" + currentId + "'>" + data[i].gallery_id + "</td>" +
                     "<td id='td-apg-gallery-name-" + currentId + "'>" + data[i].name + "</td>" +
                     "<td id='td-apg-number-artworks-" + currentId + "'>" + data[i].num_artworks + "</td>" +
                    "</tr>"; 
    }

    document.getElementById("tbody-artworks-per-gallery").innerHTML = tableHTML;
}

/**
* Adds a listener to the artworks per gallery form.
*/
function setupFormArtworksPerGallery() {
    var registerForm = document.getElementById("form-artworks-per-gallery");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        var validInput = false;
        const selectGalleryMultiple = $('#select-gallery-multiple').val(); // Array

        var args = [];
        if (
            (selectGalleryMultiple != 0)
            ) {
            validInput = true;
        } else {
            alert("Input is invalid.");
        }

        if (validInput) {
            var query = "SELECT g.gallery_id, g.name, Count(a.art_id) AS num_artworks " +
                        "FROM Art a, Exhibit e, Gallery g " +
                        "WHERE a.exhibit_id = e.exhibit_id AND e.gallery_id = g.gallery_id ";

            for (var i = 0; i < selectGalleryMultiple.length; i++) {
                if (selectGalleryMultiple.length == 1) {
                    query += " AND e.gallery_id = " + selectGalleryMultiple[i];
                } else {
                    if (i == 0) {
                        query += " AND (e.gallery_id = " + selectGalleryMultiple[i];
                    } else if (i == selectGalleryMultiple.length - 1) {
                        query += " OR e.gallery_id = " + selectGalleryMultiple[i] + ")";
                    } else {
                        query += " OR e.gallery_id = " + selectGalleryMultiple[i];
                    }
                }              
            }
            query += " GROUP BY e.gallery_id"
            query += ";";
            postToServer(toSQL(query), loadTableArtworksPerGallery);
    }

  });
}

/**
* Callback function to load the table after a successful database retrieval.
* @param {*} response 
* @param {*} args 
* @returns 
*/
function loadTableExhibitPopularity(response, args) {
    document.getElementById("tr-exhibit-popularity-colnames").innerHTML = null;
    document.getElementById("tbody-exhibit-popularity").innerHTML = null;

    var data = JSON.parse(response);
    if (data.length == 0) {
        document.getElementById("tbody-exhibit-popularity").innerHTML = "No data found matching the provided query.";
        return;
    }

    var colnamesHTML = "<th>Exhibit ID #</th>" +
                       "<th>Exhibit Title</th>" +
                       "<th>Number of Customers</th>";

    document.getElementById("tr-exhibit-popularity-colnames").innerHTML = colnamesHTML;

    var tableHTML = "";
    for (var i = 0; i < data.length; i++) {
        var currentId = data[i].exhibit_id;
        tableHTML += "<tr id='tr-ep-" + currentId + "'>" +
                     "<td id='td-ep-exhibit-id-" + currentId + "'>" + data[i].exhibit_id + "</td>" +
                     "<td id='td-ep-exhibit-title-" + currentId + "'>" + data[i].title + "</td>" +
                     "<td id='td-ep-num-customers-" + currentId + "'>" + data[i].num_customers + "</td>" +
                    "</tr>"; 
    }

    document.getElementById("tbody-exhibit-popularity").innerHTML = tableHTML;
}

/**
* Adds a listener to the exhibit popularity form.
*/
function setupFormExhibitPopularity() {
    var registerForm = document.getElementById("form-exhibit-popularity");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const minCustomers = document.getElementById("text-min-customers").value;

        var query = "SELECT v.exhibit_id, title, Count(customer_id) AS num_customers " +
                    "FROM Visits v, Exhibit e " +
                    "WHERE v.exhibit_id = e.exhibit_id " +
                    "GROUP BY v.exhibit_id " +
                    "HAVING Count(*) >= " + minCustomers + ";";

        postToServer(toSQL(query), loadTableExhibitPopularity);
    })
}

/** 
* Call function to setup search form on page load.
*/
$(function() {
    setupSelectGalleryMultiple(); //for Artworks Per Gallery
    setupSelectGallery(); //for Old Art and Old Artists, and Loyal Customers
    setupFormArtworksPerGallery();
    setupFormExhibitPopularity();
    // setupFormOldArtandOldArtists();
    // setupFormLoyalCustomers();
});