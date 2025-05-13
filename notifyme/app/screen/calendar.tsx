// Enhanced CalendarScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Calendar as RNCalendar } from "react-native-calendars";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import styles from "../styles/calendarstyles";
import {
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AddReminder from "./addreminder";

// Add this interface for marked dates
interface MarkedDates {
  [date: string]: {
    marked: boolean;
    dotColor: string;
    selected?: boolean;
    selectedColor?: string;
  };
}

interface Reminder {
  id: string;
  title: string;
  date: Date;
  category: string;
  status: string;
}

const CalendarScreen = () => {
  const router = useRouter();
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filteredReminders, setFilteredReminders] = useState<Reminder[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Personal", "Work", "Health", "Bills", "Other"];

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setIsLoading(true);
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setIsLoading(false);
          return;
        }

        const remindersRef = collection(db, "reminders");
        const userRemindersQuery = query(
          remindersRef,
          where("userID", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(userRemindersQuery);

        const marked: MarkedDates = {};
        const fetchedReminders: Reminder[] = [];

        querySnapshot.forEach((doc) => {
          const reminderData = doc.data();

          // Robust date handling
          let date: Date;
          if (reminderData.date instanceof Timestamp) {
            // If it's a Firestore Timestamp
            date = reminderData.date.toDate();
          } else if (typeof reminderData.date === "string") {
            // If it's a date string
            date = new Date(reminderData.date);
          } else if (reminderData.date instanceof Date) {
            // If it's already a Date object
            date = reminderData.date;
          } else {
            // If date is undefined or invalid, skip this reminder
            console.warn(`Invalid date for reminder: ${doc.id}`, reminderData);
            return;
          }

          const dateString = date.toISOString().split("T")[0];

          marked[dateString] = {
            marked: true,
            dotColor: "#0B6477",
          };

          fetchedReminders.push({
            id: doc.id,
            title: reminderData.title || "Untitled Reminder",
            date: date,
            category: reminderData.category || "Other",
            status: reminderData.completed ? "Completed" : "Pending",
          });
        });

        setMarkedDates(marked);
        setReminders(fetchedReminders);

        // Set today as default selected date
        const today = new Date().toISOString().split("T")[0];
        handleDateSelect(today);
      } catch (error) {
        console.error("Error fetching reminders: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const handleDateSelect = (dateString: string) => {
    // Update the selected date in the calendar
    const updatedMarkedDates = { ...markedDates };

    // Reset previous selection
    Object.keys(updatedMarkedDates).forEach((date) => {
      if (updatedMarkedDates[date].selected) {
        updatedMarkedDates[date] = {
          ...updatedMarkedDates[date],
          selected: false,
        };
      }
    });

    // Mark the new selection
    updatedMarkedDates[dateString] = {
      ...(updatedMarkedDates[dateString] || {
        marked: false,
        dotColor: "#0B6477",
      }),
      selected: true,
      selectedColor: "#5CD3C8",
    };

    setMarkedDates(updatedMarkedDates);
    setSelectedDate(dateString);

    // Filter reminders for this date
    filterRemindersForDate(dateString);
  };

  const filterRemindersForDate = (dateString: string) => {
    const dateObject = new Date(dateString);
    dateObject.setHours(0, 0, 0, 0);

    const nextDay = new Date(dateObject);
    nextDay.setDate(nextDay.getDate() + 1);

    const filtered = reminders.filter((reminder) => {
      const reminderDate = new Date(reminder.date);
      reminderDate.setHours(0, 0, 0, 0);
      return reminderDate.getTime() === dateObject.getTime();
    });

    setFilteredReminders(filtered);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);

    // No need to refilter if 'All' is selected
    if (category === "All") {
      filterRemindersForDate(selectedDate);
      return;
    }

    // Filter by both date and category
    const dateObject = new Date(selectedDate);
    dateObject.setHours(0, 0, 0, 0);

    const filtered = reminders.filter((reminder) => {
      const reminderDate = new Date(reminder.date);
      reminderDate.setHours(0, 0, 0, 0);
      return (
        reminderDate.getTime() === dateObject.getTime() &&
        (category === "All" || reminder.category === category)
      );
    });

    setFilteredReminders(filtered);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#0B6477" />
        <Text style={{ marginTop: 20, color: "#0B6477" }}>
          Loading calendar...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#A8D8E4" barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Calendar Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Calendar</Text>
          <Text style={styles.headerSubtitle}>Manage your schedule</Text>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <RNCalendar
            style={styles.calendar}
            theme={{
              calendarBackground: "#C5DEE3",
              textSectionTitleColor: "#333333",
              dayTextColor: "#333333",
              todayTextColor: "#0B6477",
              selectedDayTextColor: "#fff",
              monthTextColor: "#333333",
              textDisabledColor: "#999",
              arrowColor: "#0B6477",
              dotColor: "#0B6477",
              selectedDotColor: "#ffffff",
              indicatorColor: "#0B6477",
            }}
            markedDates={markedDates}
            onDayPress={(day: { dateString: string }) =>
              handleDateSelect(day.dateString)
            }
            enableSwipeMonths={true}
          />
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterLabel}>Reminder Categories</Text>
            <Text style={styles.dateDisplay}>{formatDate(selectedDate)}</Text>
          </View>

          <View style={styles.filterContent}>
            <View style={styles.filterCategories}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category &&
                      styles.categoryChipSelected,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category &&
                        styles.categoryTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Daily Reminders Section */}
        <Text style={styles.sectionTitle}>Daily Reminders</Text>
        <View style={styles.reminderSection}>
          {filteredReminders.length > 0 ? (
            filteredReminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderCard}>
                <View style={styles.reminderIcon}>
                  <MaterialCommunityIcons
                    name={
                      reminder.category === "Health"
                        ? "medical-bag"
                        : reminder.category === "Work"
                        ? "briefcase"
                        : reminder.category === "Bills"
                        ? "cash-multiple"
                        : reminder.category === "Personal"
                        ? "account"
                        : "bookmark"
                    }
                    size={22}
                    color="#fff"
                  />
                </View>
                <View style={styles.reminderContent}>
                  <Text style={styles.reminderTitle}>{reminder.title}</Text>
                  <View style={styles.reminderMeta}>
                    <Text style={styles.reminderTime}>
                      {reminder.date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                    <Text
                      style={[
                        styles.reminderStatus,
                        reminder.status === "Completed"
                          ? styles.statusCompleted
                          : styles.statusPending,
                      ]}
                    >
                      {reminder.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No reminders for this day
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <Link href="/screen/home" asChild>
          <TouchableOpacity style={styles.tabButton}>
            <View style={styles.iconContainer}>
              <View style={styles.tabIconContainer}>
                <Image
                  source={require("../screen/images/home.png")}
                  style={styles.tabIcon}
                />
              </View>
              <Text style={styles.tabText}>Home</Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/screen/calendar" asChild>
          <TouchableOpacity style={styles.centerTabButton}>
            <Image
              source={require("../screen/images/whitecalendar.png")}
              style={styles.centerTabIcon}
            />
          </TouchableOpacity>
        </Link>

        <Link href="/screen/profile" asChild>
          <TouchableOpacity style={styles.tabButton}>
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
    </View>
  );
};

export default CalendarScreen;
