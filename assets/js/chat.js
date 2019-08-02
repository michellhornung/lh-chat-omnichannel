/**
 * Script for Agent page - Omnichannel LH
 */

var messageRight = '';
var username = '';

$(document).ready(function(){
	$(".chat_window").hide();
    $(".chat_on").click(function(){
        $(".chat_window").toggle();
        $(".chat_on").hide(300);
    });
    
       $(".chat_close_icon").click(function(){
        $(".chat_window").hide();
           $(".chat_on").show(300);
    });
    
});

//Button click handling 
$("#btnLogin").click(function () {
    login();
    $("#message_identify").hide();
     $(".messages").removeAttr('hidden');
     $("#btnRequestService").click();

     getAndSetValues();
});
$("#btnRequestService").click(function () {
   reqserv();
});
$("#btnEnterChat").click(function () {
   enterchat();
});
$(".chat_close_icon").click(function () {
    closechat();
});

function urlParam(name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (!results) {
        return undefined;
    }
    return unescape(results[1] || undefined);
};

function getAndSetValues() {
    username = $("#txtUsername").val();
    var telefone = $("#txtTelefone").val();
    // $("#txtUsername").val(username);
    // $("#txtTelefone").val(telefone);
    // $("#txtPassword").val("ana903hr843");
    // $("#txtEmail").val("ana@lh.com.br");
    // $("#txtFila").val("atendimento");
    // $("#txtAuth").val("2hFbvXGelyrPIyNt");
};

txtUsername.value = urlParam("username");
txtPassword.value = urlParam("password");
txtEmail.value = urlParam("username") + '@lh.com.br'
txtFila.value = urlParam("queue");

var ofchat = '';
var room = '';
var source;

async function login() {
    const URL = 'http://172.20.250.149:7070/rest/api/restapi/v1/chat/' + txtUsername.value + '/login';
    fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "text/plain",
            Authorization: txtAuth.value
        }
    }).then(
        response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.text();
        }
    ).then(
        data => {
            ofchat = data;
            $("#messagesField").append('Login: ' + data + '<br/>');
            $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
            loginSSE();
        }
    ).catch(function(error) {
        console.log(error);
        $("#messagesField").append(error + '<br/>');
        $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
        return;
    });

}
    
async function loginSSE() {

    //source = new EventSource('/sse/' + txtUsername.value);//, { withCredentials: false });
    source = new EventSourcePolyfill('http://172.20.250.149:7070/sse/' + txtUsername.value, {
        headers: {
            Authorization: "Basic " + btoa(txtUsername.value + ':' + txtPassword.value)
        }
    });

    source.addEventListener('open', function(e) {
        $("#messagesField").append('Connections to the server established..<br/>');
        $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    });

    source.onmessage = function(e) {
        console.log("event", JSON.parse(e.data));
        $("#messagesField").append(e.data + '<br/>');
        $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    };

    source.onerror = function(e) {
        console.error(e);
        $("#messagesField").append(e + '<br/>');
        $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    };
    
    source.addEventListener('chatapi.presence', function(e) {
        console.log("chatapi.presence", JSON.parse(e.data));
    });

    source.addEventListener('chatapi.chat', function(e) {
        console.log("chatapi.chat", JSON.parse(e.data));
        var jmsg = JSON.parse(e.data);
        if (jmsg.state == 'composing') {
            $("#messagesField").append(jmsg.from.split("@")[0] + ' is typing...');
            //document.getElementById('state').innerHTML = jmsg.from.split("@")[0] + ' is typing...';
        } else if (jmsg.state == 'paused') {
            $("#messagesField").append(jmsg.from.split("@")[0] + ' is paused...');
            //document.getElementById('state').innerHTML = jmsg.from.split("@")[0] + ' is paused...';
        } else if (jmsg.state == 'active') {
            $("#messagesField").append(jmsg.from.split("@")[0] + ' is online...');
            //document.getElementById('state').innerHTML = jmsg.from.split("@")[0] + ' is online...';
        } else if (jmsg.state == 'gone') {
            $("#messagesField").append(jmsg.from.split("@")[0] + ' is offline...');
            //document.getElementById('state').innerHTML = jmsg.from.split("@")[0] + ' is offline...';
        }
    });

    source.addEventListener('chatapi.muc', function(e) {
        console.log("chatapi.muc", JSON.parse(e.data));
        var jmsg = JSON.parse(e.data);
        if (jmsg.type == 'groupchat' && jmsg.from.split("/")[1] != txtUsername.value) {
            //txtDestino.value = jmsg.from.split("/")[1] + '@172.20.250.149';			
            $("#messagesField").append(jmsg.from.split("/")[1] + '@172.20.250.149');
			var jmsgdata = JSON.parse(decodeURIComponent(jmsg.body));			
			if (jmsgdata.type == 'Text') {	
                $("#messagesField").append(jmsg.from.split("/")[1] + ': ' + jmsgdata.data + '<br/>');
				//document.getElementById('MsgFrame').contentWindow.document.getElementById('content').innerHTML += jmsg.from.split("/")[1] + ': ' + jmsgdata.data + '<br/>';
			} else if (jmsgdata.type == 'Option') {
				for (var opt in jmsgdata.options) {				
					var btn = document.createElement("input");
					btn.setAttribute('type','button');					
					btn.setAttribute('value',jmsgdata.options[opt]);
                    btn.onclick = sendMsgBtn;
                    $("#messagesField").append(btn);
					//document.getElementById('MsgFrame').contentWindow.document.getElementById('content').appendChild(btn);
				}
			} else if (jmsgdata.type == 'Audio') {
				var sound      = document.createElement('audio');
				sound.controls = 'controls';
				sound.src      = jmsgdata.data;
                sound.type     = 'audio/mpeg';
                $("#messagesField").html(sound);
				//document.getElementById('MsgFrame').contentWindow.document.getElementById('content').appendChild(sound);
				sound.play();
			} else if (jmsgdata.type == 'Transfer') {
				txtFila.value = jmsgdata.data;
				closechat();
				setTimeout(cancelserv, 1000);
				setTimeout(reqserv, 2000);
            }
            $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
        }
    });

    source.addEventListener('chatapi.ask', function(e) {
        console.log("chatapi.ask", JSON.parse(e.data));
    });

    source.addEventListener('chatapi.assist', function(e) {
        console.log("chatapi.assist", JSON.parse(e.data));
    });

    //source.addEventListener('chatapi.xmpp', function(e) {
    //    console.debug("chatapi.xmpp", JSON.parse(e.data));
    //});

    source.addEventListener('chatapi.notify', function(e) {
        console.log("chatapi.notify", JSON.parse(e.data));
    });

}

