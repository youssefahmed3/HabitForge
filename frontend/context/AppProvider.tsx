"use client";

import { ReactNode } from "react";
import { CategoriesProvider } from "./CategoriesContext";
import { UncategorizedHabitsProvider } from "./UncategorizedHabitsContext";
import { HabitEntryProvider } from "./HabitEntryContext";
import { AnalyticsProvider } from "./AnalyticsContext";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CategoriesProvider>
      <AnalyticsProvider>
        <HabitEntryProvider>
          <UncategorizedHabitsProvider>{children}</UncategorizedHabitsProvider>
        </HabitEntryProvider>
      </AnalyticsProvider>
    </CategoriesProvider>
  );
}
