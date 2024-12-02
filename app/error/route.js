export default function AuthError() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-semibold text-red-500">
          Authentication Error
        </h1>
        <p className="mt-2 text-center">
          An error occurred during authentication. Please try again.
        </p>
      </div>
    );
  }
  