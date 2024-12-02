import * as React from "react";
import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselDemo() {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const [tasks, setTasks] = useState([]);

  // Fetch tasks from the API
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`${baseURL}/api/tasks`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }

    fetchTasks();
  }, []);

  return (
    <Carousel className="w-small med-w-xs">
      <CarouselContent>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <CarouselItem key={task.id || index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square flex-col items-center justify-center p-6">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-500">{task.content}</p>
                    <p className="text-sm text-gray-700">Price: ${task.price}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No tasks available.
          </div>
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
