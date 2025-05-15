import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location access is required.');
        return;
      }

      try {
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        setLocation(loc.coords);
      } catch (err) {
        Alert.alert('Error', 'Failed to get location.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Icon name="location" size={100} color="#ffffff" style={styles.icon} />
      <Text style={styles.title}>Welcome to Weatherly</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Weather', { coords: location })}
        >
          <Text style={styles.buttonText}>View Weather</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4a90e2', // צבע רקע כהה יותר
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#ffffff', // טקסט לבן
  },
  icon: {
    marginBottom: 30,
    backgroundColor: '#2196f3', // צבע רקע לאייקון
    borderRadius: 50,
    padding: 20,
  },
  button: {
    backgroundColor: '#ff4081', // צבע רקע לכפתור
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    shadowColor: '#000', // הוספת צל
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff', // טקסט לבן בכפתור
    fontWeight: 'bold',
    fontSize: 18,
  },
});
