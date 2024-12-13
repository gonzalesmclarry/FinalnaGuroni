import { Stack } from 'expo-router';

export default function ScreenLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />

    <Stack.Screen
        name="password"
        options={{ headerShown: false }}
      />

    <Stack.Screen
        name="reset"
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name="profile"
        options={{ headerShown: false}}
      />

      <Stack.Screen
        name="calendar"
        options={{ headerShown: false}}
      />      

      <Stack.Screen
        name="StarReminder"
        options={{ headerShown: false}}
      />

      <Stack.Screen
        name="home"
        options={{ headerShown: false}}
      />

      <Stack.Screen
        name="register" 
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="categories"
        options={{ headerShown: false }} 
      />

      <Stack.Screen
        name="settings"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="deletedfiles"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="feedback"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="faq"
        options={{ headerShown: false }}
      />

    </Stack>
  );
}