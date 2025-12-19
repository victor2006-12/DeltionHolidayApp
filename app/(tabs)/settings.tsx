import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import { DataSource, Region, SchoolYear, useAppSettings } from "../../context/AppSettings";
import { regionFromProvinceAndMunicipality } from "../../utils/regionFromGps";

function OptionRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.optionRow, selected && styles.optionRowSelected]}>
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
      <View style={[styles.radio, selected && styles.radioSelected]} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { region, setRegion, schoolYear, setSchoolYear, dataSource, setDataSource } = useAppSettings();

  const detectLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "GPS permission is required to detect your region.");
        return;
      }

      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });

      const geo = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });

      const first = geo?.[0];
      const province = (first?.region || first?.subregion || "") as string; // kan per device verschillen
      const municipality = (first?.city || first?.district || first?.subregion || "") as string;

      const detected = regionFromProvinceAndMunicipality(province, municipality);
      setRegion(detected);

      Alert.alert("Region detected", `Province: ${province}\nCity: ${municipality}\n=> ${detected}`);
    } catch (e: any) {
      Alert.alert("GPS error", e?.message ?? "Unknown error");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.regionText}>📍 Region: {region}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>GPS Location</Text>
        <Text style={styles.cardSub}>Detect region automatically</Text>

        <Pressable onPress={detectLocation} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Detect Location</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Manual Region</Text>
        <View style={{ marginTop: 12 }}>
          {(["North", "Middle", "South"] as Region[]).map((r) => (
            <OptionRow key={r} label={r} selected={region === r} onPress={() => setRegion(r)} />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>School Year</Text>
        <View style={{ marginTop: 12 }}>
          {(["2024-2025", "2025-2026"] as SchoolYear[]).map((y) => (
            <OptionRow key={y} label={y} selected={schoolYear === y} onPress={() => setSchoolYear(y)} />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Data Source</Text>
        <View style={{ marginTop: 12 }}>
          {(["Dutch Gov API", "Mock Data"] as DataSource[]).map((d) => (
            <OptionRow key={d} label={d} selected={dataSource === d} onPress={() => setDataSource(d)} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 28, backgroundColor: "#fff" },
  regionText: { color: "#6b7280", fontSize: 14, marginBottom: 12 },

  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: "900", color: "#111827" },
  cardSub: { marginTop: 6, fontSize: 13, color: "#6b7280" },

  primaryButton: {
    marginTop: 14,
    backgroundColor: "#111827",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "900" },

  optionRow: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionRowSelected: { backgroundColor: "#111827", borderColor: "#111827" },
  optionText: { fontSize: 14, fontWeight: "800", color: "#111827" },
  optionTextSelected: { color: "#fff" },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#d1d5db",
  },
  radioSelected: { backgroundColor: "#fff", borderColor: "#fff" },
});
