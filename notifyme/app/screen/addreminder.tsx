import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, Modal, FlatList, Image, Platform, GestureResponderEvent } from 'react-native';
import styles from '../styles/addreminderstyles';
import { MaterialIcons } from '@expo/vector-icons';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Audio } from 'expo-av';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Alert } from 'react-native';

interface Reminder {
  categoryID: string;
  createdAt: string;
  date: string;
  reminderID: string;
  reminderOn: string;
  sound: string;
  time: string;
  title: string;
  userID: string;
}

interface AddReminderProps {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const AddReminder = ({ isExpanded, setIsExpanded }: AddReminderProps) => {
  const [slideAnim] = useState(new Animated.Value(0));
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isCreateCategoryModalVisible, setIsCreateCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const maxDate = new Date(2026, 11, 31); // December 31, 2026
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');
  const [isPM, setIsPM] = useState(false);
  const [selectedSound, setSelectedSound] = useState('Default');
  const [showSoundOptions, setShowSoundOptions] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [categories, setCategories] = useState<string[]>(['Work', 'Birthday', 'Occasion', 'Special']);


  // Fetch categories from Firestore on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const categoriesRef = collection(db, 'categories');
        const q = query(categoriesRef, where("userID", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        const fetchedCategories = querySnapshot.docs.map(doc => doc.data().name);
        setCategories(prevCategories => [...prevCategories, ...fetchedCategories]);
        console.log('Fetched Categories:', fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array to run only on mount

  const toggleReminder = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  const toggleCategoryModal = () => {
    setIsCategoryModalVisible(!isCategoryModalVisible);
  };

  const toggleCreateCategoryModal = () => {
    setIsCreateCategoryModalVisible(!isCreateCategoryModalVisible);
  };

  const handleCategorySelect = (category: { id: string, name: string }) => {
    setSelectedCategory(category.name);
    setIsCategoryModalVisible(false);
  };

  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategorySelect({ id: item, name: item })}
    >
      <Text style={styles.categoryItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };

  const generateCalendarDates = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    const startDayOfWeek = getDay(start);
    
    const dates = [];
    
    // Add empty spaces for days before the 1st of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      const prevDate = new Date(start);
      prevDate.setDate(prevDate.getDate() - (startDayOfWeek - i));
      dates.push(
        <View key={`prev-${i}`} style={styles.calendarDate}>
          <Text style={[styles.dateText, styles.prevMonthDate]}>
            {prevDate.getDate()}
          </Text>
        </View>
      );
    }

    // Add current month's dates
    days.forEach((day) => {
      const isToday = new Date().toDateString() === day.toDateString();
      dates.push(
        <TouchableOpacity 
          key={day.toString()} 
          style={styles.calendarDate}
          onPress={() => setSelectedDate(format(day, 'yyyy-MM-dd'))}
        >
          <Text style={[
            styles.dateText,
            isToday && styles.todayText,
            selectedDate === format(day, 'yyyy-MM-dd') && styles.selectedDateText
          ]}>
            {format(day, 'd')}
          </Text>
        </TouchableOpacity>
      );
    });

    return dates;
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1);
    if (nextMonth <= maxDate) {
      setCurrentDate(nextMonth);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
      setSelectedTime(format(selectedTime, 'HH:mm'));
    }
  };

