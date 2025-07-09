import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Pickup } from "@/utils/historyUtils";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

interface AllPickupsMapProps {
  pickups: Pickup[];
}

export const AllPickupsMap = ({ pickups }: AllPickupsMapProps) => {
  const mapCenter: [number, number] =
    pickups.length > 0
      ? [pickups[0].location.lat, pickups[0].location.lng]
      : [-2.548926, 118.0148634];

  return (
    <MapContainer
      center={mapCenter}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {pickups.map((pickup) => (
        <Marker
          key={pickup._id}
          position={[pickup.location.lat, pickup.location.lng]}
        >
          <Popup>
            <strong>{pickup.userId.name}</strong>
            <br />
            Status: {pickup.status}
            <br />
            Jenis: {pickup.plasticType}
            <br />
            Berat: {pickup.weightKg} kg
            <br />
            Tanggal:{" "}
            {new Date(pickup.createdAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            <br />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
