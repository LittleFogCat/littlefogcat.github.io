var href = window.location.href; // 页面地址

function handleCallback(jsonData) {
	console.log("jsonData = " + jsonData);
	var arrival = jsonData.arrival;
	document.getElementById("page_view").innerHTML = arrival;
}

var arrivalServer = "https://47.101.216.186:8443/third/githubio/arrival?callback=handleCallback&articleUrl=" + href;
if(returnCitySN) {
	arrivalServer = arrivalServer + "&ip=" + returnCitySN["cip"];
}

document.write("<script type=\"text/javascript\" src=\"" + src + "\"><\/script>");
