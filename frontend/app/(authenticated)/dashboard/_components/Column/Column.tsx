"use client";
console.log(
  "Column rendered on",
  typeof window !== "undefined" ? "client" : "server"
);

import React, { useEffect, useState } from "react";
import Row from "../Row/Row";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, EllipsisVertical } from "lucide-react";
import EditCategoryDialog from "./EditCategoryDialog";
import { useCategories } from "@/context/CategoriesContext";
import { useUncategorizedHabits } from "@/context/UncategorizedHabitsContext";

interface Habit {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ColumnProps {
  categoryTitle: string;
  habits: Habit[];
}

const Column = (props: ColumnProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [habits, setHabits] = useState(props.habits || []);
  const { reloadCategories, getCategoryByName } = useCategories();
  const { reloadUncategorizedHabits } = useUncategorizedHabits();

  const categoryData = getCategoryByName(props.categoryTitle);

  useEffect(() => {
    setHabits(props.habits || []);
  }, [props.habits]);

  /* Helper Function for getting task position */
  function getTaskPos(id: string) {
    return habits.findIndex((habit) => habit.id === id);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id === over.id) return;

    setHabits((habits) => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over.id);

      return arrayMove(habits, originalPos, newPos);
    });
  }

  async function handleCategoryDelete() {
    console.log(`Deleting category: ${props.categoryTitle}`);
    const res = await fetch(
      `http://localhost:5000/habit-categories/${categoryData?.id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    const data = await res.json();
    console.log(data);

    if (data.success === true) {
      await reloadCategories();
      await reloadUncategorizedHabits();
    }
  }

  /* This is the list of sensors for drag and drop to make sure it works on mobile and with keyboard */
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <div className="flex flex-col w-[400px] min-h-[300px] rounded-md">
        <div className="flex justify-between border-2 border-custom-primary p-2 rounded-t-md">
          <p>{props.categoryTitle}</p>
          {props.categoryTitle !== "Uncategorized" && (
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <span
                    onClick={() => setEditDialogOpen(true)}
                    className="cursor-pointer w-full"
                  >
                    Edit Category
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer bg-red-700 text-white"
                  onClick={handleCategoryDelete}
                >
                  Delete Category
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex flex-col">
          {habits.length === 0 && (
            <div className="flex flex-1 items-center justify-center text-muted-foreground italic h-full p-4">
              No habits in this category
            </div>
          )}
          <SortableContext
            items={habits}
            strategy={verticalListSortingStrategy}
          >
            {habits.map((habit) => (
              <Row
                key={habit.id}
                habit={habit}
                categoryTitle={props.categoryTitle}
              />
            ))}
          </SortableContext>
        </div>
      </div>
      <EditCategoryDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        category={categoryData!}
      />
    </DndContext>
  );
};

export default Column;
