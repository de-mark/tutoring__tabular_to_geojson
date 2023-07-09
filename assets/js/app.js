let defaultMap = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
    attribution: '© OpenStreetMap contributors, © CartoDB'
});

let data1999 = new L.layerGroup();
let data2005 = new L.layerGroup();
let data2017 = new L.layerGroup();


let map = L.map("map", {
    center: [
        40.7, -8.5
    ],
    zoom: 1,
    layers: [defaultMap, data1999]
});

let overlays = {
    "1999": data1999,
    "2005": data2005,
    "2017": data2017
};

L.control.layers(null, overlays, {collapsed: false}).addTo(map);

const generateCircleStyle = (feature, year) => {
    let size = year == 1991 ? feature.properties.CO2_1990 : 
        year == 2005 ? feature.properties.CO2_2005 : feature.properties.CO2_2017;

    console.log(size);

    let colour = size > 500 ? "red" : 
                size > 300 ? "orange" :
                size > 200 ? "yellow" : 
                size > 100 ? "chartreuse" :
                size > 50 ? "green" : "darkgreen";


    return {
        radius: size > 300 ? 20 : 
                size > 100 ? 15 :
                size > 25 ? 10 : 7,
        fillColor: colour,
        fillOpacity: .65,
        opacity: .75,
        stroke:false
    }
}

d3.json("./data/clean/emissions.json").then((emissionsData) => {

    L.geoJSON(emissionsData, {
        pointToLayer: (feature, coord) => {
            return L.circleMarker(coord);
        },
        style: (feature) => {
            return generateCircleStyle(feature, 1991)
        },
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`
                <div style="text-align:center">
                <h2>1991</h2>
                <hr>
                <h3>${feature.properties.country_name}</h3>
                <hr>
                <p><b>CO<sub>2</sub></b> ${feature.properties.CO2_1990}</p>
                </div>
            `)
        },
    }).addTo(data1999);

    L.geoJSON(emissionsData, {
        pointToLayer: (feature, coord) => {
            return L.circleMarker(coord);
        },
        style: (feature) => {
            return generateCircleStyle(feature, 2005)
        },
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`
                <div style="text-align:center">
                <h2>2005</h2>
                <hr>
                <h3>${feature.properties.country_name}</h3>
                <hr>
                <p><b>CO<sub>2</sub></b> ${feature.properties.CO2_2005}</p>
                </div>
            `)
        },
    }).addTo(data2005);

    L.geoJSON(emissionsData, {
        pointToLayer: (feature, coord) => {
            return L.circleMarker(coord);
        },
        style: (feature) => {
            return generateCircleStyle(feature, 2005)
        },
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`
                <div style="text-align:center">
                <h2>2017</h2>
                <hr>
                <h3>${feature.properties.country_name}</h3>
                <hr>
                <p><b>CO<sub>2</sub></b> ${feature.properties.CO2_2017}</p>
                </div>
            `)
        },
    }).addTo(data2017);
});