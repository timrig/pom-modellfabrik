document.getElementById("btnMqtt").addEventListener("click", function() {
    this.style.backgroundColor = "#d3d3d3";
    document.getElementById("btnAktionen").style.backgroundColor = "#00a2ff";
});
document.getElementById("btnAktionen").addEventListener("click", function() {
    this.style.backgroundColor = "#d3d3d3";
    document.getElementById("btnMqtt").style.backgroundColor = "#00a2ff";
});

function mqttBtn() {
    document.getElementById("mqtt").style.display = "block";
    document.getElementById("aktion").style.display = "none";
}
function aktionenBtn() {
    document.getElementById("aktion").style.display = "block";
    document.getElementById("mqtt").style.display = "none";
}