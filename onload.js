window.onload = function() {
    function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    mqttServer = getParameterByName('server');
    mqttUser = getParameterByName('user');
    mqttPassword = getParameterByName('password');
    mqttLinie = getParameterByName('linie');
    mqttStation = getParameterByName('station');

    document.getElementById("btnAktionen").style.backgroundColor = "#d3d3d3";
    document.getElementById("btnMqtt").style.backgroundColor = "#00a2ff";
    document.getElementById("aktion").style.display = "block";
    document.getElementById("mqtt").style.display = "none";

    PubSubMQTT();
  }