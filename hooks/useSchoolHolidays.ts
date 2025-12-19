import { useEffect, useMemo, useState } from "react";
import { DataSource, Region, SchoolYear } from "../context/AppSettings";

export type HolidayType = "autumn" | "christmas" | "spring" | "may" | "summer" | "unknown";

export type Holiday = {
  type: HolidayType;
  label: string;
  region: Region | "All";
  startDate: Date;
  endDate: Date;
};

function normalizeRegion(raw: string): Region | "All" {
  const r = (raw || "").toLowerCase();
  if (r.includes("heel")) return "All";
  if (r.includes("noord")) return "North";
  if (r.includes("midden") || r.includes("centraal")) return "Middle";
  if (r.includes("zuid")) return "South";
  return "All";
}

function normalizeType(raw: string): HolidayType {
  const t = (raw || "").toLowerCase();
  if (t.includes("herfst")) return "autumn";
  if (t.includes("kerst")) return "christmas";
  if (t.includes("voorjaar")) return "spring";
  if (t.includes("mei")) return "may";
  if (t.includes("zomer")) return "summer";
  return "unknown";
}

function labelForType(t: HolidayType) {
  switch (t) {
    case "autumn":
      return "Autumn Holiday";
    case "christmas":
      return "Christmas Holiday";
    case "spring":
      return "Spring Holiday";
    case "may":
      return "May Holiday";
    case "summer":
      return "Summer Holiday";
    default:
      return "Holiday";
  }
}

function parseRijksoverheidJson(json: any): Holiday[] {
  // Volgens veldschema zit het vaak als: [ { content: [ { vacations: [ { type, regions: [ {region,startdate,enddate} ] } ] } ] } ]
  // :contentReference[oaicite:1]{index=1}
  const top = Array.isArray(json) ? json[0] : json;
  const contentArr = top?.content;
  const contentObj = Array.isArray(contentArr) ? contentArr[0] : contentArr;

  const vacations = contentObj?.vacations ?? top?.vacations ?? [];
  const out: Holiday[] = [];

  for (const v of vacations) {
    const vType = normalizeType(v?.type);
    const regions = v?.regions ?? [];
    for (const reg of regions) {
      const region = normalizeRegion(reg?.region);
      const start = new Date(reg?.startdate);
      const end = new Date(reg?.enddate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) continue;

      out.push({
        type: vType,
        label: labelForType(vType),
        region,
        startDate: start,
        endDate: end,
      });
    }
  }

  out.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  return out;
}

function mockData(schoolYear: SchoolYear): Holiday[] {
  // simpele fallback voor als je Mock Data kiest
  const base = schoolYear.startsWith("2025") ? "2025" : "2024";
  return [
    { type: "autumn", label: "Autumn Holiday", region: "North", startDate: new Date(`${base}-10-18`), endDate: new Date(`${base}-10-26`) },
    { type: "christmas", label: "Christmas Holiday", region: "All", startDate: new Date(`${base}-12-20`), endDate: new Date(`${Number(base) + 1}-01-04`) },
  ];
}

export function useSchoolHolidays(schoolYear: SchoolYear, dataSource: DataSource) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        if (dataSource === "Mock Data") {
          const data = mockData(schoolYear);
          if (!cancelled) setHolidays(data);
          return;
        }

        const url =
          `https://opendata.rijksoverheid.nl/v1/sources/rijksoverheid/infotypes/schoolholidays/schoolyear/` +
          `${schoolYear}?output=json`;

        const res = await fetch(url, { headers: { Accept: "application/json" } });
        const text = await res.text();

        // Soms komt XML terug als de output verkeerd is -> check
        if (text.trim().startsWith("<")) {
          throw new Error("API returned XML instead of JSON (check output=json).");
        }

        const json = JSON.parse(text);
        const parsed = parseRijksoverheidJson(json);

        if (!cancelled) setHolidays(parsed);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [schoolYear, dataSource]);

  return { loading, error, holidays };
}

export function filterByRegion(all: Holiday[], region: Region) {
  return all.filter((h) => h.region === "All" || h.region === region);
}

export function getNextHoliday(all: Holiday[], region: Region) {
  const list = filterByRegion(all, region);
  const now = new Date();

  // Als je NU in een vakantie zit: pak de volgende na deze
  const current = list.find((h) => now >= h.startDate && now <= h.endDate);
  if (current) {
    const after = list.find((h) => h.startDate.getTime() > current.endDate.getTime());
    return after ?? null;
  }

  // Anders: eerstvolgende startdate
  const next = list.find((h) => h.startDate.getTime() > now.getTime());
  return next ?? null;
}

export function daysUntil(date: Date) {
  const now = new Date();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const b = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diff = b - a;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
