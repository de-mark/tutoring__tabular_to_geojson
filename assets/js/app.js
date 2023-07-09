let defaultMap = L.tileLayer( "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
{
    attribution:
    'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
});

let baseMaps = {
    "Default Map": defaultMap,
};

let map = L.map("map", {
    center: [
        40.7, -94.5
    ],
    zoom: 3,
    layers: [defaultMap]
});

let data2017 = new L.layerGroup();

let overlays = {
    "2017": data2017
};

L.control.layers(baseMaps, overlays).addTo(map);

d3.json("./data/clean/emissions.json").then((emissionsData) => {
    console.log(emissionsData)
    L.geoJSON(emissionsData).addTo(data2017);
});