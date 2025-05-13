import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Animated, 
  Modal, 
  FlatList, 
  Platform, 
  GestureResponderEvent,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import styles from '../styles/addreminderstyles';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Alert } from 'react-native';

interface AddReminderProps {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const AddReminder = ({ isExpanded, setIsExpanded }: AddReminderProps) => {
  // Animation state
  const [slideAnim] = useState(new Animated.Value(0));
  
  // Modal visibility states
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isCreateCategoryModalVisible, setIsCreateCategoryModalVisible] = useState(false);
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  
  // Form values
  const [reminderTitle, setReminderTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSound, setSelectedSound] = useState('Default');
  
  // Time picker values
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [isPM, setIsPM] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Calendar values
  const [currentDate, setCurrentDate] = useState(new Date());
  const maxDate = new Date(2026, 11, 31); // December 31, 2026
  
  // Categories 
  const [categories, setCategories] = useState<string[]>(['Work', 'Birthday', 'Occasion', 'Special']);
  
  // Category icons mapping
  const categoryIcons: Record<string, string> = {
    'Work': 'briefcase',
    'Birthday': 'gift',
    'Occasion': 'calendar',
    'Special': 'star',
    'default': 'bookmark'
  };

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
        
        // Only add unique categories
        const uniqueCategories = [...new Set([...categories, ...fetchedCategories])];
        setCategories(uniqueCategories);
        
        console.log('Fetched Categories:', fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Toggle reminder panel with animation
  const toggleReminder = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  // Toggle modals
  const toggleCategoryModal = () => {
    setIsCategoryModalVisible(!isCategoryModalVisible);
  };

  const toggleCreateCategoryModal = () => {
    setIsCreateCategoryModalVisible(!isCreateCategoryModalVisible);
    if (isCategoryModalVisible) {
      setIsCategoryModalVisible(false);
    }
  };

  const toggleCalendarModal = () => {
    setIsCalendarModalVisible(!isCalendarModalVisible);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryModalVisible(false);
  };

  // Render category item in FlatList
  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleCategorySelect(item)}
    >
      <View style={styles.rowCenter}>
        <Ionicons 
          name={(categoryIcons[item] as any) || categoryIcons.default} 
          size={22} 
          color="#0B6477" 
          style={styles.iconContainer} 
        />
        <Text style={styles.categoryItemText}>{item}</Text>
      </View>
    </TouchableOpacity>
  );

  // Generate calendar dates for current month
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

    const today = new Date();

    // Add current month's dates
    days.forEach((day) => {
      const isToday = isSameDay(today, day);
      const isSelected = selectedDate === format(day, 'yyyy-MM-dd');
      
      dates.push(
        <TouchableOpacity 
          key={day.toString()} 
          style={styles.calendarDate}
          onPress={() => setSelectedDate(format(day, 'yyyy-MM-dd'))}
        >
          <Text style={[
            styles.dateText,
            isToday && styles.todayText,
            isSelected && styles.selectedDateText
          ]}>
            {format(day, 'd')}
          </Text>
        </TouchableOpacity>
      );
    });

    return dates;
  };

  // Calendar navigation
  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1);
    if (nextMonth <= maxDate) {
      setCurrentDate(nextMonth);
    }
  };

  // Handle time change from DateTimePicker
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
      setSelectedTime(format(selectedTime, 'h:mm a'));
    }
  };

  // Validate reminder data
  const validateAndSaveReminder = async () => {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        Alert.alert('Error', 'Please login first');
        return null;
      }

      if (!reminderTitle) {
        Alert.alert('Error', 'Please enter a reminder title');
        return null;
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
        return null;
      }

      // Create reminder data object
      const reminderData = {
        categoryID: selectedCategory || 'default',
        date: selectedDate || format(new Date(), 'yyyy-MM-dd'),
        reminderID: Math.random().toString(36).substr(2, 9),
        reminderOn: "0", // Default setting
        sound: selectedSound || "Default",
        time: selectedTime || format(new Date(), 'h:mm a'),
        title: reminderTitle,
        userID: currentUser.uid,
        createdAt: new Date().toISOString()
      };

      return reminderData;
    } catch (error) {
      console.error('Error validating reminder:', error);
      Alert.alert('Error', 'Failed to validate reminder. Please try again.');
      return null;
    }
  };

  // Save reminder to Firestore
  const handleSaveReminder = async () => {
    const reminderData = await validateAndSaveReminder();
    
    if (!reminderData) return;
    
    try {
      // Add document to reminders collection
      const remindersRef = collection(db, 'reminders');
      await addDoc(remindersRef, reminderData);

      Alert.alert('Success', 'Reminder saved successfully!');
      
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

  // Create new category in Firestore
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

      // Check if category already exists
      if (categories.includes(newCategoryName)) {
        Alert.alert('Error', 'This category already exists');
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

  // Time Picker Modal Component
  const TimePickerModal = () => (
    <Modal
      visible={isTimeModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsTimeModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsTimeModalVisible(false)}>
        <View style={styles.timeModalContainer}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
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
                    onChangeText={(text) => {
                      const numValue = parseInt(text);
                      if (!isNaN(numValue) && numValue >= 0 && numValue <= 12) {
                        setHour(text);
                      } else if (text === '') {
                        setHour('');
                      }
                    }}
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
                    onChangeText={(text) => {
                      const numValue = parseInt(text);
                      if (!isNaN(numValue) && numValue >= 0 && numValue <= 59) {
                        setMinute(text.padStart(2, '0'));
                      } else if (text === '') {
                        setMinute('');
                      }
                    }}
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
                    <Text style={[styles.amPmText, !isPM && styles.amPmTextActive]}>AM</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.amPmButton, isPM && styles.amPmButtonActive]}
                    onPress={() => setIsPM(true)}
                  >
                    <Text style={[styles.amPmText, isPM && styles.amPmTextActive]}>PM</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.timeDoneButton}
                onPress={() => {
                  const formattedHour = hour || '12';
                  const formattedMinute = minute || '00';
                  setSelectedTime(`${formattedHour}:${formattedMinute} ${isPM ? 'PM' : 'AM'}`);
                  setIsTimeModalVisible(false);
                }}
              >
                <Text style={styles.timeDoneText}>Set Time</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <>
      {/* Overlay when reminder is expanded */}
      {isExpanded && <View style={styles.overlay} />}
      
      {/* Main Reminder Card */}
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
          >
        <Text style={styles.closeButtonText} onPress={toggleReminder}>
          <Ionicons name="close" size={24} color="#333" />
        </Text>
          
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

      {/* Category Selection Modal */}
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
            <Text style={styles.modalTitle}>Select Category</Text>
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

      {/* Create Category Modal */}
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
            style={styles.createCategoryModalContent}
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
              placeholderTextColor="#666"
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

      {/* Calendar Modal */}
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
                  onPress={() => setIsTimeModalVisible(true)}
                  style={{flex: 1}}
                >
                  <Text style={styles.input}>
                    {selectedTime || 'Select Time'}
                  </Text>
                </TouchableOpacity>
              </View>
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

      {/* Native date time picker for iOS */}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Add Button (Plus Button) when not expanded */}
      {!isExpanded && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={toggleReminder}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}

      {/* Custom Time Picker Modal */}
      <TimePickerModal />
    </>
  );
};

export default AddReminder;