"use client";
import React, { createContext, useContext, ReactNode } from "react";

// Define the analytics data structure (adjust fields as needed)
export interface HabitAnalytics {
  habitId: string;
  totalDaysTracked: number;
  totalCompleted: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  // Add any more fields returned by your backend
}

// Context shape
interface AnalyticsContextType {
  fetchHabitAnalytics: (habitId: string) => Promise<HabitAnalytics | null>;
}

// Create the context
const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

// Provider component
export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const fetchHabitAnalytics = async (
    habitId: string
  ): Promise<HabitAnalytics | null> => {
    try {
      const res = await fetch(`http://localhost:5000/habits/${habitId}/stats`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to fetch habit analytics", data);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error fetching habit analytics:", error);
      return null;
    }
  };

  return (
    <AnalyticsContext.Provider value={{ fetchHabitAnalytics }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Custom hook
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return context;
};
