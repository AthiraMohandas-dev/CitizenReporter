import { Stack } from "expo-router";
import { ReportProvider } from "../context/ReportContext";

export default function RootLayout() {
  return (
    <ReportProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="report" />
        <Stack.Screen name="review" />
        {/* other routes */}
      </Stack>
    </ReportProvider>
  );
}
