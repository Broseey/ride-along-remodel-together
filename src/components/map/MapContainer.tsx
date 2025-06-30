import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapContainerProps {
  fromCoords: [number, number];
  toCoords: [number, number];
  from: string;
  to: string;
  fromType: "university" | "state";
  toType: "university" | "state";
  mapboxToken: string;
  onError: () => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
  fromCoords,
  toCoords,
  from,
  to,
  fromType,
  toType,
  mapboxToken,
  onError,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Set Mapbox token
    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12", // More detailed style
        center: [
          (fromCoords[0] + toCoords[0]) / 2,
          (fromCoords[1] + toCoords[1]) / 2,
        ],
        zoom: 8, // More zoomed in for detail
        scrollZoom: true,
        dragPan: true,
      });

      map.current.on("load", async () => {
        if (!map.current) return;

        // Add source markers with custom styling
        new mapboxgl.Marker({
          color: "#FF9900",
          scale: 1.2,
        })
          .setLngLat(fromCoords)
          .setPopup(
            new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <strong>${from}</strong>
              <br/>
              <small class="text-gray-600">${
                fromType === "university" ? "University" : "State/City"
              }</small>
            </div>
          `)
          )
          .addTo(map.current);

        new mapboxgl.Marker({
          color: "#000000",
          scale: 1.2,
        })
          .setLngLat(toCoords)
          .setPopup(
            new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <strong>${to}</strong>
              <br/>
              <small class="text-gray-600">${
                toType === "university" ? "University" : "State/City"
              }</small>
            </div>
          `)
          )
          .addTo(map.current);

        // Fetch actual route from Mapbox Directions API
        try {
          const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]}?geometries=geojson&access_token=${mapboxToken}`
          );

          if (response.ok) {
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
              const route = data.routes[0];

              // Add route source
              map.current.addSource("route", {
                type: "geojson",
                data: {
                  type: "Feature",
                  properties: {},
                  geometry: route.geometry,
                },
              });

              // Add route layer
              map.current.addLayer({
                id: "route",
                type: "line",
                source: "route",
                layout: {
                  "line-join": "round",
                  "line-cap": "round",
                },
                paint: {
                  "line-color": "#FF9900",
                  "line-width": 4,
                  "line-opacity": 0.8,
                },
              });

              // Fit map to route bounds
              const coordinates = route.geometry.coordinates;
              const bounds = new mapboxgl.LngLatBounds();
              coordinates.forEach((coord: [number, number]) =>
                bounds.extend(coord)
              );

              map.current.fitBounds(bounds, {
                padding: 80,
                maxZoom: 12,
              });
            } else {
              // Fallback to straight line if no route found
              addStraightLineRoute();
            }
          } else {
            // Fallback to straight line if API fails
            addStraightLineRoute();
          }
        } catch (error) {
          console.error("Error fetching route:", error);
          // Fallback to straight line
          addStraightLineRoute();
        }

        function addStraightLineRoute() {
          if (!map.current) return;

          // Add fallback straight line route
          map.current.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: [fromCoords, toCoords],
              },
            },
          });

          map.current.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#FF9900",
              "line-width": 4,
              "line-opacity": 0.8,
              "line-dasharray": [2, 2],
            },
          });

          // Fit map to show both points with padding
          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend(fromCoords);
          bounds.extend(toCoords);
          map.current.fitBounds(bounds, {
            padding: 80,
            maxZoom: 10,
          });
        }
      });

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e);
        onError();
      });
    } catch (error) {
      console.error("Failed to initialize map:", error);
      onError();
    }

    return () => {
      map.current?.remove();
    };
  }, [fromCoords, toCoords, from, to, fromType, toType, mapboxToken, onError]);

  return (
    <div
      ref={mapContainer}
      className="h-80 rounded-md mb-3 border border-gray-200"
    />
  );
};

export default MapContainer;
