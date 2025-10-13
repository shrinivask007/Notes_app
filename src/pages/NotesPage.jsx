import React, { useState, useEffect } from "react";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";
import "./NotesPage.css";

const NotesPage = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notesData");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    localStorage.setItem("notesData", JSON.stringify(notes));
  }, [notes]);

  const addNote = (title, content) => {
    const newNote = { id: Date.now(), title, content };
    setNotes([ ...notes,newNote]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const editNote = (id, newTitle, newContent) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, title: newTitle, content: newContent } : note
    ));
    setEditingNote(null);
  };

  const handleEditClick = (note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingNote(null);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="notes-page">
      <div className="search-add-container">
        <input
          className="search-bar"
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button 
          className="add-note-btn"
          onClick={() => setIsFormOpen(true)}
        >
          + Add Note
        </button>
      </div>

      <div className="notes-grid">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onDelete={deleteNote}
              onEdit={handleEditClick}
            />
          ))
        ) : (
          <p className="empty-text">No notes found.</p>
        )}
      </div>

      <NoteForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onAddNote={addNote}
        editingNote={editingNote}
        onEditNote={editNote}
      />
    </div>
  );
};

export default NotesPage;