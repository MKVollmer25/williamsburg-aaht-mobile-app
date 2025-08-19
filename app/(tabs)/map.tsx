import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";

// Sample POI data - replace this with your actual POI list
const samplePOIs = [
  {
    id: 1,
    title: "Coffee Shop",
    description: "Best coffee in town",
    latitude: 37.78825,
    longitude: -122.4324,
  },
  {
    id: 2,
    title: "Restaurant",
    description: "Great food and atmosphere",
    latitude: 37.78925,
    longitude: -122.4334,
  },
  {
    id: 3,
    title: "Park",
    description: "Beautiful green space",
    latitude: 37.78725,
    longitude: -122.4314,
  },
];

interface POI {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}

interface Props {
  pois?: POI[]; // Optional prop to pass POIs from parent component
}

export default function MapScreen({ pois = samplePOIs }: Props) {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Request foreground location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        setLoading(false);
        return;
      }

      // Get the current location
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({});
      setLocation({ latitude, longitude });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!location) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        No location available
      </View>
    );
  }

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        ...location,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation={true} // This shows the blue dot for user location
      showsMyLocationButton={true} // Adds a button to center on user location
      userLocationAnnotationTitle="You are here"
    >
      {/* Blue circle around user location for better visibility */}
      <Circle
        center={location}
        radius={100} // 100 meters radius
        strokeColor="rgba(0, 122, 255, 0.5)"
        fillColor="rgba(0, 122, 255, 0.1)"
        strokeWidth={2}
      />

      {/* Red markers for POIs */}
      {pois.map((poi) => (
        <Marker
          key={poi.id}
          coordinate={{
            latitude: poi.latitude,
            longitude: poi.longitude,
          }}
          title={poi.title}
          description={poi.description}
          pinColor="red" // Red marker for POIs
        />
      ))}
    </MapView>
  );
}
