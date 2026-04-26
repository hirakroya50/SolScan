import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { EmptyState } from "./src/components/EmptyState";
import { TokenRow } from "./src/components/TokenRow";
import { TransactionRow } from "./src/components/TransactionRow";
import { getWalletOverview } from "./src/lib/solana";
import { TokenBalance, Transaction } from "./src/types/solana";
import { Swap } from "./src/components/Swap";

const EMPTY_TOKENS_DESCRIPTION =
  "This wallet holds no SPL tokens with a balance.";
const EMPTY_TRANSACTIONS_DESCRIPTION =
  "This wallet has no recent transaction history.";
const SEARCH_ERROR_FALLBACK =
  "Something went wrong. Check the address and try again.";

type AppScreen = "home" | "swap";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("home");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    const trimmedAddress = address.trim();

    if (!trimmedAddress) {
      setError("Please enter a wallet address.");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(false);

    try {
      const overview = await getWalletOverview(trimmedAddress);

      setBalance(overview.balance);
      setTokens(overview.tokens);
      setTxns(overview.txns);
      setSearched(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : SEARCH_ERROR_FALLBACK;

      setError(message || SEARCH_ERROR_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setError(null);
  };

  return (
    <SafeAreaProvider>
      {screen === "swap" ? (
        <Swap onBack={() => setScreen("home")} />
      ) : (
        <View style={styles.container}>
          <StatusBar style="dark" />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            {/* Header */}
            <View style={styles.headerRow}>
              <Text style={styles.heading}>SolScan</Text>
              <TouchableOpacity
                onPress={() => setScreen("swap")}
                style={styles.swapButton}
                activeOpacity={0.85}
              >
                <Text style={styles.swapButtonText}>Swap</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.subHeading}>
              Track wallet balance, tokens & recent activity
            </Text>

            {/* Search */}
            <TextInput
              style={styles.input}
              placeholder="Enter Solana wallet address"
              placeholderTextColor="#8a94a6"
              value={address}
              onChangeText={handleAddressChange}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Error banner */}
            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            {/* Fetch button */}
            <TouchableOpacity
              onPress={search}
              style={[styles.btn, loading && styles.btnDisabled]}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Fetch Data</Text>
              )}
            </TouchableOpacity>

            {/* Results — only after a successful search */}
            {searched && (
              <>
                {/* Balance card */}
                <View style={styles.card}>
                  <Text style={styles.cardLabel}>SOL Balance</Text>
                  <Text style={styles.balanceValue}>
                    {balance?.toFixed(6)} SOL
                  </Text>
                </View>

                {/* Token list */}
                <Text style={styles.sectionTitle}>Tokens</Text>
                {tokens.length === 0 ? (
                  <EmptyState
                    icon="🪙"
                    title="No tokens found"
                    description={EMPTY_TOKENS_DESCRIPTION}
                  />
                ) : (
                  <FlatList
                    data={tokens}
                    keyExtractor={(item) => item.mint}
                    scrollEnabled={false}
                    renderItem={({ item }) => <TokenRow token={item} />}
                  />
                )}

                {/* Transactions list */}
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                {txns.length === 0 ? (
                  <EmptyState
                    icon="📭"
                    title="No transactions found"
                    description={EMPTY_TRANSACTIONS_DESCRIPTION}
                  />
                ) : (
                  <FlatList
                    data={txns}
                    keyExtractor={(item) => item.sig}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TransactionRow transaction={item} />
                    )}
                  />
                )}
              </>
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fb",
  },
  scroll: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 48,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  heading: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: 0.3,
    flex: 1,
  },
  swapButton: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  swapButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  subHeading: {
    fontSize: 15,
    lineHeight: 22,
    color: "#475569",
    marginBottom: 4,
  },
  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0f172a",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  errorBanner: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "500",
  },
  btn: {
    backgroundColor: "#2563eb",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  btnDisabled: {
    backgroundColor: "#93c5fd",
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: "#1e40af",
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  cardLabel: {
    color: "#bfdbfe",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  balanceValue: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 8,
    marginBottom: 4,
  },
});
