import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export default function PrimaryButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fd5650",

    height: 58,

    borderRadius: 30,

    justifyContent: "center",

    alignItems: "center",

    marginHorizontal: 30,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.15,

    shadowRadius: 12,

    elevation: 8,
  },

  text: {
    color: "#ffffff",

    fontSize: 18,

    fontWeight: "700",

    letterSpacing: 1,
  },
});
