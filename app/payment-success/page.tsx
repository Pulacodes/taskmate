

export default function PaymentSuccess({
  searchParams,
}: {
  searchParams: { amount: string } | undefined;
}) {
  const amount = searchParams?.amount || "0"; // Fallback to "0" if undefined

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center m-10 rounded-md bg-gradient-to-tr from-gray-700 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>

        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          ${amount}
        </div>
      </div>
    </main>
  );
}
