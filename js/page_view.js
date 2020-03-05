var href = window.location.href;

function handleCallback(jsonData) {
	var arrival = jsonData.arrival;
	document.getElementById("page_view").innerHTML = arrival;
}

var jsonpScript = "<script type=\"text/javascript\" src=\"http://106.14.152.93:8443/third/githubio/arrival?callback=handleCallback&articleUrl=" + href + "\"><\/script>";
document.write(jsonpScript);