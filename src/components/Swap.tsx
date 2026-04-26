import { Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwapCard } from "./swap/SwapCard";
import { SwapDirectionButton } from "./swap/SwapDirectionButton";

export function Swap({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Swap Tokens</Text>

        <SafeAreaView
          style={{
            borderWidth: 1, // The thickness of the line
            borderColor: "#fff", // The color (Black)
            borderRadius: 8, // Optional: Rounds the corners
            borderStyle: "solid",
          }}
        >
          <SwapCard
            symbol="ETH"
            amount="0.28014"
            balanceText="Balance: 0.0661 ETH"
            usdText="$499.749"
            iconBackground="#4f6fd8"
          />

          {/* <View
            style={{ alignItems: "center", marginVertical: -18, zIndex: 2 }}
          >
            <SwapDirectionButton />
          </View> */}

          <SwapCard
            symbol="DAI"
            amount="500"
            balanceText="Balance: 250 DAI"
            usdText="$499.419"
            iconBackground="#fbbf24"
          />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
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
} as const;
