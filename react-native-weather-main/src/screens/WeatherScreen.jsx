import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, TextInput, Pressable } from 'react-native';
import { getWeather, getWeatherByCity } from '../api/weatherApi';
import Animated, { SlideInUp } from 'react-native-reanimated';

export default function WeatherScreen({ route }) {
  const { coords } = route.params || {};
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');

  useEffect(() => {
    if (!coords) return;
    fetchWeatherByCoords(coords.latitude, coords.longitude);
  }, []);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const data = await getWeather(lat, lon);
      setWeather(data);
    } catch (err) {
      console.log('Weather API error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const data = await getWeatherByCity(city);
      setWeather(data);
    } catch (err) {
      console.log('City fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search city"
        value={city}
        onChangeText={setCity}
      />
      <Pressable style={styles.button} onPress={fetchWeatherByCity}>
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : weather ? (
        <Animated.View entering={SlideInUp.springify().damping(20)} style={styles.weatherBox}>
          <Text style={styles.cityName}>{weather.name}</Text>
          <Text style={styles.desc}>{weather.weather[0].description}</Text>
          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
          <Image
            source={{ uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` }}
            style={styles.weatherIcon}
          />
        </Animated.View>
      ) : (
        <Text style={styles.noDataText}>No weather data</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: '#f0f4f8',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    backgroundColor: '#ffffff',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: '#1e88e5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  weatherBox: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  desc: {
    fontSize: 20,
    textTransform: 'capitalize',
    color: '#555',
  },
  temp: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#f44336',
  },
  weatherIcon: {
    width: 120,
    height: 120,
    marginTop: 10,
  },
  noDataText: {
    marginTop: 20,
    fontSize: 18,
    color: '#777',
  },
});
