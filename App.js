import React, { useState, useEffect } from 'react';
import {
    View, TextInput, TouchableOpacity, Text,
    PermissionsAndroid, Platform, StyleSheet
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = "AIzaSyDTcjyN0iAtSa6MtS6Vs450cQ8_mLyfd1Y"; // Buraya kendi API anahtarını ekle

const App = () => {
    const [location, setLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [region, setRegion] = useState(null);
    const [duration, setDuration] = useState(null);

    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Konum izni reddedildi.");
                    return;
                }
            }

            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    const newRegion = {
                        latitude,
                        longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    };
                    setLocation(newRegion);
                    setRegion(newRegion);
                },
                error => console.log(error),
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            );
        };

        requestLocationPermission();
    }, []);

    const zoomIn = () => {
        setRegion(prevRegion => ({
            ...prevRegion,
            latitudeDelta: prevRegion.latitudeDelta / 2,
            longitudeDelta: prevRegion.longitudeDelta / 2,
        }));
    };

    const zoomOut = () => {
        setRegion(prevRegion => ({
            ...prevRegion,
            latitudeDelta: prevRegion.latitudeDelta * 2,
            longitudeDelta: prevRegion.longitudeDelta * 2,
        }));
    };

    // Kullanıcı haritaya uzun basarsa hedef konumu ayarla
    const handleLongPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setDestination({ latitude, longitude });
    };

    return (
        <View style={styles.container}>
            {/* Arama Çubuğu */}
            <View style={styles.searchBar}>
                <TextInput
                    placeholder="Bir yer arayın..."
                    placeholderTextColor="#888"
                    style={styles.searchInput}
                />
            </View>

            {/* Harita */}
            <MapView
                style={styles.map}
                region={region}
                showsUserLocation={true}
                onLongPress={handleLongPress} // Uzun basınca hedef belirle
            >
                {location && <Marker coordinate={location} title="Benim Konumum" />}
                {destination && <Marker coordinate={destination} title="Hedef" pinColor="blue" />}
                {location && destination && (
                    <MapViewDirections
                        origin={location}          // Kullanıcının mevcut konumu
                        destination={destination}  // Seçilen hedef konum
                        apikey={GOOGLE_MAPS_APIKEY} // Google API Key
                        strokeWidth={4}
                        strokeColor="black"         // Rota rengi
                        onError={(errorMessage) => console.log("Hata: ", errorMessage)}
                        onReady={(result) => setDuration(result.duration)} // Rota süresi hesaplama
                    />
                )}
            </MapView>

            {/* Yol Süresi */}
            {duration && (
                <View style={styles.durationBox}>
                    <Text style={styles.durationText}>Tahmini Süre: {Math.round(duration)} dk</Text>
                </View>
            )}

            {/* Yakınlaştırma/Uzaklaştırma Butonları */}
            <View style={styles.zoomControls}>
                <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
                    <Icon name="add" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
                    <Icon name="remove" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    searchBar: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 15,
        height: 45,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    searchInput: { fontSize: 16, color: 'black' },
    zoomControls: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        flexDirection: 'column',
        gap: 10,
    },
    zoomButton: {
        width: 50,
        height: 50,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    durationBox: {
        position: 'absolute',
        bottom: 80,
        left: '20%',
        right: '20%',
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
    },
    durationText: { color: 'white', fontSize: 16 },
});

export default App;
