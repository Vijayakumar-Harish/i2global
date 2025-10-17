"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import RichEditor from "../components/RichEditor";
import axios from "../../lib/axios";
import Link from "next/link";

export default function Add() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !html.trim()) {
      setError("Title and content are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post("/notes", {
        note_title: title.trim(),
        note_content: html.trim(),
      });
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not create note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-8">
        
        <h2 className="text-3xl font-semibold mb-2">Good Morning Deva!</h2>
        <p className="text-gray-600 mb-6">Add Notes</p>

        
        <div className="bg-white rounded shadow p-6">
          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Title"
              required
                          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                          
            />

            
            <RichEditor value={html} onChange={setHtml} />

            
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${
                  loading
                    ? "bg-indigo-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Adding…" : "Add"}
              </button>
              <Link
                href="/"
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
