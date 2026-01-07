import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // Import Material Icons
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore'; // Import necessary Firestore functions
import { getAuth } from 'firebase/auth'; // Import Firebase authentication functions

interface Reminder {
  id: string;
  title: string;
  categoryID: string;
  date: string;
  time: string;
}

const StarReminderScreen = () => {
  const navigation = useNavigation();
  const [reminders, setReminders] = useState<Reminder[]>([]); // Define the type for reminders

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const db = getFirestore(); // Get Firestore instance
        const auth = getAuth(); // Get Auth instance
        const user = auth.currentUser; // Get currently logged-in user

        if (user) {
          const remindersQuery = query(collection(db, 'star_reminder'), where('userID', '==', user.uid)); // Fetch user-specific data from Firestore
          const snapshot = await getDocs(remindersQuery); // Execute query
          const fetchedReminders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Reminder[]; // Cast to Reminder[]
          setReminders(fetchedReminders); // Update state with fetched reminders
        }
      } catch (error) {
        console.error('Error fetching reminders: ', error); // Handle errors
      }
    };

    fetchReminders(); // Call the fetch function
  }, []); // Empty dependency array to run once on mount

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={30} />
      </TouchableOpacity>
      <Text style={styles.header}>Starred Reminder</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Title</Text>
        <Text style={styles.tableHeaderText}>Category</Text>
        <Text style={styles.tableHeaderText}>Date</Text>
      </View>
      <ScrollView>
        {reminders.map(reminder => ( // Map through reminders to display them
          <View key={reminder.id} style={styles.reminderRow}>
            <Text style={styles.reminderText}>{reminder.title}</Text>
            <Text style={styles.reminderText}>{reminder.categoryID}</Text>
            <Text style={styles.reminderText}>{reminder.date}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#A0D3E8',
    alignItems: 'stretch',
  },
  backButton: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: 'transparent',
    marginTop: 60,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#7FB3D5',
    padding: 10,
    width: '100%',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  reminderText: {
    flex: 1,
    textAlign: 'center',
  },
});

export default StarReminderScreen;
