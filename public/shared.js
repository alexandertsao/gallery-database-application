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

// postToServer(sqlToSend);

export {postToServer, toSQL};