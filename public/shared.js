/**
 * Sends a query to the SQL server.
 * Optionally specify callback functions for successes and failures,
 * with optional arguments.
 * Query must be in proper format (use toSQL()).
 * Query must be a single statement (i.e., only one ;).
 */
function postToServer(query, callbackSuccess, callbackFail, arg1, arg2) {
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:3000/sql");
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
	xhr.onload = () => {
	  if (xhr.readyState == 4 && xhr.status == 200) {
        if (callbackSuccess != undefined) {
            if (arg2 != undefined) {
                callbackSuccess(xhr.responseText, arg1, arg2);
            } else if (arg1 != undefined) {
                callbackSuccess(xhr.responseText, arg1);
            } else {
                callbackSuccess(xhr.responseText);
            }   
        }
	  } else {
        console.log(xhr.status);
        console.log(xhr.responseText);
        if (callbackFail != undefined)
            callbackFail(xhr.responseText);
	  }
	};
	xhr.send(query);
}

/**
 * Sends an multiple SQL queries in the form of an array
 * in succession, one after another.
 */
function multiPostToServer(response, queryArray, callbackFail) {
    // queryArray in the form
    // [{query: "", func: "", arg1: "", arg2: ""}]
    // * must have same callbackFail
    // * func(response, arg1, arg2) is only called on the last query
    if (queryArray.length == 0) return;

    alert("multiPostToServer: " + queryArray[0].query);

    if (queryArray.length == 1 && queryArray[0].func != undefined) {
        postToServer(toSQL(queryArray[0].query),
                     queryArray[0].func,
                     callbackFail,
                     queryArray[0].arg1,
                     queryArray[0].arg2);
    } else {
        postToServer(toSQL(queryArray[0].query), 
                     multiPostToServer, 
                     callbackFail, 
                     queryArray.slice(1), 
                     callbackFail);
    }
    
}

/**
 * Turns a string into JSON SQL object.
 */
function toSQL(str) {
    return JSON.stringify({
        sql: str
    })
}

/**
 * Function to use with postToServer as callbackFail.
 */
function alertDatabaseError(response) {
    alert(response);
}

/**
 * Adapted from https://stackoverflow.com/questions/7744912/making-a-javascript-string-sql-friendly/7760578#7760578
 * Escapes all SQL characters in a string.
 */
function sanitize(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
            default:
                return char;
        }
    });
}

/**
 * Replaces undefined strings with blank strings.
 */
function replaceUndefined(str) {
    if (str == undefined)
        return "";
    return str;
}

export {postToServer, multiPostToServer, toSQL, alertDatabaseError, sanitize, replaceUndefined};