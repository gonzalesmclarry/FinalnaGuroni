import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function ResetCodeScreen() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Image source={require('../screen/images/logo.png')} style={styles.logo} /> {/* Adjust the path if needed */}
            <View style={styles.box}>
                <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                    <Image source={require('../screen/images/ex.png')} style={styles.iconImage} />
                </TouchableOpacity>
                <Image source={require('../screen/images/email.png')} style={styles.icon} /> {/* Adjust the path if needed */}
                <Text style={styles.title}>Password Reset Code</Text>
                <Text style={styles.subtitle}>
                    Enter the 6 digit code we sent to your email.
                </Text>
                <View style={styles.codeContainer}>
                    {code.map((_, index) => (
                        <TextInput
                            key={index}
                            style={styles.codeInput}
                            maxLength={1}
                            keyboardType="number-pad"
                            value={code[index]}
                            onChangeText={(text) => {
                                const newCode = [...code];
                                newCode[index] = text;
                                setCode(newCode);
                            }}
                        />
                    ))}
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
                <Text style={styles.note}>
                    Didn’t receive the email?{' '}
                    <Text style={styles.clickableText}>Click here</Text>
                </Text>
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
        position: 'relative'
    },
    iconButton: {
        position: 'absolute', // Position the icon button within the box
        top: 1, // Adjust top positioning
        right: 1, // Adjust right positioning
        padding: 10,
    },
    iconImage: {
        width: 30, // Set the desired width for your icon
        height: 30, // Set the desired height for your icon

    },
    icon: {
        width: 30, // Adjust size as needed
        height: 30, // Adjust size as needed
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    codeInput: {
        width: 45,
        height: 45,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        textAlign: 'center',
        fontSize: 18,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    button: {
        backgroundColor: '#47d0e6',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '50%',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    note: {
        marginTop: 15,
        fontSize: 13,
        color: '#555',
    },
    clickableText: {
        color: '#00B4D8',
        fontWeight: 'bold',
    },
});