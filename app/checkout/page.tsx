"use client";

import CheckoutPage from "@/components/Checkout/checkoutpage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const searchParams = useSearchParams();

  // Extract data from query params
  const amount = parseFloat(searchParams.get("price") || "0");
  const assignedUser = searchParams.get("user") || "Someone";

  if (amount <= 0) {
    return (
      <div className="text-center text-red-500 py-10">
        <h2 className="text-2xl font-bold">Invalid Checkout Details</h2>
        <p>Please ensure the price is valid.</p>
      </div>
    );
  }

  return (
    <section id="checkout" className="overflow-hidden py-16 md:py-20 lg:py-28 bg-[url('/taskback.jpg')]">
      <main className="max-w-6xl mx-auto p-10 text-white text-center  m-10 rounded-md bg-gradient-to-tr from-gray-700 to-purple-500">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">{assignedUser}</h1>
          <h2 className="text-2xl">
            has requested
            <span className="font-bold"> TL{amount.toFixed(2)}</span>
          </h2>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),
            currency: "try", // Turkish Lira
          }}
        >
          <CheckoutPage amount={amount} />
        </Elements>
      </main>
    </section>
  );
}
