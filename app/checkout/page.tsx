"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
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
      <div className="text-center text-red-500 py-20">
        <h2 className="text-2xl font-bold">Invalid Checkout Details</h2>
        <p>Please ensure the price is valid.</p>
      </div>
    );
  }

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    if (paymentMethod === "card") {
      window.location.href = "https://www.paypal.com/your-paypal-link";
    } else {
      alert("Task assigned successfully! A TaskMate official will collect Payment at provided address.");
      router.push("/tasks"); // Redirect to tasks page
    }
  };

  return (
    <section id="checkout" className="overflow-hidden py-16 md:py-20 lg:py-28 bg-[url('/taskback.jpg')]">
      <main className="max-w-6xl mx-auto p-10 text-white text-center m-10 rounded-md bg-gradient-to-tr from-gray-700 to-purple-500">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Assign Task to {assignedUser}</h1>
          <h2 className="text-2xl">Price: <span className="font-bold">TL{amount}</span></h2>
        </div>

        <form onSubmit={handleSubmit} className="text-left max-w-2xl mx-auto">
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
              <input type="text" value={address} placeholder="eg:EMU main campus, Akdeniz yurdu room 221 boys side" onChange={(e) => setAddress(e.target.value)} className="w-full p-2 rounded text-black" required />
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
              <input type="text" value={location} placeholder="Please provide the address where the assigned user shall meet you for task" onChange={(e) => setLocation(e.target.value)} className="w-full p-2 rounded text-black" required />
            </label>
          )}

          <button type="submit" className="w-full p-3 bg-green-500 text-white rounded-md font-bold">Proceed</button>
        </form>
      </main>
    </section>
  );
}
