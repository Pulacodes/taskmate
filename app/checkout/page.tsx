import { Suspense } from "react";
import CheckoutForm from "@/components/Checkout/CheckoutForm";

export default function Checkout() {
  return (
    <section id="checkout" className="overflow-hidden py-16 md:py-20 lg:py-28 bg-[url('/taskback.jpg')]">
      <main className="max-w-6xl mx-auto p-10 text-white text-center m-10 rounded-md bg-clip-padding backdrop-filter  backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100">
        <Suspense fallback={<div className="text-white text-center">Loading checkout...</div>}>
          <CheckoutForm />
        </Suspense>
      </main>
    </section>
  );
}
