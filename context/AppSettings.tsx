import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Region = "North" | "Middle" | "South";
export type SchoolYear = "2024-2025" | "2025-2026";
export type DataSource = "Dutch Gov API" | "Mock Data";

type AppSettingsState = {
  hydrated: boolean;

  region: Region;
  setRegion: (r: Region) => void;

  schoolYear: SchoolYear;
  setSchoolYear: (y: SchoolYear) => void;

  dataSource: DataSource;
  setDataSource: (d: DataSource) => void;
};

const STORAGE_KEY = "@schoolholidays_settings_v1";

const AppSettingsContext = createContext<AppSettingsState | null>(null);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  const [region, setRegion] = useState<Region>("North");
  const [schoolYear, setSchoolYear] = useState<SchoolYear>("2025-2026");
  const [dataSource, setDataSource] = useState<DataSource>("Dutch Gov API");

  // Load from storage (once)
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.region) setRegion(parsed.region);
          if (parsed?.schoolYear) setSchoolYear(parsed.schoolYear);
          if (parsed?.dataSource) setDataSource(parsed.dataSource);
        }
      } catch (e) {
        // ignore, app still works with defaults
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Save whenever settings change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    (async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ region, schoolYear, dataSource })
        );
      } catch (e) {
        // ignore
      }
    })();
  }, [hydrated, region, schoolYear, dataSource]);

  const value = useMemo(
    () => ({
      hydrated,
      region,
      setRegion,
      schoolYear,
      setSchoolYear,
      dataSource,
      setDataSource,
    }),
    [hydrated, region, schoolYear, dataSource]
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error("useAppSettings must be used inside AppSettingsProvider");
  return ctx;
}
