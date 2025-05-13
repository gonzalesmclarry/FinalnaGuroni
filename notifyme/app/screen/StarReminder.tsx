import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface Reminder {
  id: string;
  title: string;
  categoryID: string;
  date: string;
  time: string;
  originalReminderId?: string; // Added for reference to the original reminder
}

const StarReminderScreen = () => {
  const navigation = useNavigation();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          // Use onSnapshot instead of getDocs to get real-time updates
          const remindersQuery = query(
            collection(db, "star_reminder"),
            where("userID", "==", user.uid)
          );

          // Subscribe to real-time updates
          const unsubscribe = onSnapshot(
            remindersQuery,
            (snapshot) => {
              const fetchedReminders = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as Reminder[];

              setReminders(fetchedReminders);
              setLoading(false);
            },
            (err) => {
              console.error("Error in snapshot listener: ", err);
              setError("Failed to load your starred reminders");
              setLoading(false);
            }
          );

          // Return unsubscribe function for cleanup
          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Error fetching reminders: ", error);
        setError("Failed to load your starred reminders");
        setLoading(false);
      }
    };

    // Call the function and store the unsubscribe function
    let unsubscribe: (() => void) | undefined;

    fetchReminders().then((cleanup) => {
      unsubscribe = cleanup;
    });

    // Cleanup subscription on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Function to unstar a reminder
  const handleUnstarReminder = async (reminderId: string) => {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "star_reminder", reminderId));
      // No need to update state manually as onSnapshot will handle it
    } catch (error) {
      console.error("Error unstarring reminder: ", error);
      setError("Failed to unstar reminder");
    }
  };

  // Modified to navigate to home screen
  const navigateToHome = () => {
    navigation.navigate("home" as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E1F5FE" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel="Go back"
          >
            <MaterialIcons name="arrow-back" size={24} color="#0277BD" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Starred Reminders</Text>
          <View style={styles.placeholder} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0277BD" />
            <Text style={styles.loadingText}>Loading reminders...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={48} color="#D32F2F" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                setLoading(true);
                // Retry logic would go here
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : reminders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="star-border" size={64} color="#BDBDBD" />
            <Text style={styles.emptyText}>No starred reminders yet</Text>
            <TouchableOpacity style={styles.addButton} onPress={navigateToHome}>
              <Text style={styles.addButtonText}>Add New Reminder</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.titleColumn]}>
                Title
              </Text>
              <Text style={[styles.tableHeaderText, styles.categoryColumn]}>
                Category
              </Text>
              <Text style={[styles.tableHeaderText, styles.dateColumn]}>
                Date
              </Text>
              <Text style={[styles.tableHeaderText, styles.actionColumn]}>
                Action
              </Text>
            </View>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              {reminders.map((reminder, index) => (
                <View
                  key={reminder.id}
                  style={[
                    styles.reminderRow,
                    index % 2 === 0 ? styles.evenRow : styles.oddRow,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.reminderContent}
                    onPress={() => {}}
                    accessibilityLabel={`Reminder: ${reminder.title}`}
                  >
                    <Text
                      style={[styles.reminderText, styles.titleColumn]}
                      numberOfLines={1}
                    >
                      {reminder.title}
                    </Text>
                    <Text
                      style={[styles.reminderText, styles.categoryColumn]}
                      numberOfLines={1}
                    >
                      {reminder.categoryID}
                    </Text>
                    <Text style={[styles.reminderText, styles.dateColumn]}>
                      {formatDate(reminder.date)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.unstarButton}
                    onPress={() => handleUnstarReminder(reminder.id)}
                  >
                    <MaterialIcons name="star" size={24} color="#FFD700" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E1F5FE",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E1F5FE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0277BD",
    textAlign: "center",
  },
  placeholder: {
    width: 40, // Balance the header layout
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0277BD",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  tableHeaderText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 14,
  },
  titleColumn: {
    flex: 2,
    paddingHorizontal: 4,
  },
  categoryColumn: {
    flex: 1,
    paddingHorizontal: 4,
    textAlign: "center",
  },
  dateColumn: {
    flex: 1,
    paddingHorizontal: 4,
    textAlign: "right",
  },
  actionColumn: {
    width: 50,
    paddingHorizontal: 4,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  reminderContent: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
  },
  evenRow: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  oddRow: {
    backgroundColor: "rgba(224, 242, 251, 0.9)",
  },
  reminderText: {
    fontSize: 14,
    color: "#333",
  },
  unstarButton: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#0277BD",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#D32F2F",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#0277BD",
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    marginBottom: 16,
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#0277BD",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default StarReminderScreen;
