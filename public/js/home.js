const cities = [
  { name: "New York",       lat: 40.7128,  lng: -74.0060, id: 1  },
  { name: "Amsterdam",      lat: 52.3676,  lng:   4.9041, id: 2  },
  { name: "Wellington",     lat: -41.2866, lng: 174.7756, id: 3  },
  { name: "London",         lat: 51.5074,  lng:  -0.1278, id: 4  },
  { name: "Tokyo",          lat: 35.6762,  lng: 139.6503, id: 5  },
  { name: "Tehran",         lat: 35.6892,  lng:  51.3890, id: 6  },
  { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729, id: 7  },
  { name: "Mexico City",    lat: 19.4326,  lng: -99.1332, id: 8  },
  { name: "Paris",          lat: 48.8566,  lng:   2.3522, id: 9  },
  { name: "Seoul",          lat: 37.5665,  lng: 126.9780, id: 10  },
  { name: "Monaco",         lat: 43.7384,  lng:   7.4246, id: 11  },
  { name: "Johannesburg",   lat: -26.2041, lng:  28.0473, id: 12  },
  { name: "Cape Town",      lat: -33.9249, lng:  18.4241, id: 13  },
  { name: "Los Angeles",    lat: 34.0522,  lng: -118.2437, id: 14 },
  { name: "Chicago",        lat: 41.8781,  lng: -87.6298, id: 15  },
];

var map = L.map("map", {
  center: [20, 0],
  zoom: 2,
  zoomControl: false,
  worldCopyJump: true,
  bounds: bounds,
  maxBoundsViscosity: 1,
});


    cities.forEach(city => {
  const marker = L.marker([city.lat, city.lng]).addTo(map);

  marker.on('click', () => {
    window.location.href = `/city/${city.id}`;
  });

  marker.on('mouseover', () => marker.openPopup());
  marker.on('mouseout', () => marker.closePopup());

  marker.bindPopup(city.name);
});



L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	noWrap: true,
  maxBoundsViscosity: 1.0,
  attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 16
}).addTo(map);
