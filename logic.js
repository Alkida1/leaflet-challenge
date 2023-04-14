// Creating the map object
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Use this link to get the GeoJSON data.
  let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
  
  // Function to determine marker size based on earthquake magnitude
  function markerSize(mag) {
    return mag * 2.5;
  }
  
  // Function to determine marker color based on earthquake depth
  function markerColor(depth) {
    if (depth < 10) return "#ffe6e6";
    else if (depth < 30) return "#ffb3b3";
    else if (depth < 50) return "#ff9999";
    else if (depth < 70) return "#ff6666";
    else if (depth < 90) return "#ff1a1a";
    else return "#e60000";
  }
  
  // Create a legend control object and add it to the map

  let legend = L.control({ position: "bottomright" });
  
  legend.onAdd = function(map) {
    let div = L.DomUtil.create("div", "legend");
    let labels = [
      "<10 km",
      "10-30 km",
      "30-50 km",
      "50-70 km",
      "70-90 km",
      ">90 km"
    ];
    const colors = [
      "#ffe6e6",
      "#ffb3b3",
      "#ff9999",
      "#ff6666",
      "#ff1a1a",
      "#e60000"
    ];

    for (let i = 0; i < labels.length; i++) {
      div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' + labels[i] + '<br>';
    }
    return div;
  };
  
  legend.addTo(myMap);
  
  
  
  // Getting our GeoJSON data
  d3.json(link).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    let layer = L.geoJson(data, {
      // Creating a circle marker for each feature (in this case, an earthquake)
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.geometry.coordinates[2]),
          color: "black",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      // This is called on each feature.
      onEachFeature: function(feature, layer) {
        // Giving each feature a popup with information that's relevant to it
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p><p>Magnitude: " + feature.properties.mag + "</p><p>Depth: " + feature.geometry.coordinates[2] + " km</p>");
      }
    }).addTo(myMap);
  });
  
  