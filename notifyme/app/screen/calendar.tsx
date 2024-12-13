// Calendar.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Animated, Modal, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import styles from '../styles/calendarstyles';
import AddReminder from './addreminder';

// Add this interface for marked dates
interface MarkedDates {
  [date: string]: {
    marked: boolean;
    dotColor: string;
  };
}

const CalendarScreen = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const remindersRef = collection(db, 'reminders');
        const querySnapshot = await getDocs(remindersRef);
        
        const marked: MarkedDates = {};
        querySnapshot.forEach((doc) => {
          const reminderData = doc.data();
          const date = reminderData.date.toDate().toISOString().split('T')[0];
          
          marked[date] = {
            marked: true,
            dotColor: 'red'
          };
        });
        
        setMarkedDates(marked);
      } catch (error) {
        console.error("Error fetching reminders: ", error);
      }
    };

    fetchReminders();
  }, []);

  return (
    <View style={styles.container}>
      <RNCalendar
        style={styles.calendar}
        theme={{
          calendarBackground: '#A8D8E4',
          textSectionTitleColor: '#000',
          dayTextColor: '#000',
          todayTextColor: 'red',
          selectedDayTextColor: '#fff',
          monthTextColor: '#000',
          textDisabledColor: '#666',
          arrowColor: '#000',
        }}
        markedDates={markedDates}
      />

      <AddReminder 
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <Link href="/screen/home" style={styles.bottomTabButtonLeft}>
          <View style={styles.iconContainer}>
            <Image source={require('../screen/images/home.png')} style={styles.bottomTabIcon} />
            <Text style={styles.bottomTabText}>Reminders</Text>
          </View>
        </Link>
        <Link href="/screen/calendar" style={styles.bottomTabButtonCenter}>
          <View style={styles.iconContainer}>
            <Image source={require('../screen/images/whitecalendar.png')} style={styles.bottomTabIcon} />
            <Text style={styles.bottomTabText}>Calendar</Text>
          </View>
        </Link>
        <Link href="/screen/profile" style={styles.bottomTabButtonRight}>
          <View style={styles.iconContainer}>
            <Image source={require('../screen/images/user.png')} style={styles.bottomTabIcon} />
            <Text style={styles.bottomTabText}>Profile</Text>
          </View>
        </Link>
      </View>
    </View>
  );
};

export default CalendarScreen;