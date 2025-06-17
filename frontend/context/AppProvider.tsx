"use client";

import { ReactNode } from "react";
import { CategoriesProvider } from "./CategoriesContext";
import { UncategorizedHabitsProvider } from "./UncategorizedHabitsContext";
import { HabitEntryProvider } from "./HabitEntryContext";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CategoriesProvider>
      <HabitEntryProvider>
        <UncategorizedHabitsProvider>{children}</UncategorizedHabitsProvider>
      </HabitEntryProvider>
    </CategoriesProvider>
  );
}
