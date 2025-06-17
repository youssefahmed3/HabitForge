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
import dayjs from "dayjs";
import Image from "next/image";
import { useCategories } from "@/context/CategoriesContext";
import { useUncategorizedHabits } from "@/context/UncategorizedHabitsContext";

const formSchema = z.object({
  name: z.string().min(1, { message: "Habit name is required" }),
  description: z.string().optional(),
  category: z.string().optional(),
});

function AddHabitDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // for the close of the dialog
  const { categories, reloadCategories } = useCategories();
  const { habits, reloadUncategorizedHabits } = useUncategorizedHabits();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
    },
  });

  useEffect(() => {}, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      console.log(values);

      const res = await fetch("http://localhost:5000/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setIsLoading(false);
        form.reset();
        await reloadCategories();
        await reloadUncategorizedHabits();
        setDialogOpen(false); // CLOSE the dialog
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-custom-primary text-custom-text hover:bg-custom-secondary hover:text-white">
          Add Habit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
          <DialogDescription>
            Create a new habit to track. Choose a clear, actionable goal.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 text-custom-text"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Exercise" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Add any notes or details about this habit..."
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="original_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="link..." type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <DialogFooter className="text-custom-text">
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="cursor-pointer bg-custom-primary text-custom-text hover:bg-custom-secondary hover:text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Adding A New Habit
                  </>
                ) : (
                  "Add Habit"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddHabitDialog;
