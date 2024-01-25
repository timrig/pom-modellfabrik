var mqttServer;
var mqttUser;
var mqttPassword;
var mqttLinie;
var mqttStation;
var ivlStatus=0;

function buttonSubmitMQTT() {
  mqttLinie = document.getElementById("mqttLinie").value;
  console.log(mqttLinie);
  mqttStation = document.getElementById("mqttStation").value;
  console.log(mqttStation);
  PubSubMQTT();
}

function PubSubMQTT() {
  if( mqttServer === "" ||
      mqttUser === "" ||
      mqttPassword === "" ||
      mqttLinie === "" ||
      mqttStation === ""
  ) {
    alert("Gib alle Parameter an!");
  }
  else {
    var div=document.getElementById("buttons");
    div.innerHTML='';
    if(mqttStation!=0) {
      if(mqttStation==3) {
        var variante;
        var button = document.createElement("button");
        button.innerHTML = "Stecker Variante 1 fertiggestellt";
        button.classList.add("button-10");
        button.id="mqttFertigV1";
        button.style.width="100%";
        button.style.backgroundColor="rgb(0,128,0)";
        button.onclick = function() {
          variante=1;
          mqttPubFertig(mqttServer,mqttUser,mqttPassword,parseInt(mqttLinie),variante);
        }
        div.appendChild(button);
        if(mqttLinie==3) {
          var button2 = document.createElement("button");
          button2.innerHTML = "Stecker Variante 2 fertiggestellt";
          button2.classList.add("button-10");
          button2.id="mqttFertigV2";
          button2.style.width="100%";
          button2.style.backgroundColor="rgb(0,128,0)";
          button2.onclick = function() {
            variante=2;
            mqttPubFertig(mqttServer,mqttUser,mqttPassword,parseInt(mqttLinie),variante);
          }
          div.appendChild(button2);
          var button3 = document.createElement("button");
          button3.innerHTML = "Stecker Variante 3 fertiggestellt";
          button3.classList.add("button-10");
          button3.id="mqttFertigV3";
          button3.style.width="100%";
          button3.style.backgroundColor="rgb(0,128,0)";
          button3.onclick = function() {
            variante=3;
            mqttPubFertig(mqttServer,mqttUser,mqttPassword,parseInt(mqttLinie),variante);
          }
          div.appendChild(button3);
        }
      }
      var button4 = document.createElement("button");
      button4.innerHTML = "Ausschuss";
      button4.classList.add("button-10");
      button4.id="mqttAusschuss";
      button4.style.width="100%";
      button4.style.backgroundColor="rgb(128,0,0)";
      button4.onclick = function() {
        mqttPubAusschuss(mqttServer,mqttUser,mqttPassword,parseInt(mqttLinie),parseInt(mqttStation));
      }
      div.appendChild(button4);
    }
    else {
      var button5 = document.createElement("button");
      button5.innerHTML = "Stecker repariert";
      button5.classList.add("button-10");
      button5.id="mqttRep";
      button5.style.width="100%";
      button5.style.backgroundColor="rgb(0,128,0)";
      button5.onclick = function() {
        mqttPubRep(mqttServer,mqttUser,mqttPassword,parseInt(mqttLinie),parseInt(mqttStation));
      }
      div.appendChild(button5);
    }
    document.getElementById("btnAktionen").style.backgroundColor = "#d3d3d3";
    document.getElementById("btnMqtt").style.backgroundColor = "#00a2ff";
    document.getElementById("aktion").style.display = "block";
    document.getElementById("mqtt").style.display = "none";
  }
}

function mqttPubFertig(server,user,password,linie,variante) {
  var topic;
  let zeit = new Date();
  let stunden;
  let minuten;
  let sekunden;
  let jahr = zeit.getFullYear();
  let monat = zeit.getMonth()+1;
  let tag = zeit.getDate();
  let datum = tag + "." + monat + "." + jahr;
  if(zeit.getHours()<10) stunden = "0" + zeit.getHours();
  else stunden = zeit.getHours();
  if(zeit.getMinutes()<10) minuten = "0" + zeit.getMinutes();
  else minuten = zeit.getMinutes();
  if(zeit.getSeconds()<10) sekunden = "0" + zeit.getSeconds();
  else sekunden = zeit.getSeconds();
  let zeitGes = stunden + ":" + minuten + ":" + sekunden;
  sqlQueryFertigteile(linie,variante,datum,zeitGes);
  topic="l" + linie + "/fertig/v" + variante;
  mqttPublish(server,user,password,topic);
}

