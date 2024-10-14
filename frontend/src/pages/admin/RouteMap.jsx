import L from 'leaflet';
import 'leaflet.offline';

const map = L.map('map').setView([7.8731, 80.7718], 7);

const tileLayer = L.tileLayer.offline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const saveTilesControl = L.control.savetiles(tileLayer, {
  zoomlevels: [6, 7, 8] // Choose appropriate levels to cache
});

map.addControl(saveTilesControl);
export default LeafletMap;
