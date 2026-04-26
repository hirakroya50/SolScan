import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Transaction } from "../types/solana";

type TransactionRowProps = {
  transaction: Transaction;
};

const formatAddress = (value: string) =>
  `${value.slice(0, 6)}…${value.slice(-4)}`;

const formatDate = (timestamp: number | null) =>
  timestamp ? new Date(timestamp * 1000).toLocaleDateString() : "—";

export function TransactionRow({ transaction }: TransactionRowProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() =>
        Linking.openURL(`https://solscan.io/tx/${transaction.sig}`)
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>{formatAddress(transaction.sig)}</Text>
        <Text style={styles.subtitle}>{formatDate(transaction.time)}</Text>
      </View>
      <View
        style={[
          styles.badge,
          transaction.ok ? styles.badgeSuccess : styles.badgeFailure,
        ]}
      >
        <Text style={styles.badgeText}>
          {transaction.ok ? "Success" : "Failed"}
        </Text>
      </View>
    </TouchableOpacity>
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
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeSuccess: {
    backgroundColor: "#dcfce7",
  },
  badgeFailure: {
    backgroundColor: "#fee2e2",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0f172a",
  },
});
