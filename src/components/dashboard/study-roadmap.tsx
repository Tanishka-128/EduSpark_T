'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';

const initialTasks = [
  { id: 'task1', label: 'Chapter 1: Introduction to Quantum Physics', done: true },
  { id: 'task2', label: 'Chapter 2: Wave-Particle Duality', done: true },
  { id: 'task3', label: 'Practice Quiz for Chapters 1-2', done: false },
  { id: 'task4', label: "Watch video on Schrödinger's Cat", done: false },
];

export default function StudyRoadmap() {
  const [tasks, setTasks] = useState(initialTasks);

  const handleCheckedChange = (taskId: string, checked: boolean) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, done: checked } : task));
  };
  
  const completedTasks = tasks.filter((t) => t.done).length;
  const progress = (completedTasks / tasks.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Today's Study Roadmap</CardTitle>
        <CardDescription>Your personalized plan for today. Let's get it done!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium">Daily Progress</p>
            <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-3 rounded-md border p-3 transition-colors hover:bg-secondary/50">
              <Checkbox id={task.id} checked={task.done} onCheckedChange={(checked) => handleCheckedChange(task.id, !!checked)} />
              <label
                htmlFor={task.id}
                className={`flex-1 cursor-pointer text-sm ${
                  task.done ? 'text-muted-foreground line-through' : 'font-medium'
                }`}
              >
                {task.label}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
