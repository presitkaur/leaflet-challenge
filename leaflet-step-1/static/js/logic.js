//Store the data url in a variable 
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Function 1: Set marker size
function markerSize(size) {
    return size * 2;
}

//Function 2: Conditional statement for marker color 
function markerColour(mag) {
    if (mag <= 3) {
        return '#3283c9'
    } else if (mag > 3) {
        return '#63b319'
    } else if (mag > 5) {
        return '#e37514'
    } else if (mag > 7) {
        return '#b31984'
    } else if (mag > 9) {
        return '#b31923'
    }
}


//Using D3, perform a GET request to obtain the data in the URL 
d3.json(url, function(data) {
    var earthquake = L.geoJSON(data.features, {
        onEachFeature: popUp,
        style: marker,
        pointToLayer: marker
    });
    //Pass the data into a function "createMap"
    createMap(earthquake)
});

//function for the markers for each earthquake 
function marker(feature, location) {
    var design = {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColour(feature.properties.mag),
        fillOpacity: 1,
        stroke: false,
        color: '#756c6c'
    }
    return L.circleMarker(location, design)
}

//Function for popup on the markers
function popUp(feature, layer) {
    return layer.bindPopup("<h2>" + feature.properties.place + "</h2> <hr> <h3> Richter Scale: " +  feature.properties.mag + "</h3><p>" + new Date(feature.properties.time) + "</p>");
}

//Function to create the map tile layer and bring all the above functions together 
function createMap(earthquake) {

    //Create the map tile 
    var map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        accessToken: API_KEY,
        maxZoom: 15,
        id: "mapbox/streets-v11",
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>"
    });

    //Define the basemap tile
    var baseMap = {
        "Street Map" : map,
    };

    //Create the overlay variable to populate the map with the data
    var overlay = {
        earthquakes : earthquake
    };

    //Create the map using leaflet 
    var myMap = L.map("map", {
        center: [31.57853542647338,-99.580078125],
        zoom: 5,
        layers: [map, earthquake]
    });

    //Create a legend to make interpretation easier 
    var legend = L.control({ position: "topright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        var magnitude = [0, 1, 2, 3, 4, 5];
        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColour(magnitude[i] + 1) + '"></i> ' + 
        + magnitude[i] + (magnitude[i + 1] ? ' - ' + magnitude[i + 1] + '<br>' : ' + ');
        }
    
        return div;
    };
    
    legend.addTo(myMap);
}

