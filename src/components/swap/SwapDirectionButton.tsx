import { Text, TouchableOpacity } from "react-native";

type SwapDirectionButtonProps = {
  onPress?: () => void;
};

export function SwapDirectionButton({ onPress }: SwapDirectionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#1f2937",
      }}
    >
      <Text style={{ color: "#f8fafc", fontSize: 34, lineHeight: 38 }}>
        swap
      </Text>
    </TouchableOpacity>
  );
}
