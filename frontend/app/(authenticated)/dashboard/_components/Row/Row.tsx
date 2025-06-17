"use client";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Edit, Ellipsis, Flame, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MoveToCategoryDialog from "../MoveToCategoryDialog";
import { useCategories } from "@/context/CategoriesContext";
import EditHabitDialog from "../EditHabitData";
import ViewDetailsHabit from "../viewDetailsHabit";
import dayjs from "dayjs";
import { useUncategorizedHabits } from "@/context/UncategorizedHabitsContext";
import { useHabitEntry } from "@/context/HabitEntryContext";

interface RowProps {
  categoryTitle: string | null;
  habit: {
    id: string;
    name: string;
    description: string | null;
    categoryId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

const Row = (props: RowProps) => {
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.habit.id as string });

  const { categories, reloadCategories } = useCategories();
  const { habits, reloadUncategorizedHabits } = useUncategorizedHabits();
  const { habitEntries, toggleHabitEntry } = useHabitEntry();
  const isChecked = habitEntries[props.habit.id] ?? false;

  const style = {
    transition: transition,
    transform: CSS.Transform.toString(transform),
  };
  // console.log(props.habit);

  const handleCheckChange = async () => {
    await toggleHabitEntry(props.habit.id);
  };

  async function handleHabitDelete() {
    const res = await fetch(`http://localhost:5000/habits/${props.habit.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    console.log(data);

    if (data.success === true) {
      await reloadCategories();
      await reloadUncategorizedHabits();
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-2 p-2 py-4 w-[400px] m-2 bg-custom-secondary rounded-md text-white "
    >
      {/* card header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center ">
          <div
            suppressHydrationWarning={true}
            {...attributes}
            {...listeners}
            className=" cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="" />
          </div>
          <Checkbox
            // defaultChecked={}
            checked={isChecked}
            onCheckedChange={() => handleCheckChange()}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <DropdownMenuItem asChild>
                <span
                  onClick={() => setViewDialogOpen(true)}
                  className="cursor-pointer w-full"
                >
                  View Details
                </span>
              </DropdownMenuItem>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DropdownMenuItem asChild>
                <span
                  onClick={() => setEditDialogOpen(true)}
                  className="cursor-pointer w-full"
                >
                  Edit Habit
                </span>
              </DropdownMenuItem>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <DropdownMenuItem asChild>
                <span
                  onClick={() => setMoveDialogOpen(true)}
                  className="cursor-pointer w-full"
                >
                  Move To Category
                </span>
              </DropdownMenuItem>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer bg-red-700 text-white"
              onClick={() => handleHabitDelete()}
            >
              Delete Habit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col px-3 gap-4">
        <div className="flex gap-4 items-center">
          <div className="flex flex-col">
            <h3
              className={`text-lg ${
                isChecked ? "line-through text-gray-400" : ""
              }`}
            >
              {props.habit.name}
            </h3>
            <p
              className={`text-sm ${
                isChecked ? "line-through text-gray-400" : ""
              }`}
            >
              {props.habit.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between ">
          <div className="flex text-orange-400">
            <Flame className="" /> 12 Days Streak
          </div>
          <Badge variant="secondary">{props.categoryTitle}</Badge>
        </div>
      </div>
      <MoveToCategoryDialog
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        habitId={props.habit.id}
      />
      <EditHabitDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        habit={props.habit}
      />

      <ViewDetailsHabit
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        habit={props.habit}
      />
    </div>
  );
};

export default Row;
