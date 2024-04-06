import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import Device from "expo-device";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

export default function Map() {
    const [errorMsg, setErrorMsg] = useState(null);

    const [position, setPosition] = useState(null);

    useEffect(() => {
        (async () => {
            if (Platform.OS === "android" && !Device.isDevice) {
                setErrorMsg(
                    "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
                );
                setPosition({
                    latitude: 37.785834,
                    longitude: -122.406417,
                    latitudeDelta: 0.0421,
                    longitudeDelta: 0.0421,
                });
                return;
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                setPosition({
                    latitude: 37.785834,
                    longitude: -122.406417,
                    latitudeDelta: 0.0421,
                    longitudeDelta: 0.0421,
                });
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setPosition({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0421,
                longitudeDelta: 0.0421,
            });
        })();
    }, []);

    return position == null ? (
        <View />
    ) : (
        <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={position}
            showsUserLocation={true}
            showsMyLocationButton={true}
            followsUserLocation={true}
            showsCompass={true}
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}>
            <Marker
                title="Yor are here"
                description="This is a description"
                coordinate={position}
            />
        </MapView>
    );
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