  const TimePickerModal = () => (
    <Modal
      visible={isTimeModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsTimeModalVisible(false)}
    >
      <View style={styles.timeModalContainer}>
        <View style={styles.timeModalContent}>
          <View style={styles.timeModalHeader}>
            <Text style={styles.timeModalTitle}>Set Time</Text>
            <TouchableOpacity 
              style={styles.timeModalClose}
              onPress={() => setIsTimeModalVisible(false)}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.timeInputContainer}>
            <View style={styles.timeInputGroup}>
              <TextInput
                style={styles.timeInput}
                value={hour}
                onChangeText={setHour}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.timeLabel}>Hour</Text>
            </View>
            
            <Text style={styles.timeColon}>:</Text>
            
            <View style={styles.timeInputGroup}>
              <TextInput
                style={styles.timeInput}
                value={minute}
                onChangeText={setMinute}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.timeLabel}>Minute</Text>
            </View>

            <View style={styles.amPmContainer}>
              <TouchableOpacity 
                style={[styles.amPmButton, !isPM && styles.amPmButtonActive]}
                onPress={() => setIsPM(false)}
              >
                <Text style={[styles.amPmText, !isPM && styles.amPmTextActive]}>Am</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.amPmButton, isPM && styles.amPmButtonActive]}
                onPress={() => setIsPM(true)}
              >
                <Text style={[styles.amPmText, isPM && styles.amPmTextActive]}>Pm</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.timeDoneButton}
            onPress={() => {
              setSelectedTime(`${hour}:${minute} ${isPM ? 'PM' : 'AM'}`);
              setIsTimeModalVisible(false);
            }}
          >
            <Text style={styles.timeDoneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const playSound = async (soundFile: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        soundFile === 'default_sound' ? require('../assets/sounds/default.mp3') :
        soundFile === 'bell_sound' ? require('../assets/sounds/bell.mp3') :
        require('../assets/sounds/chime.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const handleSaveReminder = async () => {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        Alert.alert('Error', 'Please login first');
        return;
      }

      if (!reminderTitle) {
        Alert.alert('Error', 'Please enter a reminder title');
        return;
      }

      // Check if reminder title already exists for this user
      const remindersRef = collection(db, 'reminders');
      const q = query(
        remindersRef, 
        where("userID", "==", currentUser.uid),
        where("title", "==", reminderTitle)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        Alert.alert('Error', 'A reminder with this title already exists');
        return;
      }

      // Create reminder data object
      const reminderData = {
        categoryID: selectedCategory || 'default',
        date: selectedDate,
        reminderID: Math.random().toString(36).substr(2, 9),
        reminderOn: "0", // Set to "0" since we are not using the reminder modal
        sound: selectedSound || "50",
        time: selectedTime,
        title: reminderTitle,
        userID: currentUser.uid,
        createdAt: new Date().toISOString()
      };

      // Add document to reminders collection
      await addDoc(remindersRef, reminderData);

      console.log('Reminder saved');
      setIsExpanded(false); // Close the reminder screen
      // Reset form fields
      setReminderTitle('');
      setSelectedCategory('');
      setSelectedDate('');
      setSelectedTime('');
      setSelectedSound('Default');
      toggleReminder();
      
    } catch (error) {
      console.error('Error saving reminder:', error);
      Alert.alert('Error', 'Failed to save reminder. Please try again.');
    }
  };

  const handleCreateCategory = async (event: GestureResponderEvent): Promise<void> => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('Error', 'Please login first');
        return;
      }

      if (!newCategoryName) {
        Alert.alert('Error', 'Please enter a category name');
        return;
      }

      // Create category data object
      const categoryData = {
        name: newCategoryName,
        userID: currentUser.uid,
        createdAt: new Date().toISOString()
      };

      // Add document to categories collection
      const categoriesRef = collection(db, 'categories');
      await addDoc(categoriesRef, categoryData);

      // Update local state to include the new category
      setCategories(prevCategories => [...prevCategories, newCategoryName]);

      // Reset new category name
      setNewCategoryName('');
      toggleCreateCategoryModal();

      Alert.alert('Success', 'Category created successfully!');

    } catch (error) {
      console.error('Error creating category:', error);
      Alert.alert('Error', 'Failed to create category. Please try again.');
    }
  };

  return (
    <>
      {isExpanded && <View style={styles.overlay} />}
      
      <Animated.View
        style={[
          styles.reminderCard,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [500, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={toggleReminder}
        >
          <MaterialIcons name="close" size={24} color="#333" />
        </TouchableOpacity>

        <TextInput
          style={styles.reminderInput}
          placeholder="Input new reminder here"
          placeholderTextColor="#666"
          value={reminderTitle}
          onChangeText={setReminderTitle}
        />
        <View style={styles.categoryRow}>
          <TouchableOpacity 
            style={styles.categoryButton}
            onPress={toggleCategoryModal}
          >
            <Text style={styles.categoryButtonText}>
              {selectedCategory || 'category'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.calendarButton}
            onPress={toggleCalendarModal}
          >
            <MaterialIcons name="calendar-today" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.saveReminderButton}
          onPress={handleSaveReminder}
        >
          <Text style={styles.saveReminderText}>Save</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={isCategoryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleCategoryModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={toggleCategoryModal}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.flatListContent}
              style={styles.flatList}
              ListFooterComponent={
                <TouchableOpacity 
                  style={styles.createNewButton}
                  onPress={toggleCreateCategoryModal}
                >
                  <Text style={styles.createNewButtonText}>+ Create new</Text>
                </TouchableOpacity>
              }
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={isCreateCategoryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleCreateCategoryModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleCreateCategoryModal}
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={[styles.createCategoryModalContent, { backgroundColor: '#fff' }]}
          >
            <TouchableOpacity 
              style={styles.closeButtonContainer}
              onPress={toggleCreateCategoryModal}
            >
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.createCategoryTitle}>Create new Category</Text>
            
            <TextInput
              style={styles.categoryInput}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="Enter category name"
            />
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleCreateCategory}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={isCalendarModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleCalendarModal}
      >
        <View style={styles.calendarModalContainer}>
          <View style={styles.calendarContent}>
            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={handlePrevMonth}>
                <Text style={styles.arrowText}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.monthText}>{format(currentDate, 'MMMM yyyy')}</Text>
              <TouchableOpacity onPress={handleNextMonth}>
                <Text style={styles.arrowText}>▶</Text>
              </TouchableOpacity>
            </View>

            {/* Days Header */}
            <View style={styles.weekDaysContainer}>
              <Text style={styles.weekDayText}>Sun</Text>
              <Text style={styles.weekDayText}>Mon</Text>
              <Text style={styles.weekDayText}>Tue</Text>
              <Text style={styles.weekDayText}>Wed</Text>
              <Text style={styles.weekDayText}>Thu</Text>
              <Text style={styles.weekDayText}>Fri</Text>
              <Text style={styles.weekDayText}>Sat</Text>
            </View>

            {/* Calendar Grid */}
            <View style={styles.datesContainer}>
              {generateCalendarDates()}
            </View>

            {/* Time Inputs */}
            <View style={styles.inputsContainer}>
              <View style={styles.inputRow}>
                <MaterialIcons name="access-time" size={20} color="#666" />
                <TouchableOpacity 
                  onPress={() => {
                    console.log('Opening time modal');
                    setIsTimeModalVisible(true);
                  }}
                >
                  <Text style={styles.input}>
                    {selectedTime || 'Time'}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* Removed reminder input section */}
            </View>

            {/* Done Button */}
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={toggleCalendarModal}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {!isExpanded && (
        <>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={toggleReminder}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </>
      )}

      <TimePickerModal />
    </>
  );
};

export default AddReminder; 