async function logoff() {
	sendGone();

    $("#messagesField").append('Listening to server events stopped..<br/>');
    $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    source.close();

    const URL = 'http://172.20.250.149:7070/rest/api/restapi/v1/chat/' + ofchat + '/logoff';
    fetch(URL, {
        method: "POST",
        headers: {
            Authorization: txtAuth.value
        }
    }).then(
        response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.text();
        }
    ).then(
        data => {
            $("#messagesField").append('Logoff..<br/>');
            $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
        }
    ).catch(function(error) {
        console.log(error);
        $("#messagesField").append(error + '<br/>');
        $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    });
}

async function reqserv() {
	var question = "Olá preciso de ajuda";
    const URL = 'http://172.20.250.149:7070/rest/api/restapi/v1/ask/';
    fetch(URL, {
        body: "{\"emailAddress\": \"" + txtEmail.value + "\", \"question\": \"" + question + "\", \"userID\": \"" + txtUsername.value + "_web\", \"workgroup\": \"" + txtFila.value + "\"}",
        headers: {
            Accept: "application/json",
            Authorization: txtAuth.value,
            "Content-Type": "application/json"
        },
        method: "POST"
    }).then(
        response => {
            if (!response.ok) {
                throw Error('No agents logged in');
            }
            return response.text();
        }
    ).then(data => {
            $("#messagesField").append('Eu: ' + question + '<br/>');
			$("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
            console.log("reqserv", JSON.parse(data));
            var jmsg = JSON.parse(data);
            if (jmsg.groupchat === "revoked") {
                throw Error('Canceled');
            }            
            room = jmsg.sender.split("@")[0];
            $("#messagesField").append('Accepted...' + '<br/>');
			$("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
			enterchat();
        }
    ).catch(function(error) {
        console.log(error);
        $("#messagesField").append(error + '<br/>');
        $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    });
}

async function cancelserv() {
	closechat();
    const URL = 'http://172.20.250.149:7070/rest/api/restapi/v1/ask/' + txtUsername.value + "_web";
    fetch(URL, {
        headers: {
            Authorization: txtAuth.value
        },
        method: "DELETE"
    }).then(
        response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
        }
    ).catch(function(error) {
        console.log(error);
        $("#messagesField").append(error + '<br/>');
        $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    });
}

async function enterchat() {  
    URL = 'http://172.20.250.149:7070/rest/api/restapi/v1/chat/' + ofchat + '/rooms/' + room + '?service=conference';
    fetch(URL, {        
        headers: {
            Authorization: txtAuth.value
        },
        method: "PUT"
    }).then(
        response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            $("#messagesField").append('Enter room: ' + room + '...<br/>');
            $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
			setTimeout(getagent, 2000);
        }
    ).catch(function(error) {
        console.log(error);
        $("#messagesField").append(error + '<br/>');
        $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    });
}

async function closechat() {  
    URL = 'http://172.20.250.149:7070/rest/api/restapi/v1/chat/' + ofchat + '/rooms/' + room + '?service=conference';
    fetch(URL, {        
        headers: {
            Authorization: txtAuth.value
        },
        method: "DELETE"
    }).then(
        response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            $("#messagesField").append('Exit room: ' + room + '...<br/>');
            $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
        }
    ).catch(function(error) {
        console.log(error);
        $("#messagesField").append(error + '<br/>');
        $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    });
}

