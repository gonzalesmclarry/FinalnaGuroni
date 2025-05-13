// Enhanced ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  StatusBar 
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/profilestyles';
import { MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const ProfileScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [profileImage, setProfileImage] = useState(require('./images/avatar.png'));
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('All');
  const [username, setUsername] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();

  const categories = ['All', 'Personal', 'Work', 'Health', 'Bills', 'Other'];
  
  // Sample recent activity data - in a real app, this would come from Firebase
  const recentActivity = [
    { 
      id: '1', 
      title: 'Doctor Appointment', 
      date: 'May 5, 2025', 
      status: 'Completed', 
      type: 'Health' 
    },
    { 
      id: '2', 
      title: 'Rent Payment', 
      date: 'May 1, 2025', 
      status: 'Completed', 
      type: 'Bills' 
    }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const currentUser = auth.currentUser;

        if (currentUser) {
          // Fetch user profile data
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

          if (userDoc.exists()) {
            setUsername(userDoc.data().username || 'User');
            if (userDoc.data().profileImage) {
              setProfileImage({ uri: userDoc.data().profileImage });
            }
          }

          // Fetch completed reminders
          const completedRef = collection(db, 'completed');
          const completedQuery = query(completedRef, where('userID', '==', currentUser.uid));
          const completedSnapshot = await getDocs(completedQuery);
          setCompletedCount(completedSnapshot.size);

          // Fetch pending reminders
          const remindersRef = collection(db, 'reminders');
          const pendingQuery = query(remindersRef, where('userID', '==', currentUser.uid));
          const pendingSnapshot = await getDocs(pendingQuery);
          setPendingCount(pendingSnapshot.size);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Image picker function
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('We need gallery permissions to update your profile picture');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          alert('Please login to update your profile');
          return;
        }

        // Update UI immediately for better user experience
        setProfileImage({ uri: result.assets[0].uri });

        // Update in Firebase
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          profileImage: result.assets[0].uri
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to update profile picture. Please try again.');
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  // Function to handle timeframe selection
  const handleTimeframeSelect = (timeframe: string) => {
    setSelected(timeframe);
    setIsOpen(false);
    // In a real app, you would fetch filtered data here
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0B6477" />
        <Text style={{ marginTop: 20, color: '#0B6477' }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#A8D8E4" barStyle="dark-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={profileImage} style={styles.avatar} />
            <TouchableOpacity style={styles.editIconContainer} onPress={pickImage}>
              <Feather name="edit-2" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.userStatus}>Active Member</Text>
          </View>
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterLabel}>Reminder Categories</Text>
            
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setIsOpen(!isOpen)}>
              <Text style={styles.dropdownText}>{selected}</Text>
              <MaterialIcons 
                name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={18} 
                color="#fff" 
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>
          </View>
          
          {isOpen && (
            <View style={styles.dropdownContent}>
              {['All', '1 week', '1 month', '3 months'].map((timeframe) => (
                <TouchableOpacity 
                  key={timeframe}
                  style={styles.dropdownItem}
                  onPress={() => handleTimeframeSelect(timeframe)}>
                  <Text style={styles.dropdownItemText}>{timeframe}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <View style={styles.filterContent}>
            <View style={styles.filterCategories}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.categoryChipSelected
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text 
                    style={[
                      styles.categoryText,
                      selectedCategory === category && styles.categoryTextSelected
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Reminder Overview */}
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

        {/* Recent Activity Section */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activitySection}>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <MaterialCommunityIcons 
                  name={activity.type === 'Health' ? 'medical-bag' : 'cash-multiple'} 
                  size={22} 
                  color="#fff" 
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                  <Text style={styles.activityStatus}>{activity.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <Link href="/screen/home" asChild>
          <TouchableOpacity style={styles.tabButton}>
            <View style={styles.iconContainer}>
              <View style={styles.tabIconContainer}>
                <Image source={require('../screen/images/home.png')} style={styles.tabIcon} />
              </View>
              <Text style={styles.tabText}>Home</Text>
            </View>
          </TouchableOpacity>
        </Link>
        
        <Link href="/screen/calendar" asChild>
          <TouchableOpacity style={styles.centerTabButton}>
            <Image 
              source={require('../screen/images/calendar-day.png')} 
              style={styles.centerTabIcon} 
            />
          </TouchableOpacity>
        </Link>
        
        <Link href="/screen/profile" asChild>
          <TouchableOpacity style={styles.tabButton}>
            <View style={styles.iconContainer}>
              <View style={[styles.tabIconContainer, styles.tabIconContainerActive]}>
                <Image 
                  source={require('../screen/images/whiteuser.png')} 
                  style={[styles.tabIcon, styles.tabIconLight]} 
                />
              </View>
              <Text style={[styles.tabText, styles.tabTextActive]}>Profile</Text>
              <View style={styles.tabActiveIndicator} />
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default ProfileScreen;