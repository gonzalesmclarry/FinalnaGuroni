import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const RootLayout = () => {
    return (
        <>
            {/* Set the StatusBar to visible */}
            <StatusBar style="dark" hidden={false} />
            
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
            </Stack>
        </>
    );
};

export default RootLayout;
