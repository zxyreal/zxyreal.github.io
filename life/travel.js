import { prepareTrips } from './travel-model.mjs';

const { trips, invalid } = prepareTrips(window.TRAVEL_TRIPS);
const stops = [...new Map(trips.flatMap(trip => trip.stops).map(stop => [`${stop.countryCode}:${stop.name}`, stop])).values()];
const visitedCountries = new Set(stops.map(stop => stop.countryCode));
const visitedRegions = new Set(stops.map(stop => stop.regionId));
const status = document.getElementById('map-status');

function showStatus(message) {
  status.textContent = message;
  status.hidden = !message;
}
function node(tag, text, className) {
  const result = document.createElement(tag);
  if (text) result.textContent = text;
  if (className) result.className = className;
  return result;
}
async function loadMap() {
  if (!window.L) {
    showStatus('The interactive map could not load. Please refresh the page.');
    return;
  }
  const map = L.map('travel-map', {
    minZoom: 2, maxZoom: 10, scrollWheelZoom: false, keyboard: true, preferCanvas: true,
    maxBounds: [[-70,-180],[85,180]], maxBoundsViscosity: .8
  }).setView([54, 10], 4);
  [['countries',200],['regions',300],['labels',450]].forEach(([name,z]) => {
    map.createPane(name).style.zIndex = z;
  });
  map.getPane('labels').style.pointerEvents = 'none';
  map.attributionControl.addAttribution('<a href="https://www.naturalearthdata.com/">Natural Earth</a> · <a href="https://www.geoboundaries.org/">geoBoundaries</a> · <a href="sources.html">Sources</a>');
  if (window.ResizeObserver) new ResizeObserver(() => map.invalidateSize({ pan: false })).observe(document.getElementById('travel-map'));

  if (stops.length) map.fitBounds(stops.map(stop => stop.coordinates), { padding: [35,35], maxZoom: 8, animate: false });

  showStatus('Loading map…');
  try {
    const [countries, regions] = await Promise.all(['countries', 'regions'].map(async name => {
      const response = await fetch(`data/${name}.geojson`);
      if (!response.ok) throw new Error('Boundary data unavailable');
      return response.json();
    }));
    const bounds = L.latLngBounds(stops.map(stop => stop.coordinates));
    L.geoJSON(countries, {
      pane: 'countries',
      style: feature => ({
        fillColor: visitedCountries.has(feature.properties.id) ? '#b5cfe7' : '#f7f8fa', fillOpacity: 1,
        color: visitedCountries.has(feature.properties.id) ? '#83aacb' : '#cdd6de', weight: .8
      }),
      onEachFeature(feature, layer) {
        layer.bindTooltip(node('span', feature.properties.name), { sticky: true });
        if (visitedCountries.has(feature.properties.id)) bounds.extend(layer.getBounds());
      }
    }).addTo(map);
    L.geoJSON(regions, {
      pane: 'regions', filter: feature => visitedRegions.has(feature.properties.id),
      style: { color: '#2e6c9f', weight: 1.2, fillColor: '#4388bc', fillOpacity: .9 },
      onEachFeature(feature, layer) {
        layer.bindTooltip(node('span', `${feature.properties.name}, ${feature.properties.country}`), { sticky: true });
      }
    }).addTo(map);
    [['Germany',51.7,10.5],['France',46.4,2.2],['Denmark',56.3,9.2],['Sweden',62.4,15.6]].forEach(([name,lat,lng]) => {
      L.marker([lat,lng], { pane: 'labels', interactive: false, keyboard: false,
        icon: L.divIcon({ html: node('span', name), className: 'country-label', iconSize: [90,20], iconAnchor: [45,10] })
      }).addTo(map);
    });
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [35,35], maxZoom: 8, animate: false });
    showStatus(invalid ? 'Some places could not be displayed.' : '');
  } catch {
    showStatus('The map boundaries could not load. Please refresh the page.');
  }
}
loadMap();
