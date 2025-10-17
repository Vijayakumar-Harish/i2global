"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import axios from "../lib/axios";
import { moveArrayItem } from "@/lib/drag";
import Protected from "./components/Protected";
import { useAuth } from "./context/AuthContext";
export default function Home() {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null); // full note object
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");


  const fetchNotes = async () => {
    try {
      const { data } = await axios.get("/notes");
      setNotes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async () => {
    if (!selected) return;
    await axios.delete(`/notes/${selected.note_id}`);
    setOpen(false);
    fetchNotes();
  };

  const saveChanges = async () => {
    if (!selected) return;
    await axios.put(`/notes/${selected.note_id}`, {
      note_title: editTitle,
      note_content: editContent,
    });
    setOpen(false);
    fetchNotes();
  };

 
  useEffect(() => {
    if (!token) return;
    fetchNotes();
  }, [token]);

 
  const showCard = (note) => {
    setSelected(note);
    setEditTitle(note.note_title);
    setEditContent(note.note_content);
    setOpen(true);
  };
const [dragIdx, setDragIdx] = useState(null);

const handleDragStart = (e, idx) => {
  setDragIdx(idx);
  e.dataTransfer.effectAllowed = "move";
};

const handleDragOver = (e) => {
  e.preventDefault(); // allow drop
};

const handleDrop = (e, dropIdx) => {
  e.preventDefault();
  if (dragIdx === null || dragIdx === dropIdx) return;
  const reordered = moveArrayItem(notes, dragIdx, dropIdx);
  setNotes(reordered);
  setDragIdx(null);
};
  return (
    <Protected>
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-semibold mb-2">Good Morning Deva!</h2>
        <p className="text-gray-600 mb-6">Keep Notes</p>
        <div className="mb-4 flex justify-between items-center">
          <span className="text-lg font-medium">Your Notes</span>
          <a
            href="/add"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Add Notes
          </a>
        </div>
        {loading && <p className="text-gray-500">Loading…</p>}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((n, idx) => (
            <div
              key={n.note_id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              onClick={() => showCard(n)}
              className="bg-white rounded shadow p-4 cursor-move hover:shadow-lg transition"
            >
              <h3 className="font-bold text-2xl text-black truncate">
                {n.note_title}
              </h3>
              <p
                className="text-gray-700 text-sm mt-1 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: n.note_content }}
              />
              <p className="text-xs text-gray-500 mt-3">
                Last Modified: {new Date(n.last_update).toDateString()}
              </p>
            </div>
          ))}
        </div>
        
        {open && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={6}
                className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={deleteNote}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={saveChanges}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Protected>
  );
}
