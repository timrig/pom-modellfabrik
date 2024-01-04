async function sqlQueryFertigteile(linie,variante,datum,uhrzeit) {
    var data = {
        Linie: linie,
        Variante: variante,
        Datum: datum,
        Uhrzeit: uhrzeit
    };
    var endpoint = '/data-api/rest/Teile';
    var response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    var result = await response.json();
    console.table(result.value);
}


async function sqlQueryDefektteile(linie,station,datum,uhrzeit,klass) {
    var data = {
        Linie: linie,
        Station: station,
        Datum: datum,
        Uhrzeit: uhrzeit,
        Klassifikation: klass
    };
    var endpoint = '/data-api/rest/Defekt';
    var response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    var result = await response.json();
    console.table(result.value);
}