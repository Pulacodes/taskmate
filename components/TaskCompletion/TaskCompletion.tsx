"use client";

import { useState, useEffect } from "react";

interface TaskCompletionProps {
  taskId: string;
  initialRequirements: string[];
  initialStatus: string;
  price: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TaskCompletion: React.FC<TaskCompletionProps> = ({ taskId, initialRequirements, initialStatus, price }) => {
  const [requirements, setRequirements] = useState<{ text: string; checked: boolean }[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [files, setFiles] = useState<File[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setRequirements(initialRequirements.map((req) => ({ text: req, checked: false })));
  }, [initialRequirements]);

  // Handle checkbox toggle
  const handleCheck = (index: number) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index].checked = !updatedRequirements[index].checked;
    setRequirements(updatedRequirements);

    // Enable "Mark Complete" only when all are checked
    const allChecked = updatedRequirements.every((req) => req.checked);
    setIsComplete(allChecked);
  };

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Handle Mark Complete
  const markTaskAsComplete = async () => {
    if (!isComplete) return;

    try {
      const response = await fetch(`/api/tasks/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Task marked as complete!");
        setIsComplete(false);
      } else {
        alert("Failed to mark task as complete: " + data.error);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Calculate amount after deduction
  const amountToReceive = (price * 0.9).toFixed(2); // 90% of price

  return (
    <div className="bg-gray-900 p-6 rounded-md shadow-md text-white max-w-full mx-auto">
      <h2 className="text-2xl font-bold mb-4">Task Requirements</h2>

      <ul className="mb-4">
        {requirements.map((req, index) => (
          <li
            key={index}
            className={`flex items-center space-x-3 cursor-pointer p-2 rounded ${req.checked ? "line-through text-gray-500" : ""}`}
            onClick={() => handleCheck(index)}
          >
            <input type="checkbox" checked={req.checked} onChange={() => handleCheck(index)} className="cursor-pointer" />
            <span>{req.text}</span>
          </li>
        ))}
      </ul>

      <p className="text-lg font-bold mb-4">
        Amount to Receive: <span className="text-green-400">TL {amountToReceive}</span>
      </p>

      <div className="mb-4">
        <label className="block mb-2">Upload Proof of Completion:</label>
        <input type="file" multiple onChange={handleFileChange} className="bg-gray-800 text-white p-2 rounded w-full" />
      </div>

      <button
        className={`w-full p-3 rounded font-bold ${isComplete ? "bg-green-500 hover:bg-green-600" : "bg-gray-700 cursor-not-allowed"}`}
        onClick={markTaskAsComplete}
        disabled={!isComplete}
      >
        Mark Task as Complete
      </button>
    </div>
  );
};

export default TaskCompletion;
