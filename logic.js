var Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(Url, function(data){
    createFeatures(data.features);
});

function createFeatures(earthquakes) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }

    var earthquake = L.geoJSON(earthquakes, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            var color;
            var r = 255;
            var g = Math.floor(255-80*feature.properties.mag);
            var b = Math.floor(255-80*feature.properties.mag);
            color = "rgb("+r+", "+g+", "+b+")";
            var geojsonMarker = {
                radius: 4*feature.properties.mag,
                fillColor: color,
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8 
            };
            return L.circleMarker(latlng, geojsonMarker);
        }
    });
    createMap(earthquake);
}
function createMap(earthquake) {
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" + "access_token=" + API_KEY);
    var baseMap = {
        "Street Map": streetmap
    };
    var overlayMap = {
        Earthquakes: earthquake
    };
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquake]
    });
    function getColors(d) {
        switch (true) {
            case d < 1:
                return 'rgb(255,255,255)';
            case d < 2:
                return 'rgb(255,225,225)';
            case d < 3:
                return 'rgb(255,195,195)';
            case d < 4:
                return 'rgb(255,165,165)';
            case d < 5:
                return 'rgb(255,135,135)';
            case d < 6:
                return 'rgb(255,105,105)';
            case d < 7:
                return 'rgb(255,75,75)';
            case d < 8:
                return 'rgb(255,45,45)';
            case d < 9:
                return 'rgb(255,15,15)';
            default:
                return 'rgb(255, 0, 0)';
        }
    }
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map){
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
        labels = [];
        div.innerHTML+='Magnitude<br><hr>'
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColors(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        
    };
    return div;
    };
    legend.addTo(myMap);
}