async function getagent() {
    URL = 'http://172.20.250.149:7070/rest/api/restapi/v1/chat/rooms/' + room + '/participants';
    fetch(URL, {        
        headers: {
			Accept: "application/json",
            Authorization: txtAuth.value
        },
    }).then(
        response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
			return response.text();
        }
	).then(data => {
			console.log("getagent", data);
            var jmsg = JSON.parse(data);
			for (var dest in jmsg.participant) {
				if (jmsg.participant[dest].jid.split("/")[1] != txtUsername.value) {
                    //txtDestino.value = jmsg.participant[dest].jid.split("/")[1] + '@172.20.250.149';
                    $("#messagesField").append(jmsg.participant[dest].jid.split("/")[1] + '@172.20.250.149');
					break;
				}
			}
        }    
    ).catch(function(error) {
        console.log(error);
        $("#messagesField").append(error + '<br/>');
        $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    });
}

function sendMsgBtn() {
	const URL = 'http://172.20.250.149:7070/rest/api/restapi/v1/chat/' + ofchat + '/rooms/' + room;
	fetch(URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: txtAuth.value
		},
		body: this.value
	}).then(
		response => response.text()
	).then(
		data => {
            $("#messagesField").append('Sent..' + data + '<br/>');
			$("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
		}
	).catch(function(error) {
        console.log(error);
        $("#messagesField").append(error + '<br/>');
		$("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    });
    $("#messagesField").append('<br/>Eu: ' + this.value + '<br/>');
	$("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
}

async function sendMsg(e) {
	var jsonMsg = '{ "type" : "Text", "data" : "' + txtMsg.value + '"}';
	var jsonMsgText = encodeURIComponent(jsonMsg);
    if (e.keyCode === 13) {
        const URL = 'http://172.20.250.149:7070/rest/api/restapi/v1/chat/' + ofchat + '/rooms/' + room;
        fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: txtAuth.value
            },
            body: jsonMsgText
        }).then(
            response => response.text()
        ).then(
            data => {
                $("#messagesField").append('Sent..' + data + '<br/>');
                $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
            }
        ).catch(function(error) {
            console.log(error);
            $("#messagesField").append(error + '<br/>');
            $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
        });

        messageRight = 
        '<li class="message right appeared"> ' +
         '   <div class="text_wrapper"> ' +
          '  <div class="text">Eu: '  + txtMsg.value  + '</div> ' +
           ' </div> ' +
            '<time datetime="2009-11-13T20:00"> ' + username + ' • ' + getDateTime(); + ' </time> ' +
        '</li> '
        $("#messagesField").append(messageRight);

        $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    } else if (pauseTimeout === null) {
    	sendTyping();
	}
    if (pauseTimeout) {
    	clearTimeout(pauseTimeout);
    }
	pauseTimeout = setTimeout(sendPaused, 2000);
}

async function sendMsgClear(e) {
    if (e.keyCode === 13) {
        txtMsg.value = "";
        if (pauseTimeout) {
    		clearTimeout(pauseTimeout);
    	}
		pauseTimeout = null;
		sendActive();		
    }
}

async function sendTyping() {
    const URL = 'http://172.20.250.149:7070/rest/api/restapi/v1/chat/' + ofchat + '/chatstate/composing/' + txtDestino.value;
    fetch(URL, {
        method: "POST",
        headers: {
            Authorization: txtAuth.value
        },
        body: txtMsg.value
    }).catch(function(error) {
        console.log(error);
        $("#messagesField").append(error + '<br/>');
        $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    });
}
var pauseTimeout = null;
async function sendPaused() {
	pauseTimeout = null;
    const URL = 'http://172.20.250.149:7070/rest/api/restapi/v1/chat/' + ofchat + '/chatstate/paused/' + txtDestino.value;
    fetch(URL, {
        method: "POST",
        headers: {
            Authorization: txtAuth.value
        },
        body: txtMsg.value
    }).catch(function(error) {
        console.log(error);
        $("#messagesField").append(error + '<br/>');
        $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    });
}
async function sendActive() {
    const URL = 'http://172.20.250.149:7070/rest/api/restapi/v1/chat/' + ofchat + '/chatstate/active/' + txtDestino.value;
    fetch(URL, {
        method: "POST",
        headers: {
            Authorization: txtAuth.value
        },
        body: txtMsg.value
    }).catch(function(error) {
        console.log(error);
        $("#messagesField").append(error + '<br/>');
        $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    });
}
async function sendGone() {
    const URL = 'http://172.20.250.149:7070/rest/api/restapi/v1/chat/' + ofchat + '/chatstate/gone/' + txtDestino.value;
    fetch(URL, {
        method: "POST",
        headers: {
            Authorization: txtAuth.value
        },
        body: txtMsg.value
    }).catch(function(error) {
        console.log(error);
        $("#messagesField").append(error + '<br/>');
        $("#messagesField").animate({ scrollTop: $("#messagesField").prop('scrollHeight') }, 340);
    });
}

function getDateTime() {
    var currentdate = new Date(Date.now());
    var formatted = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    return formatted;
}









