import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  StatusBar,
  Image,
  Alert
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { collection, getDocs, query, where, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

// Define new styles matching the profile style
const colors = {
  primary: '#0B6477',
  secondary: '#5CD3C8',
  background: '#A8D8E4',
  cardBackground: '#C5DEE3',
  text: '#333333',
  white: '#FFFFFF',
  lightGray: '#F0F0F0',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

interface DeletedFile {
  id: string;
  context: string;
  userId: string;
  deletedDate: any; // Firestore timestamp
  category?: string;
  date?: string;
  time?: string;
  categoryID?: string;
  userID?: string;
  // other fields if needed
}

const DeletedFilesScreen = () => {
  const router = useRouter();
  const [deletedFiles, setDeletedFiles] = useState<DeletedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('All');

  const categories = ['All', 'Personal', 'Work', 'Health', 'Bills', 'Other'];

  useEffect(() => {
    fetchDeletedFiles();
  }, []);

  const fetchDeletedFiles = async () => {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        console.log('No user logged in');
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, 'deleted'),
        where('userID', '==', currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const files: DeletedFile[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        files.push({
          id: doc.id,
          context: data.title || data.context || 'Unnamed reminder',
          userId: data.userID,
          deletedDate: data.deletedDate || data.deletedAt || new Date(),
          category: data.category || 'Other',
          date: data.date || '',
          time: data.time || '',
          categoryID: data.categoryID || '',
          userID: data.userID || '',
        } as DeletedFile);
      });

      setDeletedFiles(files);
    } catch (error) {
      console.error('Error fetching deleted files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // In a real app, you would filter the data here based on category
  };

  // Function to handle timeframe selection
  const handleTimeframeSelect = (timeframe: string) => {
    setSelected(timeframe);
    setIsOpen(false);
    // In a real app, you would fetch filtered data here
  };

  // Format the date to a readable string
  const formatDate = (date: any) => {
    if (!date) return 'Unknown date';
    
    // If it's a Firestore timestamp, convert to JS Date
    const jsDate = date.toDate ? date.toDate() : new Date(date);
    
    return jsDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Function to handle restoring a deleted file
  const handleRestoreReminder = async (item: DeletedFile) => {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to restore reminders');
        return;
      }
      
      // Create a new reminder document in the reminders collection
      await addDoc(collection(db, 'reminders'), {
        title: item.context,
        date: item.date || '',
        time: item.time || '',
        categoryID: item.categoryID || 'Other',
        userID: currentUser.uid
      });
      
      // Remove the item from the deleted collection
      await deleteDoc(doc(db, 'deleted', item.id));
      
      // Update the UI by removing the item from the list
      setDeletedFiles(prevFiles => prevFiles.filter(file => file.id !== item.id));
      
      // Show success message
      Alert.alert('Success', 'Reminder has been restored successfully');
      
    } catch (error) {
      console.error('Error restoring reminder:', error);
      Alert.alert('Error', 'Failed to restore reminder. Please try again.');
    }
  };

  const renderItem = ({ item }: { item: DeletedFile }) => (
    <View style={{
      backgroundColor: colors.cardBackground,
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      }}>
        <MaterialIcons name="delete-outline" size={22} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 15,
          fontWeight: '600',
          color: colors.text,
        }}>{item.context}</Text>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 5,
        }}>
          <Text style={{
            fontSize: 12,
            color: colors.text,
            opacity: 0.7,
          }}>Deleted on {formatDate(item.deletedDate)}</Text>
          
          <TouchableOpacity onPress={() => handleRestoreReminder(item)}>
            <Text style={{
              fontSize: 12,
              color: colors.primary,
              fontWeight: '500',
            }}>Restore</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 20, color: colors.primary }}>Loading deleted files...</Text>
      </View>
    );
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 40,
    }}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />

      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        justifyContent: 'space-between',
      }}>
        <TouchableOpacity 
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.white,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.text,
        }}>Deleted Files</Text>
        <View style={{ width: 40 }} /> {/* Empty view for centering */}
      </View>

      {/* Filter Section */}
      <View style={{
        width: '90%',
        alignSelf: 'center',
        backgroundColor: colors.cardBackground,
        padding: 20,
        borderRadius: 15,
        marginVertical: 10,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 15,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
          }}>Filter Deleted Files</Text>
          
          <TouchableOpacity 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.secondary,
              borderRadius: 8,
              padding: 8,
              paddingHorizontal: 12,
            }}
            onPress={() => setIsOpen(!isOpen)}>
            <Text style={{
              color: colors.white,
              marginRight: 5,
              fontSize: 14,
              fontWeight: '500',
            }}>{selected}</Text>
            <MaterialIcons 
              name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={18} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>
        
        {isOpen && (
          <View style={{
            position: 'absolute',
            top: 70,
            right: 20,
            backgroundColor: colors.white,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
            zIndex: 1000,
            width: 120,
            overflow: 'hidden',
          }}>
            {['All', '1 week', '1 month', '3 months'].map((timeframe) => (
              <TouchableOpacity 
                key={timeframe}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.lightGray,
                  alignItems: 'center',
                }}
                onPress={() => handleTimeframeSelect(timeframe)}>
                <Text style={{
                  color: colors.text,
                  fontSize: 14,
                }}>{timeframe}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <View style={{ paddingVertical: 10 }}>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            gap: 10,
          }}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  backgroundColor: selectedCategory === category ? colors.secondary : colors.shadow,
                  borderRadius: 20,
                }}
                onPress={() => handleCategorySelect(category)}
              >
                <Text 
                  style={{
                    color: selectedCategory === category ? colors.white : colors.text,
                    fontSize: 13,
                    fontWeight: selectedCategory === category ? '500' : 'normal',
                  }}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Content */}
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 25,
        marginBottom: 15,
        paddingHorizontal: 25,
        color: colors.text,
      }}>Deleted Items</Text>
      
      {deletedFiles.length === 0 ? (
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 30,
        }}>
          <MaterialIcons name="delete-outline" size={60} color={colors.primary} style={{ opacity: 0.5 }} />
          <Text style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 16,
            color: colors.text,
            opacity: 0.7,
          }}>No deleted files found</Text>
        </View>
      ) : (
        <FlatList
          data={deletedFiles}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            width: '90%',
            alignSelf: 'center',
            paddingBottom: 100,
          }}
        />
      )}
    </View>
  );
};

export default DeletedFilesScreen;