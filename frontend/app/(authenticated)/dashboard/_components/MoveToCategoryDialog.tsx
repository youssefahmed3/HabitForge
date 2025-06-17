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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/context/CategoriesContext";
import { useUncategorizedHabits } from "@/context/UncategorizedHabitsContext";

const formSchema = z.object({
  categoryName: z
    .string()
    .min(1, { message: "You need to select a category!" }),
});

interface MoveToCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habitId: string;
}
function MoveToCategoryDialog(props: MoveToCategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { categories, reloadCategories } = useCategories();
  const { habits, reloadUncategorizedHabits } = useUncategorizedHabits();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      console.log(values);

      const res = await fetch(`http://localhost:5000/habits/${props.habitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setIsLoading(false);
        form.reset();
        await reloadCategories();
        await reloadUncategorizedHabits();
        props.onOpenChange(false); // CLOSE the dialog
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Move Habit to Category</DialogTitle>
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
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="">
                        {categories.map((category: any) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    Moving To Category
                  </>
                ) : (
                  "Move To Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default MoveToCategoryDialog;
