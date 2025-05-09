import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import styles from '../styles/registerstyles';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const router = useRouter();

  const validateUsername = (username: string) => {
    if (!username) {
      setUsernameError('Username is required');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleRegister = async () => {
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }
    
    setIsLoading(true);
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
      console.error('Registration error:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            {!isTyping && (
              <Image source={require('../screen/images/logo.png')} style={styles.logo} />
            )}
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
            
            <View style={styles.inputContainer}>
              <Image source={require('../screen/images/user.png')} style={styles.icon} />
              <TextInput
                placeholder="Username"
                placeholderTextColor="#9DA3B4"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setIsTyping(text.length > 0);
                  if (usernameError) validateUsername(text);
                }}
                onFocus={() => setIsTyping(true)}
                onBlur={() => {
                  setIsTyping(
                    username.length > 0 || 
                    email.length > 0 || 
                    password.length > 0 || 
                    confirmPassword.length > 0
                  );
                  validateUsername(username);
                }}
                style={styles.input}
              />
            </View>
            {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
            
            <View style={styles.inputContainer}>
              <Image source={require('../screen/images/envelope.png')} style={styles.icon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#9DA3B4"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setIsTyping(text.length > 0);
                  if (emailError) validateEmail(text);
                }}
                onFocus={() => setIsTyping(true)}
                onBlur={() => {
                  setIsTyping(
                    username.length > 0 || 
                    email.length > 0 || 
                    password.length > 0 || 
                    confirmPassword.length > 0
                  );
                  validateEmail(email);
                }}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            
            <View style={styles.inputContainer}>
              <Image source={require('../screen/images/lock.png')} style={styles.icon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#9DA3B4"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setIsTyping(text.length > 0);
                  if (passwordError) validatePassword(text);
                  if (confirmPassword && confirmPasswordError) validateConfirmPassword(confirmPassword);
                }}
                onFocus={() => setIsTyping(true)}
                onBlur={() => {
                  setIsTyping(
                    username.length > 0 || 
                    email.length > 0 || 
                    password.length > 0 || 
                    confirmPassword.length > 0
                  );
                  validatePassword(password);
                }}
                style={styles.input}
              />
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            
            <View style={styles.inputContainer}>
              <Image source={require('../screen/images/lock.png')} style={styles.icon} />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#9DA3B4"
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setIsTyping(text.length > 0);
                  if (confirmPasswordError) validateConfirmPassword(text);
                }}
                onFocus={() => setIsTyping(true)}
                onBlur={() => {
                  setIsTyping(
                    username.length > 0 || 
                    email.length > 0 || 
                    password.length > 0 || 
                    confirmPassword.length > 0
                  );
                  validateConfirmPassword(confirmPassword);
                }}
                style={styles.input}
              />
            </View>
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            
            <TouchableOpacity 
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footerContainer}>
            <Link href="/screen/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginAccount}>
                  Already have an account? <Text style={styles.loginLink}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;