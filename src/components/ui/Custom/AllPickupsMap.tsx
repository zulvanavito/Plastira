import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Pickup } from "@/utils/historyUtils";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";
import "leaflet.heat";
import { useEffect } from "react";

// Komponen internal untuk Layer Heatmap
const HeatmapLayer = ({ pickups }: { pickups: Pickup[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const points = pickups.map(
      (p) =>
        [p.location.lat, p.location.lng, p.weightKg] as [number, number, number]
    );

    const heatLayer = L.heatLayer(points, {
      radius: 30,
      blur: 20,
      maxZoom: 18,
    });

    map.addLayer(heatLayer);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, pickups]);

  return null;
};

interface AllPickupsMapProps {
  pickups: Pickup[];
  displayMode: "markers" | "heatmap";
}

export const AllPickupsMap = ({ pickups, displayMode }: AllPickupsMapProps) => {
  const mapCenter: [number, number] =
    pickups.length > 0
      ? [pickups[0].location.lat, pickups[0].location.lng]
      : [-2.548926, 118.0148634]; // Center of Indonesia

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

      {displayMode === "markers" &&
        pickups.map((pickup) => (
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
            </Popup>
          </Marker>
        ))}

      {displayMode === "heatmap" && <HeatmapLayer pickups={pickups} />}
    </MapContainer>
  );
};
