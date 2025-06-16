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
  const [habits, setHabits] = useState(props.habits || []);
  console.log(props.habits);

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
      <div className="flex flex-col">
        <div className="flex justify-between border-2 border-custom-primary p-2 rounded-t-md">
          <p>{props.categoryTitle}</p>
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="cursor-pointer">
                Add Habit
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Edit Category
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Clear Completed
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer bg-red-700 text-white">
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col">
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
    </DndContext>
  );
};

export default Column;
