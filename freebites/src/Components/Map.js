import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import Device from "expo-device";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

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
            if (Platform.OS === "android" && !Device.isDevice) {
                setErrorMsg(
                    "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
                );
                return;
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setPosition({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0421,
                longitudeDelta: 0.0421,
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
