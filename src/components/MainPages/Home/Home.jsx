import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";


export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  // 📌 API Functions
  const addNote = async (noteData) => {
    const response = await axios.post(
      "https://note-sigma-black.vercel.app/api/v1/notes",
      noteData,
      {
        headers: {
          "Content-Type": "application/json",
          token: `3b8ny__${token}`,
        },
      }
    );
    return response.data;
  };

  const updateNote = async (noteData) => {
    const response = await axios.put(
      `https://note-sigma-black.vercel.app/api/v1/notes/${noteData._id}`,
      noteData,
      {
        headers: {
          "Content-Type": "application/json",
          token: `3b8ny__${token}`,
        },
      }
    );
    return response.data;
  };

  const deleteNote = async (noteId) => {
    await axios.delete(
      `https://note-sigma-black.vercel.app/api/v1/notes/${noteId}`,
      { headers: { token: `3b8ny__${token}` } }
    );
    return noteId;
  };

  const fetchNotes = async () => {
    const response = await axios.get(
      "https://note-sigma-black.vercel.app/api/v1/notes",
      { headers: { token: `3b8ny__${token}` } }
    );
    setNotes(response.data.notes || []);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // 📌 Mutations
  const addMutation = useMutation({
    mutationFn: addNote,
    onSuccess: fetchNotes,
  });

  const updateMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: fetchNotes,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (deletedId) =>
      setNotes((prev) => prev.filter((n) => n._id !== deletedId)),
  });

  // 📌 Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && selectedNote) {
      updateMutation.mutate({ _id: selectedNote._id, title, content });
    } else {
      addMutation.mutate({ title, content });
    }
    setIsOpen(false);
    setSelectedNote(null);
    setTitle("");
    setContent("");
    setIsEditing(false);
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(true);
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-gray-900 via-gray-800 to-black p-6">
      {/* Add Note */}

      {/* 🧢 Helmet for SEO */}
    <Helmet>
      <title>Home</title>
      <meta name="description" content="Organize your daily notes easily" />
    </Helmet>

      <button
        onClick={() => {
          setIsOpen(true);
          setIsEditing(false);
          setTitle("");
          setContent("");
        }}
        className="relative text-white font-semibold px-6 py-3 rounded-full shadow-lg 
  bg-gradient-to-r from-purple-600 to-indigo-600 
  transition-all duration-500 ease-in-out transform 
  hover:scale-110 hover:shadow-purple-500/60 overflow-hidden group mt-10"
      >
        <span className="relative z-10">Add Note</span>
        {/* Hover shine effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
      </button>

      {/* Grid Card*/}
      <div className="mt-10 w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-gradient-to-br from-indigo-50 via-white to-indigo-50 rounded-3xl shadow-xl p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-1 hover:scale-105 hover:shadow-2xl cursor-pointer"
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-950">Title :</h3>
              <p className="text-gray-700 font-medium">{note.title}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-950">Content :</h3>
              <p className="text-gray-700 text-sm whitespace-pre-line line-clamp-4">
                {note.content}
              </p>
            </div>

            <div className="flex justify-between">
              <button
                className="bg-gradient-to-r from-green-400 to-teal-500 text-white px-4 py-2 rounded-full shadow-md hover:from-teal-500 hover:to-green-400 transition-all duration-300 font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(note);
                }}
              >
                Update
              </button>
              <button
                className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-full shadow-md hover:from-pink-500 hover:to-red-400 transition-all duration-300 font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate(note._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-11/12 max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl"
              onClick={() => {
                setIsOpen(false);
                setSelectedNote(null);
              }}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              {isEditing ? "Edit Note" : "Add a New Note"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Enter note title"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Enter note content"
                  required
                />
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedNote(null);
                    setIsEditing(false);
                  }}
                  className="px-5 py-2 text-gray-700 font-semibold rounded-full border border-gray-400 hover:bg-gray-100 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMutation.isLoading || updateMutation.isLoading}
                  className="px-5 py-2 text-white font-semibold rounded-full shadow-md
                  bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500
                  transition-all duration-500 transform hover:scale-105 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
