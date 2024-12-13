import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from '../styles/settingsstyles';


const SettingsScreen = () => {
  const router = useRouter();

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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Settings Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>Files</Text>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('screen/deletedfiles')}
        >
          <Text style={styles.boldText}>Deleted Files</Text>
          <FontAwesome5 name="chevron-right" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;