// document.getElementById("result").innerHTML = "contacting backend server...";

function postToServer(body) {
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:3000/sql");
	xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
	xhr.onload = () => {
	  if (xhr.readyState == 4 && xhr.status == 200) {
		return xhr.responseText;
	  } else {
		return xhr.status;
	  }
	};
	xhr.send(body);
}

function toSQL(str) {
    return JSON.stringify({
        sql: str
    })
}

// Adapted from https://stackoverflow.com/questions/7744912/making-a-javascript-string-sql-friendly/7760578#7760578
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

export {postToServer, toSQL, sanitize};