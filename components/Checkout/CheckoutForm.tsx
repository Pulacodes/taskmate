"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [address, setAddress] = useState("");
  const [requirements, setRequirements] = useState("");
  const [taskType, setTaskType] = useState("digital");
  const [location, setLocation] = useState("");

  const amount = parseFloat(searchParams.get("price") || "0");
  const assignedUser = searchParams.get("user") || "Someone";

  if (amount === 0) {
    return (
      <div className="text-center text-red-500 py-10">
        <h2 className="text-2xl font-bold">Invalid Checkout Details</h2>
        <p>Please ensure the price is valid.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === "card") {
      window.location.href = "https://www.paypal.com/ncp/payment/TSEUUACWVBFA4";
    } else {
      alert("Task assigned successfully! The assignee will collect cash at the provided address.");
      router.push("/tasks"); // Redirect to tasks page
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-left max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-2">Assign Task to {assignedUser}</h1>
      <h2 className="text-2xl">Price: <span className="font-bold">TL{amount.toFixed(2)}</span></h2>

      <label className="block mb-4">
        Payment Method:
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-2 rounded text-black">
          <option value="cash">Cash</option>
          <option value="card">Card</option>
        </select>
      </label>

      {paymentMethod === "cash" && (
        <label className="block mb-4">
          Address for Cash Collection:
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 rounded text-black" required />
        </label>
      )}

      <label className="block mb-4">
        Task Completion Requirements:
        <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} className="w-full p-2 rounded text-black" required></textarea>
      </label>

      <label className="block mb-4">
        Task Type:
        <select value={taskType} onChange={(e) => setTaskType(e.target.value)} className="w-full p-2 rounded text-black">
          <option value="remote">Remote</option>
          <option value="physical">Physical</option>
        </select>
      </label>

      {taskType === "physical" && (
        <label className="block mb-4">
          Location Details:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 rounded text-black" required />
        </label>
      )}

      <button type="submit" className="w-full p-3 bg-green-500 text-white rounded-md font-bold">Proceed</button>
    </form>
  );
}
