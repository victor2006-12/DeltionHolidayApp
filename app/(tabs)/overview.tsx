import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useAppSettings } from "../../context/AppSettings";
import { filterByRegion, useSchoolHolidays } from "../../hooks/useSchoolHolidays";

function formatRange(start: Date, end: Date) {
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
}

// Zelfde mapping als in countdown
const holidayImages = {
  autumn: require("../../assets/autumn.jpg"),
  christmas: require("../../assets/christmas.jpg"),
  spring: require("../../assets/spring.jpg"),
  summer: require("../../assets/summer.jpg"),
} as const;

export default function OverviewScreen() {
  const { region, schoolYear, dataSource, hydrated } = useAppSettings();
  const { loading, error, holidays } = useSchoolHolidays(schoolYear, dataSource);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const list = useMemo(() => filterByRegion(holidays, region), [holidays, region]);

  if (!hydrated) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 10 }}>Loading settings…</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topRow}>
        <Text style={styles.regionText}>📍 Region: {region}</Text>
        <Text style={styles.regionText}>School Year: {schoolYear}</Text>
      </View>

      {loading && (
        <View style={styles.centerRow}>
          <ActivityIndicator />
          <Text style={{ marginLeft: 10 }}>Loading holidays…</Text>
        </View>
      )}

      {!!error && <Text style={styles.error}>Error: {error}</Text>}

      {!loading && !error && list.length === 0 && (
        <Text style={styles.emptyText}>
          No holidays found for this region/year. Try another region or school year.
        </Text>
      )}

      <FlatList
        data={list}
        key={isLandscape ? "land" : "port"}
        numColumns={isLandscape ? 2 : 1}
        columnWrapperStyle={isLandscape ? { justifyContent: "space-between" } : undefined}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyExtractor={(item, idx) => `${item.type}-${item.region}-${idx}`}
        renderItem={({ item }) => {
          const imageSource =
            item.type && item.type in holidayImages
              ? holidayImages[item.type as keyof typeof holidayImages]
              : holidayImages.autumn;

          return (
            <View style={[styles.card, isLandscape && styles.cardLand]}>
              <Text style={styles.cardTitle}>{item.label}</Text>
              <Text style={styles.cardSub}>{formatRange(item.startDate, item.endDate)}</Text>

              <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", padding: 16 },
  topRow: { marginBottom: 12 },
  regionText: { color: "#6b7280", fontSize: 14, marginTop: 4 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  centerRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  error: { color: "crimson", marginBottom: 10 },
  emptyText: { color: "#6b7280", marginTop: 10 },

  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    backgroundColor: "#fff",
  },
  cardLand: { width: "48%" },

  cardTitle: { fontSize: 16, fontWeight: "900", color: "#111827" },
  cardSub: { marginTop: 6, color: "#6b7280" },

  cardImage: {
    marginTop: 14,
    width: "100%",
    height: 90,
    borderRadius: 14,
    backgroundColor: "#f9fafb",
  },
});
