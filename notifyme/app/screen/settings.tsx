import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from '../styles/settingsstyles';
import { auth, db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';

const SettingsScreen = () => {
  const router = useRouter();
  const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const handleUpdateUsername = async () => {
    try {
      if (!newUsername.trim()) {
        Alert.alert('Error', 'Username cannot be empty');
        return;
      }

      const currentUser = auth.currentUser;
      if (currentUser) {
        // Update username in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          username: newUsername
        });

        Alert.alert('Success', 'Username updated successfully');
        setIsUsernameModalVisible(false);
        setNewUsername('');
      }
    } catch (error) {
      console.error('Error updating username:', error);
      Alert.alert('Error', 'Failed to update username');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (!newPassword.trim()) {
        Alert.alert('Error', 'Password cannot be empty');
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert('Error', 'Password should be at least 6 characters');
        return;
      }

      const currentUser = auth.currentUser;
      if (currentUser) {
        // Update password in Firebase Auth
        await updatePassword(currentUser, newPassword);

        Alert.alert('Success', 'Password updated successfully');
        setIsPasswordModalVisible(false);
        setNewPassword('');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      
      // Handle specific error cases
      if ((error as { code?: string }).code === 'auth/requires-recent-login') {
        Alert.alert(
          'Error', 
          'Please log out and log in again before changing your password'
        );
      } else {
        Alert.alert('Error', 'Failed to update password');
      }
    }
  };

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

      {/* Profile Settings */}
      <View style={styles.content}>
        <Text style={styles.contentText}>Profile</Text>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => setIsUsernameModalVisible(true)}
        >
          <Text style={styles.boldText}>Change Username</Text>
          <FontAwesome5 name="chevron-right" size={20} color="black" />
        </TouchableOpacity>

        {/* Username Modal */}
        <Modal
          visible={isUsernameModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new username"
                value={newUsername}
                onChangeText={setNewUsername}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setIsUsernameModalVisible(false);
                    setNewUsername('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.updateButton]}
                  onPress={handleUpdateUsername}
                >
                  <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => setIsPasswordModalVisible(true)}
        >
          <Text style={styles.boldText}>Change Password</Text>
          <FontAwesome5 name="chevron-right" size={20} color="black" />
        </TouchableOpacity>

        {/* Password Modal */}
        <Modal
          visible={isPasswordModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={true}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setIsPasswordModalVisible(false);
                    setNewPassword('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.updateButton]}
                  onPress={handleUpdatePassword}
                >
                  <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {/* Files Settings */}
      <View style={styles.content}>
        <Text style={[styles.contentText, {marginTop: -70}]}>Files</Text>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push('screen/deletedfiles')}
        >
          <Text style={styles.boldText}>Deleted Files</Text>
          <FontAwesome5 name="chevron-right" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Notifications Settings */}
      <View style={styles.content}>
        <Text style={[styles.contentText, {marginTop: -170}]}>Notifications</Text>
        <View style={styles.menuItem}>
          <Text style={styles.boldText}>Enable Notifications</Text>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={setIsNotificationsEnabled}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isNotificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;