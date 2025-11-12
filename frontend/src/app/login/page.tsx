"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    // Assuming your backend uses email for login, adjust if using username
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use environment-backed backend base so Docker service names work
      const backendBase =
        (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(
          /\/$/,
          ""
        ) + "/api";
      const res = await fetch(`${backendBase}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Send email as 'username' if that's what your backend expects
          username: form.email,
          password: form.password,
        }),
      });

      const data = await res.json(); // Always try to parse JSON

      if (!res.ok) {
        // Use the message from the backend response if available
        throw new Error(
          data.message || `Login failed with status: ${res.status}`
        );
      }

      // --- IMPORTANT: Handle the JWT Token ---
      // Assuming your backend sends back a token like { token: "..." }
      if (data.token) {
        // Store the token securely (e.g., localStorage or secure cookie)
        localStorage.setItem("authToken", data.token);
        console.log("Login successful, token stored.");
        // Redirect to the dashboard or homepage after successful login
        router.push("/dashboard"); // Or "/"
      } else {
        throw new Error("Login response did not include a token.");
      }
    } catch (err: unknown) {
      // 1. Catch error as 'unknown'
      // 2. Perform type checking before accessing properties
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("Login error:", err); // Log the actual error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Welcome Back
        </h2>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
        {/* Optional: Add links for registration or password reset */}
        <div className="text-center mt-6">
          <a
            href="/register"
            className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800"
          >
            Don&apos;t have an account? Sign Up
          </a>
        </div>
      </form>
    </div>
  );
}
