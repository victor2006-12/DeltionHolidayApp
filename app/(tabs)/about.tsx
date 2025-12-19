import React from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAppSettings } from "../../context/AppSettings";

export default function AboutScreen() {
  const { region, dataSource } = useAppSettings();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.regionText}>📍 Region: {region}</Text>

      <View style={styles.profile}>
        <Image
          source={require("../../assets/me.jpg")} // zorg dat dit bestand bestaat
          style={styles.avatar}
        />
        <Text style={styles.devName}>Victor de Jong</Text>
        <Text style={styles.devRole}>App Developer • 19 years</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>App Information</Text>
        <View style={{ marginTop: 10 }}>
          <Row k="Version" v="1.0.0" />
          <Row k="Platform" v={`React Native (${Platform.OS})`} />
          <Row k="Data Source" v={dataSource} />
          <Row k="School" v="Deltion College (Zwolle)" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>About This App</Text>
        <Text style={styles.p}>
          Deze app toont schoolvakanties per schooljaar en regio (Noord/Midden/Zuid). De vakantiedata
          wordt opgehaald via de Rijksoverheid Open Data API. Daarnaast laat de app een countdown zien
          naar de eerstvolgende vakantie en kun je instellingen zoals regio en schooljaar aanpassen.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact</Text>
        <Text style={styles.p}>Name: Victor de Jong</Text>
        <Text style={styles.p}>Email: victortim06@outlook.com</Text>
        <Text style={styles.p}>School: Deltion College, Zwolle</Text>
      </View>
    </ScrollView>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.k}>{k}</Text>
      <Text style={styles.v}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 28, backgroundColor: "#fff" },
  regionText: { color: "#6b7280", fontSize: 14, marginBottom: 12 },

  profile: { alignItems: "center", marginBottom: 14 },
  avatar: { width: 130, height: 130, borderRadius: 65, backgroundColor: "#f3f4f6" },
  devName: { marginTop: 16, fontSize: 26, fontWeight: "900", color: "#111827" },
  devRole: { marginTop: 6, fontSize: 14, color: "#6b7280", fontWeight: "700" },

  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: "900", color: "#111827" },

  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  k: { color: "#6b7280", fontSize: 14 },
  v: { color: "#111827", fontSize: 14, fontWeight: "800" },

  p: { marginTop: 10, color: "#374151", lineHeight: 20, fontSize: 14 },
});
