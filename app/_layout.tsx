import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerStyle: {
            backgroundColor: "lightblue",
          },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "signup",
          headerStyle: {
            backgroundColor: "lightblue",
          },
          headerShown: false,
        }}
      />
    </Stack>
  )
}
