import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import styles from '../styles/registerstyles';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter(); // Initialize the router

  const handleRegister = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data using their UID as document ID
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: email,
        createdAt: new Date().toISOString(),
        userID: user.uid  // Add userID to the document data
      });

      alert('Registration successful!');
      router.push('/screen/login');
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };
  
  const handleTextInputFocus = () => {
    setIsTyping(true);
  };

  const handleTextInputBlur = () => {
    setIsTyping(false);
  };

  return (
    <View style={styles.container}>
      {!isTyping && (
        <Image source={require('../screen/images/logo.png')} style={styles.logo} />
      )}
  
      <Text style={styles.title}>Let's Get Started!</Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor="#C0C0C0"
        value={username}
        onChangeText={setUsername}
        onFocus={handleTextInputFocus}
        onBlur={handleTextInputBlur}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#C0C0C0"
        value={email}
        onChangeText={setEmail}
        onFocus={handleTextInputFocus}
        onBlur={handleTextInputBlur}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#C0C0C0"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onFocus={handleTextInputFocus}
        onBlur={handleTextInputBlur}
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#C0C0C0"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        onFocus={handleTextInputFocus}
        onBlur={handleTextInputBlur}
        style={styles.input}
      />

      <TouchableOpacity style={styles.createButton} onPress={handleRegister}>
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Already have an account?{' '}
        <Link href="/screen/login"> 
          <Text style={styles.loginLink}>Login here</Text>
        </Link>
      </Text>
    </View>
  );
};

export default RegisterScreen;