import { Text, View } from "react-native";

type SwapCardProps = {
  symbol: string;
  amount: string;
  balanceText: string;
  usdText: string;
  iconBackground: string;
};

export function SwapCard({
  symbol,
  amount,
  balanceText,
  usdText,
  iconBackground,
}: SwapCardProps) {
  return (
    <View
      style={{
        backgroundColor: "#15171c",
        borderRadius: 28,
        paddingHorizontal: 22,
        paddingTop: 24,
        paddingBottom: 18,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            backgroundColor: "#000000",
            borderRadius: 999,
            paddingVertical: 12,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            minWidth: 170,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: iconBackground,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: 20, fontWeight: "700" }}>
              {symbol.slice(0, 1)}
            </Text>
          </View>

          <Text style={{ color: "#f8fafc", fontSize: 26, fontWeight: "600" }}>
            {symbol}
          </Text>
          <Text style={{ color: "#f8fafc", fontSize: 22, marginTop: -2 }}>
            v
          </Text>
        </View>

        <Text style={{ color: "#f8fafc", fontSize: 64, fontWeight: "500" }}>
          {amount}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 22,
        }}
      >
        <Text style={{ color: "#9ca3af", fontSize: 22, fontWeight: "500" }}>
          {balanceText}
        </Text>
        <Text style={{ color: "#9ca3af", fontSize: 22, fontWeight: "500" }}>
          {usdText}
        </Text>
      </View>
    </View>
  );
}
