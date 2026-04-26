import {
  Platform,
  SafeAreaView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export function Swap({
  setScreen,
}: {
  setScreen: (screen: "home" | "swap") => void;
}) {
  const androidTopInset =
    Platform.OS === "android" ? (NativeStatusBar.currentHeight ?? 0) : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" translucent={false} />

      <View style={[styles.header, { paddingTop: androidTopInset + 8 }]}>
        <TouchableOpacity
          onPress={() => setScreen("home")}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Swap</Text>
        <Text style={styles.description}>This is the swap page.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
  },
  description: {
    color: "#cbd5e1",
    fontSize: 15,
    marginTop: 8,
  },
  backButtonText: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
