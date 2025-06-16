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

const formSchema = z.object({
  name: z.string().min(1, { message: "You need to enter a habit name!" }),
  description: z.string().optional(),
});

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
}
function ViewDetailsHabit(props: EditHabitDialogProps) {
  const [stats, setStats] = useState();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  /* useEffect(() => {
    async function fetchStatsHabit() {
      try {
        const res = await fetch(
          `http://localhost:5000/habits/${props.habit.id}/stats`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          
          setStats(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchStatsHabit();
  }, []); */

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View Habit Data</DialogTitle>
          <DialogDescription>
            Create a new habit to track. Choose a clear, actionable goal.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <div>
            <span className="font-bold">Name:</span> {props.habit.name}
          </div>
          <div>
            <span className="font-bold">Description:</span>{" "}
            {props.habit.description}
          </div>
{/*           <div>
            <span>total Days Tracked:</span>
            {stats!.totalDaysTracked}
          </div>
          <div>
            <span>total Completed:</span>
            {stats!.totalCompleted}
          </div>
          <div>
            <span>completion Rate:</span>
            {stats!.currentStreak}
          </div>
          <div>
            <span>current Streak:</span>
            {stats!.completionRate}
          </div>
          <div>
            <span>longest Streak:</span>
            {stats!.longestStreak}
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewDetailsHabit;
