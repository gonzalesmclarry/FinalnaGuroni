import React, { useState, useEffect, ReactNode } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, ScrollView, Modal } from 'react-native';
import { Link, useRouter } from 'expo-router';
import styles from '../styles/homestyles';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import AddReminder from './addreminder';
import { collection, onSnapshot, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import CalendarModal from './CalendarScreen';

// Add this interface near the top of your file
interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  categoryID: string;
  userID: string;
}

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [hasReminders, setHasReminders] = useState(false);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRemindersExpanded, setIsRemindersExpanded] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [isMoreOptionsExpanded, setIsMoreOptionsExpanded] = useState(false);
  const router = useRouter();
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [isMoreOptionsVisible, setIsMoreOptionsVisible] = useState(false);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);
  const [completedReminders, setCompletedReminders] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState<Reminder | null>(null);
  const [starredReminders, setStarredReminders] = useState<string[]>([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    let remindersQuery = query(
      collection(db, "reminders"),
      where("userID", "==", currentUser.uid)
    );




    // Add category filter if not showing 'All'
    if (activeTab !== 'All') {
      remindersQuery = query(
        collection(db, "reminders"),
        where("userID", "==", currentUser.uid),
        where("categoryID", "==", activeTab)
      );
    }

    const unsubscribe = onSnapshot(
      remindersQuery,
      (snapshot) => {
        const reminderList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReminders(reminderList as any);
        setHasReminders(reminderList.length > 0);
      },
      (error) => {
        console.error("Error fetching reminders:", error);
      }
    );

    return () => unsubscribe();
  }, [activeTab]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const starredQuery = query(
      collection(db, 'star_reminder'),
      where('userID', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(starredQuery, (snapshot) => {
      const starredIds = snapshot.docs.map(doc => doc.data().originalReminderId);
      setStarredReminders(starredIds);
    });

    return () => unsubscribe();
  }, []);

  const handShowCalendar = () => {
    setIsCalendarVisible(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarVisible(false);
  }

  const handleStarReminder = async (reminder: { title: any; date: any; time: any; id?: string; categoryID?: any; }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      // Check if reminder is already starred
      const starredQuery = query(
        collection(db, 'star_reminder'),
        where('originalReminderId', '==', reminder.id),
        where('userID', '==', currentUser.uid)
      );
      
      const querySnapshot = await getDocs(starredQuery);
      
      if (querySnapshot.empty) {
        // Star the reminder
        await addDoc(collection(db, 'star_reminder'), {
          title: reminder.title,
          date: reminder.date,
          time: reminder.time,
          categoryID: reminder.categoryID,
          userID: currentUser.uid,
          originalReminderId: reminder.id,
          createdAt: new Date()
        });
        alert('Reminder starred successfully!');
      } else {
        // Unstar the reminder
        const docToDelete = querySnapshot.docs[0];
        await deleteDoc(doc(db, 'star_reminder', docToDelete.id));
        alert('Reminder unstarred successfully!');
      }
    } catch (error) {
      console.error("Error toggling star reminder:", error);
      alert('Error updating reminder star status');
    }
  };


  

  const categories = [
    { name: 'All', count: 0 },
    { name: 'Work', count: 0 },
    { name: 'Birthday', count: 0 },
    { name: 'Occasion', count: 0 },
    { name: 'Special', count: 0 },
  ];
  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const toggleMoreOptions = () => {
    setIsMoreOptionsVisible(!isMoreOptionsVisible);
  };

  const renderContent = () => {
    if (!hasReminders) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            No reminder in this category{'\n'}
            click "+" to create your reminder.
          </Text>
        </View>
      );
    }

    return (
      <>
        {isRemindersExpanded && (
          <View>
            {/* Active Reminders Section */}
            <ScrollView style={styles.remindersList}>
              {reminders.map((reminder: {
                title: ReactNode;
                date: ReactNode;
                time: ReactNode;
                id: string;
              }) => (
                <View key={reminder.id} style={styles.reminderItem}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer} 
                    onPress={() => handleCheckboxClick(reminder)}
                  >
                    <View style={styles.checkbox} />
                  </TouchableOpacity>
                  <View style={styles.reminderTextContainer}>
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    <Text style={styles.reminderDateTime}>
                      {reminder.date} {reminder.time}
                    </Text>
                  </View>
                  <View style={styles.reminderActions}>
                    <TouchableOpacity
                      style={styles.starButton}
                      onPress={() => handleStarReminder(reminder)}
                    >
                      <FontAwesome5 
                        name="star" 
                        size={20} 
                        color={starredReminders.includes(reminder.id) ? "#FFD700" : "#ccc"} 
                        solid={starredReminders.includes(reminder.id)}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.calendarButton}
                      onPress={handShowCalendar}
                    >
                      <FontAwesome5 name="calendar" size={20} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => {
                        setReminderToDelete(reminder as Reminder);
                        setIsDeleteModalVisible(true);
                      }}
                    >
                      <FontAwesome5 name="trash" size={20} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Completed Section */}
            <TouchableOpacity 
              style={styles.reminderHeader}
              onPress={() => setIsCompletedExpanded(!isCompletedExpanded)}
            >
              <Text style={styles.remindersText}>Completed</Text>
              <MaterialIcons 
                name={isCompletedExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={24} 
                color="black" 
              />
            </TouchableOpacity>

            {isCompletedExpanded && (
              <ScrollView style={styles.remindersList}>
                {completedReminders.map((reminder: {
                  title: ReactNode;
                  date: ReactNode;
                  time: ReactNode;
                  id: string;
                }) => (
                  <View key={reminder.id} style={styles.reminderItem}>
                    <TouchableOpacity 
                      style={styles.checkboxContainer}
                      onPress={() => handleUncompleteReminder(reminder)}
                    >
                      <View style={[styles.checkbox, styles.checkedBox]}>
                        <FontAwesome5 name="check" size={12} color="#4CAF50" />
                      </View>
                    </TouchableOpacity>
                    <View style={[styles.reminderTextContainer, { flex: 1 }]}>
                      <Text style={styles.reminderTitle}>{reminder.title}</Text>
                      <Text style={styles.reminderDateTime}>
                        {reminder.date} {reminder.time}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        )}
        <CalendarModal visible={isCalendarVisible} onClose={handleCloseCalendar} reminders={[]} />
      </>
    );
  };
  const handleAddReminder = () => {
    setIsExpanded(true);
  };

  const fetchUserReminders = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const remindersRef = collection(db, 'reminders');
    const q = query(remindersRef, where("userID", "==", currentUser.uid));
    
    const querySnapshot = await getDocs(q);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          fetchUserReminders();
        } else {
          setReminders([]); // Clear reminders when user logs out
        }
      });
  
      return () => unsubscribe(); // Cleanup subscription
    }, []);
    
    // Use the reminders data
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('screen/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Add useEffect to fetch completed reminders
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const completedQuery = query(
      collection(db, "completed"),
      where("userID", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(completedQuery, (snapshot) => {
      const completedList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCompletedReminders(completedList as any);
    });

    return () => unsubscribe();
  }, []);

  // Add function to handle checkbox click
  const handleCheckboxClick = async (reminder: any) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      // Add to completed_reminders collection
      await addDoc(collection(db, 'completed'), {
        title: reminder.title,
        date: reminder.date,
        time: reminder.time,
        categoryID: reminder.categoryID,
        userID: currentUser.uid,
        completedAt: new Date()
      });

      // Delete from reminders collection
      await deleteDoc(doc(db, 'reminders', reminder.id));

      console.log("Reminder marked as completed!");
    } catch (error) {
      console.error("Error completing reminder:", error);
    }
  };

  const handleDeleteReminder = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !reminderToDelete) return;

    try {
      // First, add to deleted collection
      await addDoc(collection(db, 'deleted'), {
        title: reminderToDelete.title,
        date: reminderToDelete.date,
        time: reminderToDelete.time,
        categoryID: reminderToDelete.categoryID,
        userID: currentUser.uid,
        deletedAt: new Date()
      });

      // Then delete from reminders collection
      await deleteDoc(doc(db, 'reminders', reminderToDelete.id));

      // Close modal and clear the reminderToDelete
      setIsDeleteModalVisible(false);
      setReminderToDelete(null);

      console.log("Reminder deleted successfully!");
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }
  };

  // Add this function to handle uncompleting a reminder
  const handleUncompleteReminder = async (completedReminder: any) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      // First, add back to reminders collection
      await addDoc(collection(db, 'reminders'), {
        title: completedReminder.title,
        date: completedReminder.date,
        time: completedReminder.time,
        categoryID: completedReminder.categoryID,
        userID: currentUser.uid
      });

      // Then delete from completed collection
      await deleteDoc(doc(db, 'completed', completedReminder.id));

      alert('Reminder moved back to active list!');
    } catch (error) {
      console.error("Error uncompleting reminder:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Dim Background Overlay */}
      {isSidebarVisible && <View style={styles.overlay} />}

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image source={require('./images/logo.png')} style={styles.logo} />
      </View>

      {/* Add Notification Bell Icon at the top right */}
      <TouchableOpacity style={styles.bellButton} onPress={() => console.log('Bell pressed')}>
      <MaterialIcons name="notifications" size={24} color="black" />
      </TouchableOpacity>

      {/* Menu Tabs */}
      <View style={styles.menuTabs}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
          <Image source={require('./images/menu-burger.png')} style={styles.menuIcon} />
        </TouchableOpacity>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabScrollView}
          contentContainerStyle={styles.tabScrollContent}
        >
          {['All', 'Work', 'Birthday', 'Occasion', 'Special'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[
                styles.tabButton,
                activeTab === tab && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.moreOptionsButton} onPress={toggleMoreOptions}>
          <Image source={require('../screen/images/menu-vertical.png')} style={styles.moreOptionsIcon} />
        </TouchableOpacity>
      </View>

      {isMoreOptionsVisible && (
        <View style={styles.moreOptionsDropdown}>
          <TouchableOpacity onPress={() => router.push('/screen/categories')} style={styles.dropdownItem}>
            <Text style={styles.dropdownText}>See All Categories</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Reminders Section */}
      <View style={styles.remindersContainer}>
        <TouchableOpacity 
          style={styles.reminderHeader}
          onPress={() => setIsRemindersExpanded(!isRemindersExpanded)}
        >
          <Text style={styles.remindersText}>Reminders</Text>
          <MaterialIcons 
            name={isRemindersExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={24} 
            color="black" 
          />
        </TouchableOpacity>
        {renderContent()}
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <Link href="/screen/home" style={styles.bottomTabButtonLeft}>
          <View style={styles.iconContainer}>
            <Image source={require('./images/white-home.png')} style={styles.bottomTabIcon} />
            <Text style={styles.bottomTabText}>Home</Text>
          </View>
        </Link>
        <Link href="/screen/calendar" style={styles.bottomTabButtonCenter}>
          <View style={styles.iconContainer}>
            <Image source={require('./images/calendar-day.png')} style={styles.bottomTabIcon} />
            <Text style={styles.bottomTabText}>Calendar</Text>
          </View>
        </Link>
        <Link href="/screen/profile" style={styles.bottomTabButtonRight}>
          <View style={styles.iconContainer}>
            <Image source={require('./images/user.png')} style={styles.bottomTabIcon} />
            <Text style={styles.bottomTabText}>Profile</Text>
          </View>
        </Link>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddReminder}
      >
        <FontAwesome5 name="plus" size={24} color="black" solid />
      </TouchableOpacity>

      {/* Sidebar */}
      {isSidebarVisible && (
        <Animated.View style={styles.sidebar}>
          <ScrollView style={styles.sidebarScrollView}>
            {/* Logo Section */}
            <View style={styles.sidebarHeader}>
              <View style={styles.logoWrapper}>
                <Image source={require('./images/logo.png')} style={styles.sidebarLogo} />
              </View>
            </View>

            {/* Menu Button */}
            <View style={styles.menuButtonContainer}>
              <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarMenuButton}>
                <FontAwesome5 name="bars" size={24} color="black" solid />
              </TouchableOpacity>
            </View>

            <View style={styles.dividerLine} />

            {/* Categories Section */}
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
            >
              <FontAwesome5 name="th-large" size={22} color="black" solid />
              <Text style={styles.sectionTitle}>Categories</Text>
              <MaterialIcons 
                name={isCategoriesExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={26} 
                color="black" 
              />
            </TouchableOpacity>

            {isCategoriesExpanded && (
              <View style={styles.categoriesList}>
                {categories.map((category) => (
                  <TouchableOpacity key={category.name} style={styles.categoryItem}>
                    <FontAwesome5 name="list" size={18} color="black" solid />
                    <Text style={styles.categoryText}>{category.name}</Text>
                    <Text style={styles.categoryCount}>{category.count}</Text>
                  </TouchableOpacity>
                ))}
                
                {/* Create New inside categories */}
                <TouchableOpacity style={styles.categoryItem}>
                  <FontAwesome5 name="plus" size={18} color="black" solid />
                  <Text style={styles.categoryText}>Create New</Text>
                </TouchableOpacity>

                {/* See All Categories Button */}
                <TouchableOpacity style={styles.categoryItem} 
                onPress={() => router.push('/screen/categories')}
                >
                  <Text style={styles.categoryText}>See All Categories</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* Star Reminder Button */}
            <Link href="/screen/StarReminder" style={styles.sidebarButton}>
              <FontAwesome5 name="star" size={22} color="black" solid />
              <Text style={styles.sidebarButtonText}>Star Reminder</Text>
            </Link>

            {/* Themes Button */}
            <Link href="/screen/theme" style={styles.sidebarButton}>
              <FontAwesome5 name="palette" size={22} color="black" solid />
              <Text style={styles.sidebarButtonText}>Themes</Text>
            </Link>

            {/* FAQ Button */}
            <TouchableOpacity style={styles.sidebarButton}
            onPress={() => router.push('/screen/faq')}>
              <FontAwesome5 name="question-circle" size={22} color="black" solid />
              <Text style={styles.sidebarButtonText}>FAQ</Text>
            </TouchableOpacity>

            {/* Settings */}
            <TouchableOpacity style={styles.sidebarButton}
            onPress={() => router.push('/screen/settings')}>
              <FontAwesome5 name="cog" size={22} color="black" solid />
              <Text style={styles.sidebarButtonText}>Settings</Text>
            </TouchableOpacity>

            {/* Add Feedback button */}
            <TouchableOpacity 
              style={[styles.sidebarButton, styles.feedbackButton]}
              onPress={() => router.push('screen/feedback')}
            >
              <FontAwesome5 name="comment" size={22} color="black" solid />
              <Text style={styles.sidebarButtonText}>Feedback</Text>
            </TouchableOpacity>

            {/* Add Logout button */}
            <TouchableOpacity 
              style={[styles.sidebarButton, styles.feedbackButton]}
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={22} color="black" />
              <Text style={styles.sidebarButtonText}>Logout</Text>
            </TouchableOpacity>

          </ScrollView>
        </Animated.View>
      )}

      <AddReminder 
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteReminder}
              >
                <Text style={[styles.modalButtonText, styles.deleteButtonText]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;