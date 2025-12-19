import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function RegionRow({ region }: { region: string }) {
  return (
    <View style={styles.regionRow}>
      <MaterialCommunityIcons name="map-marker-outline" size={18} color="#6b7280" />
      <Text style={styles.regionText}>Region: {region}</Text>
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.cardTitle}>{children}</Text>;
}

export function CardSub({ children }: { children: React.ReactNode }) {
  return <Text style={styles.cardSub}>{children}</Text>;
}

export function KeyValueRow({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.kvRow}>
      <Text style={styles.kvKey}>{k}</Text>
      <Text style={styles.kvVal}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  regionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  regionText: {
    color: "#6b7280",
    fontSize: 14,
  },

  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  cardSub: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
  },

  kvRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  kvKey: { color: "#6b7280", fontSize: 14 },
  kvVal: { color: "#111827", fontSize: 14, fontWeight: "700" },
});
