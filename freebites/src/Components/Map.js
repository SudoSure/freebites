import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
//import Device from "expo-device";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import Modal from "react-native-modal";

export default function Map() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [markerData, setMarkerData] = useState("");
    const [position, setPosition] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
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
            setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        })();
    }, []);

    const handleMapLongPress = (event) => {
        const { coordinate } = event.nativeEvent;
        setPosition(coordinate);
        setModalVisible(true);
    };

    const handleSaveMarkerData = () => {
        setMarkers([...markers, { coordinate: position, data: markerData }]);
        setModalVisible(false);
        setMarkerData("");
    };

    let text = "Waiting..";
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={styles.container}>
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
                region={location}
                onLongPress={handleMapLongPress}>
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={marker.coordinate}
                        title={marker.data}
                        onPress={() => {
                            // Handle marker press here
                        }}
                    />
                ))}
            </MapView>
            <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => setModalVisible(false)}
            style={styles.modal}>
            <View style={styles.modalContent}>
                <Text>Enter marker data:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setMarkerData}
                    value={markerData}
                />
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveMarkerData}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    </View>
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
    modal: {
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginVertical: 10,
        width: "80%",
        paddingHorizontal: 10,
    },
    saveButton: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
});
