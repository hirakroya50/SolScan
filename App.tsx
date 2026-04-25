import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
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

export default function App() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [txns, setTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const search = async () => {
    const addr = address.trim();
    setLoading(true);
    try {
      const [bal, tok, tx] = await Promise.all([
        getBalance(addr),
        getTokens(addr),
        getTxns(addr),
      ]);
      setBalance(bal);
      setTokens(tok);
      setTxns(tx);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView style={{}}>
        <StatusBar style="dark" />
        <Text style={styles.heading}>SolScan</Text>
        <Text style={styles.subHeading}>
          Track wallet balance, tokens and recent activityss
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Solana wallet address"
          placeholderTextColor="#8a94a6"
          value={address}
          onChangeText={setAddress}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {balance !== null && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#0f172a" }}>
              Balance: {balance.toFixed(4)} SOL
            </Text>
          </View>
        )}
        <TouchableOpacity
          onPress={search}
          style={{
            marginTop: 16,
            backgroundColor: "#2563eb",
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#ffffff", fontWeight: "600" }}>
            Fetch Data
          </Text>
        </TouchableOpacity>

        {tokens.length > 0 && (
          <>
            <Text>Tokens</Text>
            <FlatList
              data={tokens}
              keyExtractor={(item) => item.mint}
              scrollEnabled={false}
              renderItem={({ item }) => {
                return (
                  <View>
                    <Text>
                      {item.mint.slice(0, 6)}…{item.mint.slice(-4)}: {item.amount}
                    </Text>
                  </View>
                );
              }}
            />
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
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: "stretch",
    justifyContent: "flex-start",
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
    marginBottom: 8,
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
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
});
