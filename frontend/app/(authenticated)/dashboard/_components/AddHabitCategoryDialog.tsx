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
  name: z.string().min(1, { message: "Category name is required" }),
  description: z.string().optional(),
});

function AddHabitCategoryDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // for the close of the dialog
  const { categories, reloadCategories } = useCategories();
  const { habits, reloadUncategorizedHabits } = useUncategorizedHabits();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {}, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      console.log(values);

      const res = await fetch("http://localhost:5000/habit-categories", {
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
          Add Habit Category
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Add a new category to organize your habits. Choose a name, color,
            and optional description.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="eg. Exercise, Work, Self-Care..."
                      type="text"
                      {...field}
                    />
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
                      placeholder="Describe what types of habits belong in this category..."
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
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
                    creating a new category
                  </>
                ) : (
                  "Create Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddHabitCategoryDialog;
