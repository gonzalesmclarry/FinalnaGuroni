import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/screen/login'); // Adjust path to your homepage
    }, 3000);

    return () => clearTimeout(timer); // Clear the timer if component unmounts
  }, [router]);

  return (
    <>
      {/* Hide the status bar */}
      <StatusBar hidden={false} />

      {/* Fullscreen Background with solid color */}
      <View style={styles.background}>
        {/* NotifyME logo */}
        <Image
          source={require('../screen/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Daily Reminder */}
        <Text style={styles.dailyReminderTitle}>Daily Reminder</Text>
        <Text style={styles.dailyReminderText}>
          "It doesn't matter how slow you go so long as you don't stop."
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#a3d8e7',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
    marginTop: -50,
  },
  dailyReminderTitle: {
    fontSize: 24,
    color: 'black',
    fontWeight: '600',
    marginBottom: -10,
  },
  dailyReminderText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
    paddingHorizontal: 40,
  },
});