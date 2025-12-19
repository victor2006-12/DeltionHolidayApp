import type { Region } from "../context/AppSettings";

export function regionFromProvinceAndMunicipality(province?: string, municipality?: string): Region {
  const p = (province || "").toLowerCase();
  const m = (municipality || "").toLowerCase();

  // Noord (hele provincies)
  if (["groningen", "friesland", "drenthe", "overijssel", "noord-holland"].includes(p)) return "North";

  // Zuid (hele provincies)
  if (["limburg", "zeeland"].includes(p)) return "South";

  // Flevoland: Zeewolde is Midden, rest Noord
  if (p === "flevoland") return m.includes("zeewolde") ? "Middle" : "North";

  // Utrecht: Eemnes/Abcoude Noord, rest Midden
  if (p === "utrecht") {
    if (m.includes("eemnes") || m.includes("abcoude")) return "North";
    return "Middle";
  }

  // Zuid-Holland is Midden
  if (p === "zuid-holland") return "Middle";

  // Gelderland split (we doen ‘veilig’: Hattem Noord, Arnhem/Nijmegen e.o. vaak Zuid, rest Midden)
  if (p === "gelderland") {
    if (m.includes("hattem")) return "North";
    if (m.includes("arnhem") || m.includes("nijmegen")) return "South";
    return "Middle";
  }

  // Noord-Brabant split (meestal Zuid; Altena kan Midden)
  if (p === "noord-brabant") {
    if (m.includes("altena")) return "Middle";
    return "South";
  }

  // fallback (als geocode info ontbreekt)
  return "Middle";
}
