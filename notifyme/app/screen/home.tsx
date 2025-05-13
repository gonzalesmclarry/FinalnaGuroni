import React, { useState, useEffect, ReactNode } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  Modal,
} from "react-native";
import { Link, router, useRouter } from "expo-router";
import styles from "../styles/homestyles";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AddReminder from "./addreminder";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import CalendarModal from "./CalendarScreen";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import * as tf from "@tensorflow/tfjs";
//import * as tf from "@tensorflow/tfjs-react-native";
// Interface for Reminder type
interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  categoryID: string;
  userID: string;
}

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [hasReminders, setHasReminders] = useState(false);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRemindersExpanded, setIsRemindersExpanded] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);
  const [completedReminders, setCompletedReminders] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState<Reminder | null>(
    null
  );
  const [starredReminders, setStarredReminders] = useState<string[]>([]);
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
  const [reminderToComplete, setReminderToComplete] = useState<Reminder | null>(
    null
  );
  const [sidebarAnimation] = useState(new Animated.Value(-300));
  const [categories, setCategories] = useState([
    { name: "All", count: 0 },
    { name: "Work", count: 0 },
    { name: "Birthday", count: 0 },
    { name: "Occasion", count: 0 },
    { name: "Special", count: 0 },
  ]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    let remindersQuery = query(
      collection(db, "reminders"),
      where("userID", "==", currentUser.uid)
    );

    // Add category filter if not showing 'All'
    if (activeTab !== "All") {
      remindersQuery = query(
        collection(db, "reminders"),
        where("userID", "==", currentUser.uid),
        where("categoryID", "==", activeTab)
      );
    }

    const unsubscribe = onSnapshot(
      remindersQuery,
      (snapshot) => {
        const reminderList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReminders(reminderList as any);
        setHasReminders(reminderList.length > 0);

        // Update category counts
        updateCategoryCounts(reminderList);
      },
      (error) => {
        console.error("Error fetching reminders:", error);
      }
    );

    return () => unsubscribe();
  }, [activeTab]);

  // Update category counts
  const updateCategoryCounts = (reminderList: any[]) => {
    // Create a map to count reminders by category
    const categoryCounts = new Map();

    // Count 'All' category
    categoryCounts.set("All", reminderList.length);

    // Count specific categories
    reminderList.forEach((reminder) => {
      const category = reminder.categoryID || "Uncategorized";
      const currentCount = categoryCounts.get(category) || 0;
      categoryCounts.set(category, currentCount + 1);
    });

    // Update the categories state with the counts
    setCategories((prevCategories) =>
      prevCategories.map((cat) => ({
        ...cat,
        count: categoryCounts.get(cat.name) || 0,
      }))
    );
  };
  // Veryfying TensorFlow.js is ready
  useEffect(() => {
    const loadTensorFlow = async () => {
      try {
        await tf.ready();
        console.log("TensorFlow.js is ready!");
      } catch (error) {
        console.error("Error loading TensorFlow.js:", error);
      }
    };

    loadTensorFlow();
  }, []);

  // Revised interfaces for type safety
  interface ReminderData {
    time: string;
    categoryID: string;
  }

  interface CategoryMapping {
    [key: string]: number;
  }

  // Improved trainAIModel function with better error handling
  const trainAIModel = async (
    remindersData: ReminderData[]
  ): Promise<tf.LayersModel | null> => {
    try {
      console.log("Starting AI model training...");

      const categoryMapping: CategoryMapping = {
        Work: 0,
        Birthday: 1,
        Occasion: 2,
        Special: 3,
      };

      const processedData = remindersData
        .filter(
          (reminder) =>
            reminder &&
            reminder.time &&
            reminder.categoryID &&
            categoryMapping.hasOwnProperty(reminder.categoryID)
        )
        .map((reminder) => {
          const timeParts = reminder.time.match(
            /(\d+):(\d+)\s*(AM|PM|am|pm)?/i
          );
          if (!timeParts) return null;

          let hour = parseInt(timeParts[1], 10);
          const minute = parseInt(timeParts[2], 10);
          const period = timeParts[3]?.toUpperCase();

          if (period === "PM" && hour < 12) hour += 12;
          if (period === "AM" && hour === 12) hour = 0;

          return {
            input: [hour / 24, minute / 60],
            output: categoryMapping[reminder.categoryID],
          };
        })
        .filter((item) => item !== null) as {
        input: number[];
        output: number;
      }[];

      if (processedData.length < 2) {
        console.error("Not enough valid data after processing");
        return null;
      }

      const inputData = processedData.map((item) => item.input);
      const rawOutputData = processedData.map((item) => item.output);

      // Clean and validate output data
      const cleanedOutputData = rawOutputData
        .map((v) => parseInt(String(v), 10))
        .filter((v) => !isNaN(v));

      if (cleanedOutputData.length !== inputData.length) {
        console.error("Mismatch in input and output data lengths");
        return null;
      }

      console.log("Processed Input Data:", inputData);
      console.log("Processed Output Data:", cleanedOutputData);

      const xs = tf.tensor2d(inputData);
      const ys = tf.oneHot(
        tf.tensor1d(cleanedOutputData, "int32"),
        Object.keys(categoryMapping).length
      );

      const model = tf.sequential({
        layers: [
          tf.layers.dense({ units: 8, activation: "relu", inputShape: [2] }),
          tf.layers.dense({
            units: Object.keys(categoryMapping).length,
            activation: "softmax",
          }),
        ],
      });

      model.compile({
        optimizer: "adam",
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      });

      try {
        await model.fit(xs, ys, {
          epochs: 50,
          batchSize: 4,
          shuffle: true,
          verbose: 1,
        });

        xs.dispose();
        ys.dispose();

        console.log("Model trained successfully.");
        return model;
      } catch (trainError) {
        console.error("Training error:", trainError);
        xs.dispose();
        ys.dispose();
        return null;
      }
    } catch (error) {
      console.error("Model creation error:", error);
      return null;
    }
  };

  // Improved suggestSmartReminders function
  const suggestSmartReminders = async () => {
    try {
      console.log("Fetching AI-powered suggestions...");

      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("Please log in to get AI suggestions.");
        return;
      }

      // Fetch user reminders from Firestore
      const remindersQuery = query(
        collection(db, "reminders"),
        where("userID", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(remindersQuery);
      const remindersData = querySnapshot.docs.map((doc) => doc.data());

      console.log("User Reminders:", remindersData);

      const validRemindersData = remindersData
        .filter((doc: any) => doc.time && doc.categoryID)
        .map((doc: any) => ({
          time: doc.time,
          categoryID: doc.categoryID,
        }));

      if (validRemindersData.length < 2) {
        alert(
          "You need at least 2 valid reminders (with time and category) to get AI suggestions."
        );
        return;
      }

      await tf.ready();
      console.log("TensorFlow.js is ready");

      const model = await trainAIModel(validRemindersData);

      if (!model) {
        alert("AI training failed. Please try again later.");
        return;
      }

      const categoryIndices: { [key: number]: string } = {
        0: "Work",
        1: "Birthday",
        2: "Occasion",
        3: "Special",
      };

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const timeOptions = [
        [currentHour, currentMinute],
        [(currentHour + 1) % 24, currentMinute],
        [(currentHour + 2) % 24, currentMinute],
        [9, 0],
        [12, 0],
        [18, 0],
      ];

      let bestSuggestion = null;
      let highestConfidence = 0;

      for (const time of timeOptions) {
        const [hour, minute] = time;
        const inputTensor = tf.tensor2d([[hour / 24, minute / 60]]);

        try {
          const prediction = model.predict(inputTensor) as tf.Tensor;

          const predictionData = await prediction.data();
          const maxConfidence = Math.max(...predictionData);
          const predictedIndex = predictionData.indexOf(maxConfidence);

          if (maxConfidence > highestConfidence) {
            highestConfidence = maxConfidence;

            const formattedHour = hour % 12 || 12;
            const period = hour >= 12 ? "PM" : "AM";
            const formattedMinute = minute.toString().padStart(2, "0");

            bestSuggestion = {
              category: categoryIndices[predictedIndex] || "Other",
              time: `${formattedHour}:${formattedMinute} ${period}`,
              confidence: (maxConfidence * 100).toFixed(1),
            };
          }

          prediction.dispose();
        } catch (err) {
          console.error("Prediction error:", err);
        } finally {
          inputTensor.dispose();
        }
      }

      if (bestSuggestion) {
        alert(
          `AI Suggestion:\nCategory: "${bestSuggestion.category}"\nTime: ${bestSuggestion.time}\nConfidence: ${bestSuggestion.confidence}%`
        );
      } else {
        alert("AI couldn't generate a confident suggestion. Try again later.");
      }

      model.dispose();
    } catch (err) {
      console.error("AI Suggestion Error:", err);
      alert("An error occurred while generating suggestions. Try again later.");
    }
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const starredQuery = query(
      collection(db, "star_reminder"),
      where("userID", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(starredQuery, (snapshot) => {
      const starredIds = snapshot.docs.map(
        (doc) => doc.data().originalReminderId
      );
      setStarredReminders(starredIds);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const categoriesQuery = query(
      collection(db, "categories"),
      where("userID", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(categoriesQuery, (snapshot) => {
      const fetchedCategories = snapshot.docs.map((doc) => ({
        name: doc.data().name,
        count: 0, // We'll update this count later if needed
      }));

      // Combine default categories with user's custom categories
      const defaultCategories = [
        { name: "All", count: 0 },
        { name: "Work", count: 0 },
        { name: "Birthday", count: 0 },
        { name: "Occasion", count: 0 },
        { name: "Special", count: 0 },
      ];

      const allCategories = [...defaultCategories];

      // Add only new categories that aren't in the default list
      fetchedCategories.forEach((fetchedCat) => {
        if (
          !defaultCategories.some((defCat) => defCat.name === fetchedCat.name)
        ) {
          allCategories.push(fetchedCat);
        }
      });

      setCategories(allCategories);
    });

    return () => unsubscribe();
  }, []);

  const handleShowCalendar = () => {
    setIsCalendarVisible(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarVisible(false);
  };

  const handleStarReminder = async (reminder: {
    title: any;
    date: any;
    time: any;
    id?: string;
    categoryID?: any;
  }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      // Check if reminder is already starred
      const starredQuery = query(
        collection(db, "star_reminder"),
        where("originalReminderId", "==", reminder.id),
        where("userID", "==", currentUser.uid)
      );

      const querySnapshot = await getDocs(starredQuery);

      if (querySnapshot.empty) {
        // Star the reminder
        await addDoc(collection(db, "star_reminder"), {
          title: reminder.title,
          date: reminder.date,
          time: reminder.time,
          categoryID: reminder.categoryID,
          userID: currentUser.uid,
          originalReminderId: reminder.id,
          createdAt: new Date(),
        });
        alert("Reminder starred successfully!");
      } else {
        // Unstar the reminder
        const docToDelete = querySnapshot.docs[0];
        await deleteDoc(doc(db, "star_reminder", docToDelete.id));
        alert("Reminder unstarred successfully!");
      }
    } catch (error) {
      console.error("Error toggling star reminder:", error);
      alert("Error updating reminder star status");
    }
  };

  // Function to toggle sidebar visibility with animation
  const toggleSidebar = () => {
    if (isSidebarVisible) {
      // Hide sidebar
      Animated.timing(sidebarAnimation, {
        toValue: -300,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setIsSidebarVisible(false);
      });
    } else {
      // Show sidebar
      setIsSidebarVisible(true);
      Animated.timing(sidebarAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyStateContainer}>
        <FontAwesome5
          name="calendar-check"
          size={60}
          color="#0B6477"
          style={styles.emptyStateIcon}
        />
        <Text style={styles.emptyStateText}>
          No reminders in this category{"\n"}
          Tap "+" to create a new reminder
        </Text>
      </View>
    );
  };

  const renderReminders = () => {
    return (
      <ScrollView style={styles.remindersList}>
        {reminders.map(
          (reminder: {
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
                  {reminder.date} • {reminder.time}
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
                    color={
                      starredReminders.includes(reminder.id)
                        ? "#FFD700"
                        : "#ccc"
                    }
                    solid={starredReminders.includes(reminder.id)}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.calendarButton}
                  onPress={handleShowCalendar}
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
          )
        )}

        {/* Completed reminders section */}
        {completedReminders.length > 0 && (
          <>
            <TouchableOpacity
              style={styles.completedHeader}
              onPress={() => setIsCompletedExpanded(!isCompletedExpanded)}
            >
              <Text style={styles.completedText}>
                Completed ({completedReminders.length})
              </Text>
              <MaterialIcons
                name={
                  isCompletedExpanded
                    ? "keyboard-arrow-up"
                    : "keyboard-arrow-down"
                }
                size={24}
                color="#666"
              />
            </TouchableOpacity>

            {isCompletedExpanded &&
              completedReminders.map(
                (reminder: {
                  title: ReactNode;
                  date: ReactNode;
                  time: ReactNode;
                  id: string;
                }) => (
                  <View
                    key={reminder.id}
                    style={[styles.reminderItem, styles.completedItem]}
                  >
                    <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={() => handleUncompleteReminder(reminder)}
                    >
                      <View style={[styles.checkbox, styles.checkedBox]}>
                        <FontAwesome5 name="check" size={12} color="#4CAF50" />
                      </View>
                    </TouchableOpacity>
                    <View style={styles.reminderTextContainer}>
                      <Text style={styles.completedTitle}>
                        {reminder.title}
                      </Text>
                      <Text style={styles.completedDateTime}>
                        {reminder.date} • {reminder.time}
                      </Text>
                    </View>
                  </View>
                )
              )}
          </>
        )}
      </ScrollView>
    );
  };

  const renderContent = () => {
    return (
      <>
        {/* Reminders Header */}
        <View style={styles.reminderHeader}>
          <Text style={styles.remindersText}>
            {activeTab === "All" ? "All Reminders" : activeTab}
          </Text>
          <Text style={styles.reminderCount}>
            {activeTab === "All"
              ? reminders.length
              : categories.find((cat) => cat.name === activeTab)?.count || 0}
          </Text>
        </View>

        {/* Reminders or Empty State */}
        {!hasReminders ? renderEmptyState() : renderReminders()}

        <CalendarModal
          visible={isCalendarVisible}
          onClose={handleCloseCalendar}
          reminders={[]}
        />
      </>
    );
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const completedQuery = query(
      collection(db, "completed"),
      where("userID", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(completedQuery, (snapshot) => {
      const completedList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCompletedReminders(completedList as any);
    });

    return () => unsubscribe();
  }, []);

  // Add function to handle checkbox click
  const handleCheckboxClick = (reminder: any) => {
    setReminderToComplete(reminder);
    setIsCompleteModalVisible(true);
  };

  const handleConfirmComplete = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !reminderToComplete) return;

    try {
      // Add to completed_reminders collection
      await addDoc(collection(db, "completed"), {
        title: reminderToComplete.title,
        date: reminderToComplete.date,
        time: reminderToComplete.time,
        categoryID: reminderToComplete.categoryID,
        userID: currentUser.uid,
        completedAt: new Date(),
      });

      // Delete from reminders collection
      await deleteDoc(doc(db, "reminders", reminderToComplete.id));

      // Close modal and clear the reminderToComplete
      setIsCompleteModalVisible(false);
      setReminderToComplete(null);

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
      await addDoc(collection(db, "deleted"), {
        title: reminderToDelete.title,
        date: reminderToDelete.date,
        time: reminderToDelete.time,
        categoryID: reminderToDelete.categoryID,
        userID: currentUser.uid,
        deletedAt: new Date(),
      });

      // Then delete from reminders collection
      await deleteDoc(doc(db, "reminders", reminderToDelete.id));

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
      await addDoc(collection(db, "reminders"), {
        title: completedReminder.title,
        date: completedReminder.date,
        time: completedReminder.time,
        categoryID: completedReminder.categoryID,
        userID: currentUser.uid,
      });

      // Then delete from completed collection
      await deleteDoc(doc(db, "completed", completedReminder.id));

      alert("Reminder moved back to active list!");
    } catch (error) {
      console.error("Error uncompleting reminder:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("screen/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Dim Background Overlay when sidebar is open */}
      {isSidebarVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleSidebar}
        />
      )}

      {/* Header Section with Logo and Notification */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
          <FontAwesome5 name="bars" size={24} color="#0B6477" />
        </TouchableOpacity>

        <Image source={require("./images/logo.png")} style={styles.logo} />

        <TouchableOpacity
          style={styles.bellButton}
          onPress={suggestSmartReminders}
        >
          <MaterialIcons name="notifications" size={24} color="#0B6477" />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScrollView}
        contentContainerStyle={styles.tabScrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.tabButton,
              activeTab === category.name && styles.activeTab,
            ]}
            onPress={() => setActiveTab(category.name)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === category.name && styles.activeTabText,
              ]}
            >
              {category.name}
              {category.count > 0 && ` (${category.count})`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Reminders Section */}
      <View style={styles.remindersContainer}>{renderContent()}</View>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <Link href="/screen/home" asChild>
          <TouchableOpacity style={styles.tabButtonNew}>
            <View style={styles.iconContainer}>
              <View
                style={[styles.tabIconContainer, styles.tabIconContainerActive]}
              >
                <Image
                  source={require("../screen/images/home.png")}
                  style={[styles.tabIcon, styles.tabIconLight]}
                />
              </View>
              <Text style={[styles.tabText, styles.tabTextActive]}>Home</Text>
              <View style={styles.tabActiveIndicator} />
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/screen/calendar" asChild>
          <TouchableOpacity style={styles.centerTabButton}>
            <Image
              source={require("../screen/images/calendar-day.png")}
              style={styles.centerTabIcon}
            />
          </TouchableOpacity>
        </Link>

        <Link href="/screen/profile" asChild>
          <TouchableOpacity style={styles.tabButtonNew}>
            <View style={styles.iconContainer}>
              <View style={styles.tabIconContainer}>
                <Image
                  source={require("../screen/images/user.png")}
                  style={styles.tabIcon}
                />
              </View>
              <Text style={styles.tabText}>Profile</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.addReminderContainer}>
        <AddReminder isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      </View>

      {/* Animated Sidebar */}
      {isSidebarVisible && (
        <Animated.View
          style={[
            styles.sidebar,
            { transform: [{ translateX: sidebarAnimation }] },
          ]}
        >
          <ScrollView style={styles.sidebarScrollView}>
            {/* Sidebar Header with Logo */}
            <View style={styles.sidebarHeader}>
              <View style={styles.logoWrapper}>
                <Image
                  source={require("./images/logo.png")}
                  style={styles.sidebarLogo}
                />
              </View>
              <TouchableOpacity
                onPress={toggleSidebar}
                style={styles.sidebarCloseButton}
              >
                <FontAwesome5 name="times" size={24} color="#0B6477" />
              </TouchableOpacity>
            </View>

            <View style={styles.dividerLine} />

            {/* Categories Section */}
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
            >
              <FontAwesome5 name="th-large" size={22} color="#0B6477" solid />
              <Text style={styles.sectionTitle}>Categories</Text>
              <MaterialIcons
                name={
                  isCategoriesExpanded
                    ? "keyboard-arrow-up"
                    : "keyboard-arrow-down"
                }
                size={26}
                color="#0B6477"
              />
            </TouchableOpacity>

            {isCategoriesExpanded && (
              <View style={styles.categoriesList}>
                {/* Display categories with counts */}
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.name}
                    style={[
                      styles.categoryItem,
                      activeTab === category.name && styles.activeCategoryItem,
                    ]}
                    onPress={() => {
                      setActiveTab(category.name);
                      toggleSidebar();
                    }}
                  >
                    <FontAwesome5
                      name={getCategoryIcon(category.name)}
                      size={18}
                      color={activeTab === category.name ? "#0B6477" : "#666"}
                      solid
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        activeTab === category.name &&
                          styles.activeCategoryText,
                      ]}
                    >
                      {category.name}
                    </Text>
                    <Text style={styles.categoryCount}>{category.count}</Text>
                  </TouchableOpacity>
                ))}

                {/* See All Categories Button */}
                <TouchableOpacity
                  style={[styles.categoryItem, styles.seeAllCategories]}
                  onPress={() => {
                    router.push("/screen/categories");
                    toggleSidebar();
                  }}
                >
                  <FontAwesome5 name="list" size={18} color="#0B6477" solid />
                  <Text style={styles.seeAllCategoriesText}>
                    See All Categories
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Star Reminder Button */}
            <Link
              href="/screen/StarReminder"
              style={styles.sidebarButton}
              onPress={toggleSidebar}
            >
              <FontAwesome5 name="star" size={22} color="#0B6477" solid />
              <Text style={styles.sidebarButtonText}>Star Reminder</Text>
            </Link>

            {/* Themes Button */}
            <Link
              href="/screen/theme"
              style={styles.sidebarButton}
              onPress={toggleSidebar}
            >
              <FontAwesome5 name="palette" size={22} color="#0B6477" solid />
              <Text style={styles.sidebarButtonText}>Themes</Text>
            </Link>

            {/* FAQ Button */}
            <TouchableOpacity
              style={styles.sidebarButton}
              onPress={() => {
                router.push("/screen/faq");
                toggleSidebar();
              }}
            >
              <FontAwesome5
                name="question-circle"
                size={22}
                color="#0B6477"
                solid
              />
              <Text style={styles.sidebarButtonText}>FAQ</Text>
            </TouchableOpacity>

            {/* Settings */}
            <TouchableOpacity
              style={styles.sidebarButton}
              onPress={() => {
                router.push("/screen/settings");
                toggleSidebar();
              }}
            >
              <FontAwesome5 name="cog" size={22} color="#0B6477" solid />
              <Text style={styles.sidebarButtonText}>Settings</Text>
            </TouchableOpacity>

            {/* Feedback button */}
            <TouchableOpacity
              style={styles.sidebarButton}
              onPress={() => {
                router.push("screen/feedback");
                toggleSidebar();
              }}
            >
              <FontAwesome5 name="comment" size={22} color="#0B6477" solid />
              <Text style={styles.sidebarButtonText}>Feedback</Text>
            </TouchableOpacity>

            {/* Logout button */}
            <TouchableOpacity
              style={[styles.sidebarButton, styles.logoutButton]}
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={22} color="#ff4444" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FontAwesome5
              name="trash-alt"
              size={36}
              color="#ff4444"
              style={styles.modalIcon}
            />
            <Text style={styles.modalTitle}>Delete Reminder</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this reminder?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteReminder}
              >
                <Text style={[styles.modalButtonText, styles.deleteButtonText]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Complete Confirmation Modal */}
      <Modal
        visible={isCompleteModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FontAwesome5
              name="check-circle"
              size={36}
              color="#4CAF50"
              style={styles.modalIcon}
            />
            <Text style={styles.modalTitle}>Complete Reminder</Text>
            <Text style={styles.modalText}>
              Mark this reminder as completed?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setIsCompleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.completeButton]}
                onPress={handleConfirmComplete}
              >
                <Text
                  style={[styles.modalButtonText, styles.completeButtonText]}
                >
                  Complete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Helper function to get icons for categories
const getCategoryIcon = (categoryName: string) => {
  switch (categoryName) {
    case "All":
      return "layer-group";
    case "Work":
      return "briefcase";
    case "Birthday":
      return "birthday-cake";
    case "Occasion":
      return "calendar-day";
    case "Special":
      return "star";
    default:
      return "tag";
  }
};

export default HomeScreen;
