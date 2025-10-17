"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "../components/AuthHeader";
import axios from "../../lib/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/auth/signin", {
        user_email: email,
        password: password,
      });
      login(data.access_token); 
    } catch (err) {
      const details = err.response?.data?.detail;
      const msg = Array.isArray(details)
        ? details[0].msg
        : details || "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthHeader />
      <main className="max-w-md mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-2 text-center">
          Writer Logger
        </h2>
        <p className="text-center text-gray-600 mb-6">KeepNotes</p>

        <div className="bg-white rounded shadow p-6">
          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              required
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded text-white ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-black">
            Don’t have an account?{" "}
            <a href="/register" className="text-indigo-600 hover:underline">
              Register
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
