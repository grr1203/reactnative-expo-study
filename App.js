import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
console.log(SCREEN_WIDTH);

const API_KEY = '18800c3e8ae5f3ef66e5998c5f925e46';

export default function App() {
  const [city, setCity] = useState('Loading..');
  const [days, setDays] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      let location = await Location.reverseGeocodeAsync({ latitude, longitude });
      console.log(location);
      setCity(location[0].city);

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      console.log(data);
      setDays(data.daily);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" />
          </View>
        ) : (
          days.map((day, index) => (
            <View style={styles.day}>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column', backgroundColor: 'orange' },
  city: { flex: 0.8, justifyContent: 'center', alignItems: 'center' },
  cityName: { fontSize: 60, fontWeight: '500', color: 'white' },
  day: { flex: 1, alignItems: 'center', width: SCREEN_WIDTH },
  temp: { fontSize: 150, fontWeight: '600', color: 'white' },
  description: { fontSize: 40, fontWeight: '500', color: 'white', marginTop: 0 },
  tinyText: { fontSize: 20, fontWeight: '500', color: 'white', marginTop: 5}
});