function mqttPubAusschuss(server,user,password,linie,station) {
  var topic;
  let zeit = new Date();
  let stunden;
  let minuten;
  let sekunden;
  let jahr = zeit.getFullYear();
  let monat = zeit.getMonth()+1;
  let tag = zeit.getDate();
  let datum = tag + "." + monat + "." + jahr;
  if(zeit.getHours()<10) stunden = "0" + zeit.getHours();
  else stunden = zeit.getHours();
  if(zeit.getMinutes()<10) minuten = "0" + zeit.getMinutes();
  else minuten = zeit.getMinutes();
  if(zeit.getSeconds()<10) sekunden = "0" + zeit.getSeconds();
  else sekunden = zeit.getSeconds();
  let zeitGes = stunden + ":" + minuten + ":" + sekunden;
  klass='defekt';
  sqlQueryDefektteile(linie,station,datum,zeitGes,klass);
  topic="l" + linie + "/ausschuss/s" + station;
  mqttPublish(server,user,password,topic);
}

function mqttPubRep(server,user,password,linie,station) {
  var topic;
  let zeit = new Date();
  let stunden;
  let minuten;
  let sekunden;
  let jahr = zeit.getFullYear();
  let monat = zeit.getMonth()+1;
  let tag = zeit.getDate();
  let datum = tag + "." + monat + "." + jahr;
  if(zeit.getHours()<10) stunden = "0" + zeit.getHours();
  else stunden = zeit.getHours();
  if(zeit.getMinutes()<10) minuten = "0" + zeit.getMinutes();
  else minuten = zeit.getMinutes();
  if(zeit.getSeconds()<10) sekunden = "0" + zeit.getSeconds();
  else sekunden = zeit.getSeconds();
  let zeitGes = stunden + ":" + minuten + ":" + sekunden;
  klass='repariert';
  sqlQueryDefektteile(linie,station,datum,zeitGes,klass);
  topic="rep/" + linie;
  mqttPublish(server,user,password,topic);
}

function mqttPublish(server,user,pw,topic) {

  const host = server;
  const port = 8884;
  const clientId = 'mqtt_js_' + Math.random().toString(16).substr(2, 8);
  const username = user;
  const password = pw;
  
  const client = new Paho.Client(host, port, clientId);

  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  const connectOptions = {
      onSuccess: onConnect,
      userName: username,
      password: password,
      useSSL: true,
  };
  client.connect(connectOptions);

  function onConnect() {
      console.log('Verbunden zum MQTT Broker');
      client.subscribe(topic)
      client.publish(topic, topic)
  }

  function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
      console.log('Verbindung verloren: ' + responseObject.errorMessage);
      }
  }

  function onMessageArrived(message) {
    console.log('Nachricht empfangen: ' + message.payloadString);
    var nachricht=String(message.payloadString);
    var nachrichtArray=nachricht.split("/");
    if(nachrichtArray[1] == "fertig") statusOn(1);
    else if(nachrichtArray[1] == "ausschuss") statusOn(2);
    else if(nachrichtArray[0] == "rep") statusOn(3);
  }
}

//Status anzeigen und Status Highlight an
function statusOn(v) {
  clearInterval(ivlStatus);
  var zeit=new Date();
  var stunden;
  var minuten;
  var sekunden;
  if(zeit.getHours()<10) stunden = "0" + zeit.getHours();
  else stunden = zeit.getHours();
  if(zeit.getMinutes()<10) minuten = "0" + zeit.getMinutes();
  else minuten = zeit.getMinutes();
  if(zeit.getSeconds()<10) sekunden = "0" + zeit.getSeconds();
  else sekunden = zeit.getSeconds();
  var zeitStr = stunden + ":" + minuten + ":" + sekunden;
  if(v == 1 || v == 3) {
    document.getElementById("status").style.color = "rgb(255,255,255)";
    document.getElementById("statusDiv").style.backgroundColor = "rgb(0,128,0)";
  }
  else if(v == 2) {
    document.getElementById("status").style.color = "rgb(255,255,255)";
    document.getElementById("statusDiv").style.backgroundColor = "rgb(128,0,0)";
  }
  document.getElementById("status").innerHTML = "Letzte erfolgreiche Meldung um " + zeitStr;
  ivlStatus=setInterval(statusOff,3*1000);
}

//Status Hightlight aus
function statusOff() {
  document.getElementById("status").style.color = "rgb(0,0,0)";
  document.getElementById("statusDiv").style.backgroundColor = "rgb(255,255,255)";
  clearInterval(ivlStatus);
}