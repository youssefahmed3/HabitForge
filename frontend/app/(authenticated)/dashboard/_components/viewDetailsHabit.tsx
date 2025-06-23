"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Icons } from "@/components/icons";

import { useAnalytics, type HabitAnalytics } from "@/context/AnalyticsContext";
import { ExampleChart } from "@/components/testChart";
import { Monitor } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
    icon: Monitor,
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

interface Habit {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface EditHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit;
  habitAnalytics: HabitAnalytics | undefined;
}

function ViewDetailsHabit(props: EditHabitDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View Habit Data</DialogTitle>
          <DialogDescription>
            Here you can view the details of your habit. If you want to edit the
            habit, please use the edit button.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <div>
            <span className="font-bold">Name:</span> {props.habit.name}
          </div>
          <div>
            <span className="font-bold">Description:</span>{" "}
            {props.habit.description
              ? props.habit.description
              : "No description provided"}
          </div>

         {/*  <div className="">
            <ExampleChart
              chartConfig={chartConfig}
              chartData={[
                {
                  name: props.habit.name,
                  totalTracked: props.habitAnalytics?.totalDaysTracked,
                  completed: props.habitAnalytics?.totalCompleted,
                  rate: props.habitAnalytics?.completionRate,
                  streak: props.habitAnalytics?.longestStreak,
                },
              ]}
            />
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewDetailsHabit;
