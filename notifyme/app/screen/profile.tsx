// ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { Link } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/profilestyles';
import { MaterialIcons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const ProfileScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [profileImage, setProfileImage] = useState(require('./images/avatar.png')); // Fixed image path
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('All');
  const [username, setUsername] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        console.log('Current user:', currentUser); // Debug log

        if (currentUser) {
          // Existing user data fetch
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          console.log('User doc data:', userDoc.data()); // Debug log

          if (userDoc.exists()) {
            setUsername(userDoc.data().username);
            if (userDoc.data().profileImage) {
              setProfileImage({ uri: userDoc.data().profileImage });
            } else {
              setProfileImage(require('./images/avatar.png'));
            }
          }

          // Updated query to use correct field name 'userID'
          const completedRef = collection(db, 'completed');
          const q = query(completedRef, where('userID', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
          console.log('Completed count:', querySnapshot.size);
          console.log('Completed docs:', querySnapshot.docs.map(doc => doc.data()));
          
          setCompletedCount(querySnapshot.size);

          // Fetch pending reminders
          const remindersRef = collection(db, 'reminders');
          const pendingQuery = query(remindersRef, where('userID', '==', currentUser.uid));
          const pendingSnapshot = await getDocs(pendingQuery);
          console.log('Pending count:', pendingSnapshot.size);
          setPendingCount(pendingSnapshot.size);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Image picker function with Firebase Storage upload
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Reduced quality to help with upload
      });

      if (!result.canceled) {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          alert('Please login first');
          return;
        }

        // First update the local state to show immediate feedback
        setProfileImage({ uri: result.assets[0].uri });

        // Create a reference to the users collection
        const userRef = doc(db, 'users', currentUser.uid);

        try {
          // Update the user document with the image URI
          await updateDoc(userRef, {
            profileImage: result.assets[0].uri
          });
          console.log('Profile image updated successfully');
        } catch (error) {
          console.error('Error updating user document:', error);
          alert('Failed to update profile image');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image. Please try again.');
    }
  };

  const handleFilterSelect = (filter: React.SetStateAction<string>) => {
    setSelectedFilter(filter);
  };

  return (
    <View style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage}>
          <Image 
            source={profileImage} 
            style={styles.avatar}
          />
          <Text style={styles.username}>{username || 'Guest'}</Text>
        </TouchableOpacity>
      </View>

      {/* Reminder Categories Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Pending reminders in categories</Text>
        
        <TouchableOpacity 
          style={styles.dropdownIcon}
          onPress={() => setIsOpen(!isOpen)}>
          <MaterialIcons 
            name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={24} 
            color="black" 
          />
        </TouchableOpacity>
        
        {isOpen && (
          <View style={styles.dropdownContent}>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => {
                setSelected('All');
                setIsOpen(false);
              }}>
              <Text>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => {
                setSelected('1 week');
                setIsOpen(false);
              }}>
              <Text>1 week</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => {
                setSelected('1 month');
                setIsOpen(false);
              }}>
              <Text>1 month</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Reminder Overview Section */}
      <Text style={styles.sectionTitle}>Reminder Overview</Text>
      <View style={styles.overviewContainer}>
        <View style={styles.overviewBox}>
          <Text style={styles.overviewNumber}>{completedCount}</Text>
          <Text style={styles.overviewLabel}>Completed</Text>
        </View>
        <View style={styles.overviewBox}>
          <Text style={styles.overviewNumber}>{pendingCount}</Text>
          <Text style={styles.overviewLabel}>Pending</Text>
        </View>
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <Link href="/screen/home" style={styles.bottomTabButtonLeft}>
          <View style={styles.iconContainer}>
            <Image source={require('../screen/images/home.png')} style={styles.bottomTabIcon} />
            <Text style={styles.bottomTabText}>Home</Text>
          </View>
        </Link>
        <Link href="/screen/calendar" style={styles.bottomTabButtonCenter}>
          <View style={styles.iconContainer}>
            <Image source={require('../screen/images/calendar-day.png')} style={styles.bottomTabIcon} />
            <Text style={styles.bottomTabText}>Calendar</Text>
          </View>
        </Link>
        <Link href="/screen/profile" style={styles.bottomTabButtonRight}>
          <View style={styles.iconContainer}>
            <Image source={require('../screen/images/whiteuser.png')} style={styles.bottomTabIcon} />
            <Text style={styles.bottomTabText}>Profile</Text>
          </View>
        </Link>
      </View>
    </View>
  );
};

export default ProfileScreen;