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
  Linking,
} from "react-native";
const RPC = "https://api.mainnet-beta.solana.com";

const rpc = async (method: string, params: any[]) => {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });

  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
};

const getBalance = async (addr: string) => {
  const result = await rpc("getBalance", [addr]);
  return result.value / 1_000_000_000;
};

const getTokens = async (addr: string) => {
  const result = await rpc("getTokenAccountsByOwner", [
    addr,
    { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
    { encoding: "jsonParsed" },
  ]);

  return (result.value || [])
    .map((a: any) => ({
      mint: a.account.data.parsed.info.mint,
      amount: a.account.data.parsed.info.tokenAmount.uiAmount,
    }))
    .filter((t: any) => t.amount > 0);
};

const getTxns = async (addr: string) => {
  const sigs = await rpc("getSignaturesForAddress", [addr, { limit: 10 }]);
  return sigs.map((s: any) => ({
    sig: s.signature,
    time: s.blockTime,
    ok: !s.err,
  }));
};

const fmt = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;
const fmtTime = (ts: number | null) =>
  ts ? new Date(ts * 1000).toLocaleDateString() : "—";

export default function App() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [txns, setTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    const addr = address.trim();
    if (!addr) {
      setError("Please enter a wallet address.");
      return;
    }
    setLoading(true);
    setError(null);
    setSearched(false);
    try {
      const [bal, tok, tx] = await Promise.all([
        getBalance(addr),
        getTokens(addr),
        getTxns(addr),
      ]);
      setBalance(bal);
      setTokens(tok);
      setTxns(tx);
      setSearched(true);
    } catch (e: any) {
      setError(
        e.message || "Something went wrong. Check the address and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <Text style={styles.heading}>SolScan</Text>
        <Text style={styles.subHeading}>
          Track wallet balance, tokens & recent activity
        </Text>

        {/* Search */}
        <TextInput
          style={styles.input}
          placeholder="Enter Solana wallet address"
          placeholderTextColor="#8a94a6"
          value={address}
          onChangeText={(t) => {
            setAddress(t);
            setError(null);
          }}
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
              <Text style={styles.balanceValue}>{balance?.toFixed(6)} SOL</Text>
            </View>

            {/* Token list */}
            <Text style={styles.sectionTitle}>Tokens</Text>
            {tokens.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyIcon}>🪙</Text>
                <Text style={styles.emptyTitle}>No tokens found</Text>
                <Text style={styles.emptyDesc}>
                  This wallet holds no SPL tokens with a balance.
                </Text>
              </View>
            ) : (
              tokens.map((item) => (
                <View key={item.mint} style={styles.rowCard}>
                  <View style={styles.rowLeft}>
                    <Text style={styles.mintLabel}>{fmt(item.mint)}</Text>
                    <Text style={styles.mintFull}>{item.mint}</Text>
                  </View>
                  <Text style={styles.tokenAmount}>{item.amount}</Text>
                </View>
              ))
            )}

            {/* Transactions list */}
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {txns.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyTitle}>No transactions found</Text>
                <Text style={styles.emptyDesc}>
                  This wallet has no recent transaction history.
                </Text>
              </View>
            ) : (
              txns.map((item) => (
                <TouchableOpacity
                  key={item.sig}
                  style={styles.rowCard}
                  activeOpacity={0.7}
                  onPress={() =>
                    Linking.openURL(`https://solscan.io/tx/${item.sig}`)
                  }
                >
                  <View style={styles.rowLeft}>
                    <Text style={styles.mintLabel}>{fmt(item.sig)}</Text>
                    <Text style={styles.mintFull}>{fmtTime(item.time)}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      item.ok ? styles.statusOk : styles.statusFail,
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {item.ok ? "Success" : "Failed"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
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
  heading: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: 0.3,
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
  rowCard: {
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
  rowLeft: {
    flex: 1,
    marginRight: 10,
  },
  mintLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
  mintFull: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  tokenAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e40af",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusOk: {
    backgroundColor: "#dcfce7",
  },
  statusFail: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0f172a",
  },
  emptyBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 8,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 18,
  },
});
