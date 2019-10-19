// Define URLs that houses API_KEY
var MyFirstUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

var MySecondUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Query URL and send data using createFeatures function
d3.json(MyFirstUrl, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Set up Place, Time and Magnitude to pop up for each location on map 
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h1><hr><p>" + new Date(feature.properties.time) + "</p>" + 
	  "</h1><hr><p> Magnitude: " + feature.properties.mag + "</p>");
	  
  }

  // Define GeoJSON layer to house earthquakeData object array and run onEachFeature function on each
    var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
	pointToLayer: function (feature, latlng) {
      var color;
      var r = 155;
      var g = Math.floor(100-60*feature.properties.mag);
      var b = Math.floor(100-60*feature.properties.mag);
      color= "rgb("+r+" ,"+g+","+ b+")"
	  
	   var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: "gold",
        weight: 4,
        opacity: 4,
        fillOpacity: 0.5
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });

  // Send earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap, baseMaps, Overlays, darkmap etc variables
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
  
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };
  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      35.08, -90.70
    ],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });
  
   function getColor(d) {
      return d < 1 ? 'rgb(300,300,300)' :
            d < 2  ? 'rgb(300,275,275)' :
            d < 3  ? 'rgb(300,195,195)' :
            d < 4  ? 'rgb(300,165,165)' :
            d < 5  ? 'rgb(300,135,135)' :
            d < 6  ? 'rgb(300,105,105)' :
            d < 7  ? 'rgb(300,75,75)' :
            d < 8  ? 'rgb(300,45,45)' :
            d < 9  ? 'rgb(300,15,15)' :
                        'rgb(255,0,0)';
  }

  // Create a legend to display information about our map
  var legend = L.control({position: 'bottomleft'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8,9],
      labels = [];

      div.innerHTML+='Magnitude<br><hr>'
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;
  };
  
  legend.addTo(myMap);

}