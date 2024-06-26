import React from 'react';
import { Modal } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './map_modal';
import L from 'leaflet';

const MapModal = ({ show, onClose, rentHouses, userLocation }) => {
  const defaultCenter = [51.505, -0.09]; // Default center if userLocation is not available

  const center = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : defaultCenter;

      // Custom icon for user location
  const userIcon = new L.Icon({
    // iconUrl: 'path/to/user-icon.png', // Replace with the path to your custom icon
    // iconSize: [25, 41], // Adjust size
    // iconAnchor: [12, 41], // Adjust anchor
    // popupAnchor: [1, -34], // Adjust popup anchor
    shadowSize: [41, 41], // Adjust shadow size

    iconUrl: `${process.env.PUBLIC_URL}/marker.png`,
    iconSize: [38, 38], // size of the icon
    iconAnchor: [19, 38], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -38] 
  });

  // Custom icon for house locations
  const houseIcon = new L.Icon({
    // iconUrl: 'path/to/house-icon.png', // Replace with the path to your custom icon
    iconUrl: 'https://p7.hiclipart.com/preview/751/909/140/homeaway-vacation-rental-house-renting-vrbo-house.jpg',
    iconSize: [25, 41], // Adjust size
    iconAnchor: [12, 41], // Adjust anchor
    popupAnchor: [1, -34], // Adjust popup anchor
    shadowSize: [41, 41] // Adjust shadow size
  });

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        {/* <Modal.Title>Map</Modal.Title> */}
        <h3>Rent House Nearby</h3>
      </Modal.Header>
      <Modal.Body>
        <div style={{ height: '400px' }}>
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
            />
            {userLocation && (
              <Marker position={center} icon={userIcon}>
                <Popup>Your Location</Popup>
              </Marker>
            )}
            {rentHouses.map((house) => (
              <Marker key={house.id} position={[house.latitude, house.longitude]} icon={houseIcon}>
                <Popup>
                  House No: {house.id}<br />
                  Address: {house.rent_address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default MapModal;
