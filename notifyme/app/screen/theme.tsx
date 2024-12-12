import React, { createContext, useContext, useState } from 'react';
import { View, Text, Button } from 'react-native';

// Define the themes
const themes = {
    light: {
        background: '#ffffff',
        color: '#000000',
    },
    dark: {
        background: '#000000',
        color: '#ffffff',
    },
};
// Create a context for the theme
const ThemeContext = createContext({ theme: themes.light, toggleTheme: () => {} });

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [theme, setTheme] = useState(themes.light); // Default theme
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === themes.light ? themes.dark : themes.light));
    };
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
// Custom hook to use the theme
export const useTheme = () => {
    return useContext(ThemeContext);
};

// Example component that uses the theme
const ThemedComponent = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <View style={{ backgroundColor: theme.background, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: theme.color }}>Theme</Text>
            <Button title="Toggle Theme" onPress={toggleTheme} />
        </View>
    );
};

// Export the ThemedComponent if needed
export default ThemedComponent;