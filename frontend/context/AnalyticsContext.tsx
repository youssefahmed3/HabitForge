"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

// TypeScript interface for a single habit's analytics
export interface HabitAnalytics {
  habitId: string;
  totalDaysTracked: number;
  totalCompleted: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
}

// Context shape
interface AnalyticsContextType {
  habitAnalytics: HabitAnalytics[];
  getHabitAnalyticsById: (habitId: string) => HabitAnalytics | undefined;
  longestStreak: number;
  reloadAnalytics: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

// Create the context
const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

// Provider component
export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const [habitAnalytics, setHabitAnalytics] = useState<HabitAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [longestStreak, setLongestStreak] = useState<number>(0);

  const fetchHabitAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/habits/stats", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch habit analytics");
      }

      const data: HabitAnalytics[] = await res.json();
      setHabitAnalytics(data);

      const maxStreak = data.reduce((max, habit) => {
        return habit.longestStreak > max ? habit.longestStreak : max;
      }, 0);
      setLongestStreak(maxStreak);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabitAnalytics();
  }, [fetchHabitAnalytics]);

  const getHabitAnalyticsById = useCallback(
    (habitId: string) => habitAnalytics.find((a) => a.habitId === habitId),
    [habitAnalytics]
  );

  return (
    <AnalyticsContext.Provider
      value={{
        longestStreak,
        habitAnalytics,
        getHabitAnalyticsById,
        reloadAnalytics: fetchHabitAnalytics,
        loading,
        error,
      }}
    >
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
