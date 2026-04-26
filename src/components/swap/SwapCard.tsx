import { Text, TextInput, View } from "react-native";

type SwapCardProps = {
  symbol: string;
  amount: string;
  onChangeAmount?: (value: string) => void;
  balanceText: string;
  usdText: string;
  iconBackground: string;
};

export function SwapCard({
  symbol,
  amount,
  onChangeAmount,
  balanceText,
  usdText,
  iconBackground,
}: SwapCardProps) {
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "#15171c",
        borderRadius: 28,
        paddingHorizontal: 22,
        paddingTop: 24,
        paddingBottom: 18,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
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
            flexShrink: 1,
            maxWidth: "58%",
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

          <Text
            numberOfLines={1}
            style={{ color: "#f8fafc", fontSize: 26, fontWeight: "600" }}
          >
            {symbol}
          </Text>
          <Text style={{ color: "#f8fafc", fontSize: 22, marginTop: -2 }}>
            v
          </Text>
        </View>
        <TextInput
          style={{
            backgroundColor: "#ffffff",
          }}
        />

        <TextInput
          value={amount}
          onChangeText={onChangeAmount}
          editable={Boolean(onChangeAmount)}
          keyboardType="phone-pad"
          selectionColor="#f8fafc"
          placeholder="0"
          placeholderTextColor="#64748b"
          style={{
            color: "#1b63ac",
            backgroundColor: "#ffffff",
            fontSize: 58,
            fontWeight: "500",
            flexShrink: 1,
            flexGrow: 1,
            textAlign: "right",
            paddingVertical: 0,
            paddingHorizontal: 0,
            minWidth: 0,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 22,
          gap: 10,
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            color: "#9ca3af",
            fontSize: 22,
            fontWeight: "500",
            flex: 1,
            marginRight: 6,
          }}
        >
          {balanceText}
        </Text>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          style={{
            color: "#9ca3af",
            fontSize: 22,
            fontWeight: "500",
            textAlign: "right",
            flexShrink: 1,
          }}
        >
          {usdText}
        </Text>
      </View>
    </View>
  );
}
