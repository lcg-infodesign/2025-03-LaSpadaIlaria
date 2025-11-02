let data;
let minelevation, maxelevation;
let allelevation;
let allnames, allnumbers, allcountry;
let baseradius = 25;
let maxradius = 500;
let hoveredVolcano = null; // per salvare il vulcano sotto il mouse


function preload() {
    data = loadTable("vulcanidata.csv", "csv", "header")
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Elevazioni numeriche
    allelevation = data.getColumn("Elevation (m)").map(Number); //gli dico di riprendere questa colonna
    minelevation = min(allelevation); //gli dico di prendere il numero minimo
    maxelevation = max(allelevation); //gli dico di prendere il numero massimo

    // Nomi, numeri e paesi
    allnames = [];
    allnumbers = [];
    allcountry = [];

    // ciclo per leggere le stringhe dai dati
    for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
        allnames.push(data.getString(rowNumber,"Volcano Name")); //prendo i nomi
        allnumbers.push(data.getString(rowNumber,"Volcano Number")); //prendo i numeri
        allcountry.push(data.getString(rowNumber,"Country")); //prendo i paesi
    }

    /*console.log(data.getColumn("Elevation (m)"));
    console.log("Min elevation:", minelevation);
    console.log("Max elevation:", maxelevation);*/
}


function draw() {
    background(10);

    // disegniamo un pallino per ogni vulcano, la posizione è data dall’elevazione
    for (let i = 0; i < data.getRowCount(); i++) {
        let elev = allelevation[i]; //Prendi l’elevazione corrispondente al vulcano i dall’array allelevation
        let radius = map(elev, minelevation, maxelevation, baseradius, maxradius); 
        //con map prendo un numero in un certo intervallo e lo riporta in un altro intervallo
        //se elev == minelevation → radius = baseradius
        //se elev == maxelevation → radius = maxradius
        //se elev è in mezzo → radius proporzionale tra base e max

        let angle = map(i, 0, data.getRowCount(), 0, 360); 
        //trasformi l’indice i in un angolo tra 0° e 360° per distribuire uniformemente tutti i vulcani intorno al cerchio
        let x = cos(angle) * radius + width/2; 
        let y = sin(angle) * radius + height/2;

        let type = data.getString(i, "TypeCategory"); //questo mi serve per dare i colori

        // impostiamo i colori in base al tipo di vulcano
        if (type === "Stratovolcano") {
            fill(255, 173, 177); // rosso stratovolcano
        } else if (type === "Caldera") {
            fill(189, 178, 255); // viola
        } else if (type === "Shield Volcano") {
            fill(255, 214, 165); // arancione
        } else if(type === "Submarine Volcano") {
            fill(160, 196, 255); // blu
        } else if (type === "Maars / Tuff ring") {
            fill(255, 214, 165); // arancio
        } else if (type === "Cone") {
            fill(202, 255, 191); // verde 
        } else if(type === "Crater System") {
            fill(255, 198, 255); // rosa
        } else if(type === "Subglacia") {
            fill(155, 246, 255); // azzurro
        } else if(type === "Other / Unknown") {
            fill(255, 255, 252); // bianco
        }

        // per il cerchio e il mouseover
        let d = dist(mouseX, mouseY, x, y); //dist è una funzione p5 per calcolare la distanza tra due punti, in questo caso il mouse over e la x o y
        if(d < 6){ //Se il mouse è abbastanza vicino al pallino, allora memorizzo i dati del vulcano in un oggetto chiamato hoveredVolcano
            hoveredVolcano = {
                name: allnames[i],
                number: allnumbers[i],
                elevation: allelevation[i],
                country: allcountry[i]
            };
        }

        ellipse(x, y, 8); // disegniamo il pallino
    }

    
    // se c’è un vulcano sotto il mouse, scriviamo le info nel pannello
if(hoveredVolcano){
    fill(210, 50); // rettangolo semitrasparente
    noStroke();
    rect(width - 350, 80, 250, 120, 10); // rettangolo arrotondato con posizione e grandezza
    
    fill(255);
    textSize(15);
    textAlign(LEFT, TOP); //chissà perchè in maiuscolo
    text(
        hoveredVolcano.name + "\n" +
        "Number: " + hoveredVolcano.number + "\n" +
        "Elevation: " + hoveredVolcano.elevation + " m\n" +
        "Country: " + hoveredVolcano.country,
        width - 330, //z
        105 //y
    );
}

}
