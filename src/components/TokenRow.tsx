import { StyleSheet, Text, View } from "react-native";

import { TokenBalance } from "../types/solana";

type TokenRowProps = {
  token: TokenBalance;
};

const formatAddress = (value: string) =>
  `${value.slice(0, 6)}…${value.slice(-4)}`;

export function TokenRow({ token }: TokenRowProps) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>{formatAddress(token.mint)}</Text>
        <Text style={styles.subtitle}>{token.mint}</Text>
      </View>
      <Text style={styles.amount}>{token.amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 8,
  },
  content: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e40af",
  },
});
