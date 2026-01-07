import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth } from '../../firebase';
import { db } from '../../firebase';
import styles from '../styles/deletedfilesstyles';


interface DeletedFile {
  id: string;
  context: string;
  userId: string;
  // other fields if needed
}

const DeletedFilesScreen = () => {
  const router = useRouter();
  const [deletedFiles, setDeletedFiles] = useState<DeletedFile[]>([]);
  const [loading, setLoading] = useState(true);

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
        files.push({
          id: doc.id,
          ...doc.data(),
        } as DeletedFile);
      });

      setDeletedFiles(files);
    } catch (error) {
      console.error('Error fetching deleted files:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: DeletedFile }) => (
    <View style={styles.fileItem}>
      <Text style={styles.context}>{item.context}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deleted Files</Text>
      </View>

      {/* Content */}
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : deletedFiles.length === 0 ? (
        <Text style={styles.emptyText}>No deleted files found</Text>
      ) : (
        <FlatList
          data={deletedFiles}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default DeletedFilesScreen;