// app/viewtask/[taskid]/TaskDetailsClient.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Task {
  _id: string;
  title: string;
  description: string;
  price: number;
  createdBy: string;
  acceptedBy: string | null;
}

function TaskDetailsClient({ task }: { task: Task }) {
  const router = useRouter();
  const [accepted, setAccepted] = useState(task.acceptedBy !== null);

  async function handleAcceptTask() {
    try {
      const response = await fetch('/api/tasks/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: task._id }),
      });

      const data = await response.json();

      if (response.ok) {
        setAccepted(true);
        alert('Task accepted successfully!');
        router.refresh();
      } else {
        alert(data.error || 'Failed to accept task');
      }
    } catch (error) {
      console.error('Error accepting task:', error);
      alert('An error occurred. Please try again later.');
    }
  }

  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Price: ${task.price}</p>
      <p>Created by: {task.createdBy}</p>
      <p>Status: {accepted ? 'Accepted' : 'Available'}</p>

      {!accepted && (
        <button onClick={handleAcceptTask}>Accept Task</button>
      )}
    </div>
  );
}

export default TaskDetailsClient;
