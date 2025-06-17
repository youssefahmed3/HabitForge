"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Habit {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface UncategorizedContextType {
  habits: Habit[];
  reloadUncategorizedHabits: () => Promise<void>;
}

const UncategorizedHabitsContext = createContext<UncategorizedContextType | undefined>(undefined);

export const UncategorizedHabitsProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  const fetchUncategorizedHabits = async () => {
    try {
      const res = await fetch("http://localhost:5000/habits?categoryId=null", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setHabits(data);
    } catch (err) {
      console.error("Failed to fetch uncategorized habits:", err);
    }
  };

  useEffect(() => {
    fetchUncategorizedHabits();
  }, []);

  return (
    <UncategorizedHabitsContext.Provider
      value={{
        habits,
        reloadUncategorizedHabits: fetchUncategorizedHabits,
      }}
    >
      {children}
    </UncategorizedHabitsContext.Provider>
  );
};

export const useUncategorizedHabits = () => {
  const context = useContext(UncategorizedHabitsContext);
  if (!context) {
    throw new Error("useUncategorizedHabits must be used inside UncategorizedHabitsProvider");
  }
  return context;
};
