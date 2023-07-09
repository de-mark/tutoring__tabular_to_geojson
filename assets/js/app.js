// Remember : This is the background for the map
let defaultMap = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
    attribution: '© OpenStreetMap contributors, © CartoDB'
});

// Each of these layer groups will hold markers
// for each of the years in question
let data1999 = new L.layerGroup();
let data2005 = new L.layerGroup();
let data2017 = new L.layerGroup();

// This creates the actual Leaflet map part
// It initially displays with 1999 data
let map = L.map("map", {
    center: [
        40.7, -8.5
    ],
    zoom: 1,
    layers: [defaultMap, data1999]
});

// This is what shows up in the upper right hand corner
let overlays = {
    "1999": data1999,
    "2005": data2005,
    "2017": data2017
};

// This is the actual box that shows up in the upper right
// The reason why null is here is because we only have one
// background and there's no reason to toggle between them
//
// Also, collapsed false makes it so you don't have to toggle
// the control open
L.control.layers(null, overlays, {collapsed: false}).addTo(map);

// This will be used by the L.geoJSON later to change the style
// of the circles on the map (it takes in the year so that the 
// we grab onto the right CO2 values for the display)
const generateCircleStyle = (feature, year) => {
    let size = year == 1991 ? feature.properties.CO2_1990 : 
        year == 2005 ? feature.properties.CO2_2005 : feature.properties.CO2_2017;

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

// Here's where we actually pull in the data
d3.json("./data/clean/emissions.json").then((emissionsData) => {

    // This L.geoJSON creates the 1990 data layer
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
                <h3>1991</h3>
                <hr>
                <h4>${feature.properties.country_name}</h4>
                <hr>
                <p><b>CO<sub>2</sub></b> ${feature.properties.CO2_1990}</p>
                </div>
            `)
        },
    }).addTo(data1999);

    // This L.geoJSON creates the 2005 data layer
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
                <h3>2005</h3>
                <hr>
                <h4>${feature.properties.country_name}</h4>
                <hr>
                <p><b>CO<sub>2</sub></b> ${feature.properties.CO2_2005}</p>
                </div>
            `)
        },
    }).addTo(data2005);

    // This L.geoJSON creates the 2017 data layer
    L.geoJSON(emissionsData, {
        pointToLayer: (feature, coord) => {
            return L.circleMarker(coord);
        },
        style: (feature) => {
            return generateCircleStyle(feature, 2017)
        },
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`
                <div style="text-align:center">
                <h3>2017</h3>
                <hr>
                <h4>${feature.properties.country_name}</h4>
                <hr>
                <p><b>CO<sub>2</sub></b> ${feature.properties.CO2_2017}</p>
                </div>
            `)
        },
    }).addTo(data2017);
});