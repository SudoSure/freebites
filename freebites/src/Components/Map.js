import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import Device from "expo-device";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
//import Geolocation from '@react-native-community/geolocation';

export default function Map() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [position, setPosition] = useState({
        latitude: 10,
        longitude: 10,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
    });

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            // Get user's current location
            let location = await Location.getCurrentPositionAsync({});
            setPosition({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        })();
    }, []);

    let text = "Waiting..";
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
            showsCompass={true}
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={true}
            showsTraffic={true}
            rotateEnabled={true}
            loadingEnabled={true}
            region={position}>
        </MapView>
    );
    // return (
    //     <View>
    //         <Text>{text}</Text>
    //     </View>
    // );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    paragraph: {
        fontSize: 18,
        textAlign: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
