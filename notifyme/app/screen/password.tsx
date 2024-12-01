import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Image source={require('../screen/images/logo.png')} style={styles.logo} />
            <View style={styles.box}>
                <TouchableOpacity 
                    style={styles.iconButton} 
                    onPress={() => router.back()} // Navigate back when icon is pressed
                >
                    <Image source={require('../screen/images/ex.png')} style={styles.iconImage} />
                </TouchableOpacity>
                <Image source={require('../screen/images/warning.png')} style={styles.icon} />
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>
                    Enter your email and we'll send you a link to reset your password.
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#7E7E7E"
                    value={email}
                    onChangeText={setEmail} // Update state on input change
                />
                <TouchableOpacity style={styles.button}
                    onPress={() => router.push('/screen/reset')}>
                    <Text style={styles.buttonText}>Send code</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a3d8e7',
    },
    logo: {
        width: 350,
        height: 160,
        resizeMode: 'contain',
        position: 'absolute',
        top: 30,
        left: -70,
    },
    box: {
        width: '85%',
        backgroundColor: '#C5DEE3',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
        position: 'relative'
    },
    iconButton: {
        position: 'absolute', // Position the icon button within the box
        top: 10, // Adjust top positioning
        right: 10, // Adjust right positioning
        padding: 10,
    },
    iconImage: {
        width: 30, // Set the desired width for your icon
        height: 30, // Set the desired height for your icon
    },
    icon: {
        width: 30,
        height: 30,
        color: '#00B4D8',
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    button: {
        backgroundColor: '#47d0e6',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '50%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
});