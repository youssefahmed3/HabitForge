"use client";
import { createContext, useContext, useEffect, useState } from "react";
import dayjs from "dayjs";

type HabitEntryMap = Record<string, boolean>;

interface HabitEntryContextType {
  habitEntries: HabitEntryMap;
  toggleHabitEntry: (habitId: string) => Promise<void>;
  reloadEntries: (habitIds: string[]) => Promise<void>;
}

const HabitEntryContext = createContext<HabitEntryContextType | undefined>(
  undefined
);

export const HabitEntryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [habitEntries, setHabitEntries] = useState<HabitEntryMap>({});

  const reloadEntries = async (habitIds: string[]) => {
    try {
      const query = habitIds.map((id) => `habitId=${id}`).join("&");
      const res = await fetch(
        `http://localhost:5000/habit-entries?${query}&range=week`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format from backend.");
      }

      const today = dayjs().format("YYYY-MM-DD");

      const entryMap: HabitEntryMap = {};
      for (const entry of data) {
        const habitId = entry.habitId;
        const date = dayjs(entry.date).format("YYYY-MM-DD");
        if (date === today) {
          entryMap[habitId] = entry.completed;
        }
      }

      setHabitEntries(entryMap);
    } catch (error) {
      console.error("Failed to load habit entries:", error);
    }
  };

  const toggleHabitEntry = async (habitId: string) => {
    try {
      const res = await fetch("http://localhost:5000/habit-entries/toggle", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ habitId }),
      });

      const data = await res.json();
      setHabitEntries((prev) => ({
        ...prev,
        [habitId]: data.completed,
      }));
    } catch (error) {
      console.error("Failed to toggle habit entry:", error);
    }
  };

  return (
    <HabitEntryContext.Provider
      value={{ habitEntries, toggleHabitEntry, reloadEntries }}
    >
      {children}
    </HabitEntryContext.Provider>
  );
};

export const useHabitEntry = () => {
  const context = useContext(HabitEntryContext);
  if (!context)
    throw new Error("useHabitEntry must be used within HabitEntryProvider");
  return context;
};
