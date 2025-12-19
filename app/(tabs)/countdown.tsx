import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useAppSettings } from "../../context/AppSettings";
import { daysUntil, getNextHoliday, useSchoolHolidays } from "../../hooks/useSchoolHolidays";

// Zorg dat deze bestanden bestaan in /assets met exact dezelfde naam
const holidayImages = {
  autumn: require("../../assets/autumn.jpg"),
  christmas: require("../../assets/christmas.jpg"),
  spring: require("../../assets/spring.jpg"),
  summer: require("../../assets/summer.jpg"),
} as const;

export default function CountdownScreen() {
  const { region, schoolYear, dataSource } = useAppSettings();
  const { loading, error, holidays } = useSchoolHolidays(schoolYear, dataSource);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const next = useMemo(() => getNextHoliday(holidays, region), [holidays, region]);
  const d = next ? daysUntil(next.startDate) : null;

  // Kies passend plaatje op basis van het type (fallback = autumn)
  const imageSource =
    next?.type && next.type in holidayImages
      ? holidayImages[next.type as keyof typeof holidayImages]
      : holidayImages.autumn;

  return (
    <View style={styles.screen}>
      <Text style={styles.regionText}>📍 Region: {region}</Text>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={{ marginTop: 10 }}>Loading…</Text>
        </View>
      )}

      {!!error && <Text style={styles.error}>Error: {error}</Text>}

      {!loading && !error && (
        <View style={[styles.card, isLandscape && styles.cardLand]}>
          <Image
            source={imageSource}
            style={[styles.imageBig, isLandscape && styles.imageBigLand]}
            resizeMode="cover"
          />

          <View style={[styles.rightSide, isLandscape && styles.rightSideLand]}>
            <Text style={styles.title}>{next ? next.label : "No next holiday found"}</Text>

            {next && (
              <>
                <Text style={styles.sub}>
                  {next.startDate.toLocaleDateString()} - {next.endDate.toLocaleDateString()}
                </Text>

                <View style={styles.daysBox}>
                  <Text style={styles.days}>{d}</Text>
                  <Text style={styles.daysLabel}>DAYS TO GO</Text>
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", padding: 16 },
  regionText: { color: "#6b7280", fontSize: 14, marginBottom: 12 },

  center: { alignItems: "center", justifyContent: "center", marginTop: 30 },
  error: { color: "crimson" },

  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#fff",
  },
  cardLand: { flexDirection: "row", gap: 16 },

  imageBig: {
    width: "100%",
    height: 210,
    borderRadius: 18,
    backgroundColor: "#f9fafb",
  },
  imageBigLand: { width: 260, height: 260 },

  rightSide: { marginTop: 16 },
  rightSideLand: { marginTop: 0, flex: 1 },

  title: { fontSize: 28, fontWeight: "900", color: "#111827" },
  sub: { marginTop: 8, color: "#6b7280" },

  daysBox: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: "center",
  },
  days: { fontSize: 64, fontWeight: "900", color: "#111827", lineHeight: 70 },
  daysLabel: { marginTop: 8, color: "#6b7280", fontWeight: "800" },
});
