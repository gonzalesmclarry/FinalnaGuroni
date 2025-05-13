import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import styles from '../styles/settingsstyles';

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

  const renderSectionTitle = (title: string) => (
    <View style={styles.sectionTitleContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.divider} />
    </View>
  );

  const renderSettingItem = (
    title: string, 
    icon: string, 
    onPress: (() => void) | undefined, 
    rightElement: React.ReactNode = null
  ) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={onPress === undefined}
    >
      <View style={styles.settingItemLeft}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name={icon} size={16} color="#FFF" />
        </View>
        <Text style={styles.settingItemText}>{title}</Text>
      </View>
      {rightElement || (onPress && <FontAwesome5 name="chevron-right" size={18} color="#555" />)}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        {renderSectionTitle('Profile')}
        <View style={styles.settingsGroup}>
          {renderSettingItem('Change Username', 'user-edit', () => setIsUsernameModalVisible(true))}
          {renderSettingItem('Change Password', 'lock', () => setIsPasswordModalVisible(true))}
        </View>

        {/* Files Section */}
        {renderSectionTitle('Files')}
        <View style={styles.settingsGroup}>
          {renderSettingItem('Deleted Files', 'trash-restore', () => router.push('screen/deletedfiles'))}
        </View>

        {/* Notification Section */}
        {renderSectionTitle('Notifications')}
        <View style={styles.settingsGroup}>
            {renderSettingItem('Push Notifications', 'bell', undefined, 
            <Switch
              value={isNotificationsEnabled}
              onValueChange={setIsNotificationsEnabled}
              trackColor={{ false: "#e0e0e0", true: "#47d0e6" }}
              thumbColor={isNotificationsEnabled ? "#fff" : "#f4f3f4"}
              ios_backgroundColor="#e0e0e0"
              style={styles.switch}
            />
            )}
        </View>

        {/* About Section */}
        {renderSectionTitle('About')}
        <View style={styles.settingsGroup}>
          {renderSettingItem('Privacy Policy', 'shield-alt', () => {})}
          {renderSettingItem('Terms of Service', 'file-contract', () => {})}
          {renderSettingItem('App Version', 'info-circle', undefined, 
            <Text style={styles.versionText}>1.0.0</Text>
          )}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton}>
          <FontAwesome5 name="sign-out-alt" size={16} color="#fff" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Username Modal */}
      <Modal
        visible={isUsernameModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new username"
              value={newUsername}
              onChangeText={setNewUsername}
              autoCapitalize="none"
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

      {/* Password Modal */}
      <Modal
        visible={isPasswordModalVisible}
        transparent={true}
        animationType="fade"
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
  );
};

export default SettingsScreen;