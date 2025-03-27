import { Suspense } from "react";
import CheckoutForm from "@/components/Checkout/CheckoutForm";

export default function Checkout() {
  return (
    <section id="checkout" className="overflow-hidden py-10 md:py-20 lg:py-28 bg-gradient-to-br from-dark-primary/10 to-transparent bg-gray-900">
      <main className="max-w-6xl mx-auto text-white m-10 rounded-md bg-clip-padding backdrop-filter">
        <Suspense fallback={<div className="text-white text-center">Loading checkout...</div>}>
          <CheckoutForm />
        </Suspense>
      </main>
    </section>
  );
}
