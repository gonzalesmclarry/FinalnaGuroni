import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import styles from '../styles/loginstyles';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User Data:', userData);
          
          alert('Login successful!');
          router.push('/screen/home');
        } else {
          alert('User profile not found in database');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../screen/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Login Now</Text>
      <View style={styles.inputContainer}>
        <Image source={require('../screen/images/envelope.png')} style={styles.icon} />
        <TextInput
          placeholder="Email/Username"
          placeholderTextColor="#C0C0C0"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <Image source={require('../screen/images/lock.png')} style={styles.icon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#C0C0C0"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      
      {/* Add spacing by using separate View containers */}
      <View style={{ marginVertical: 20 }}>
        <Link href="/screen/password">
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </Link>
      </View>

      <View style={{ marginTop: 50 }}>
        <Link href="/screen/register">
          <Text style={styles.createAccount}>
            Don’t have an account? <Text style={styles.createLink}>Create here</Text>
          </Text>
        </Link>
      </View>
    </View>
  );
};

export default LoginScreen;