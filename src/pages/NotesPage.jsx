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
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    localStorage.setItem("notesData", JSON.stringify(notes));
  }, [notes]);

const addNote = (title, content) => {
  const isConfirmed = window.confirm("Are you sure you want to create this note?");
  if (isConfirmed) {
    const newNote = { id: Date.now(), title, content };
    setNotes([...notes, newNote]);
  }
};

const editNote = (id, newTitle, newContent) => {
  const isConfirmed = window.confirm("Are you sure you want to save these changes?");
  if (isConfirmed) {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, title: newTitle, content: newContent } : note
    ));
    setEditingNote(null);
  }
};

  const handleEditClick = (note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingNote(null);
  };

const deleteNote = (id) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this note?");
    if (isConfirmed) {
      setNotes(notes.filter((note) => note.id !== id));
    }
};

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
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
        
        <select 
          className="view-toggle"
          value={viewMode} 
          onChange={(e) => setViewMode(e.target.value)}
        >
          <option value="grid">Grid View</option>
          <option value="table">Table View</option>
        </select>
      </div>

      {viewMode === "grid" ? (
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
      ) : (
        <>
          {filteredNotes.length > 0 ? (
            <table className="notes-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Title</th>
                  <th style={{ width: '45%' }}>Content</th>
                  <th style={{ width: '20%' }}>Date Created</th>
                  <th style={{ width: '15%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotes.map((note) => (
                  <tr key={note.id}>
                    <td>
                      <div className="table-title">{note.title}</div>
                    </td>
                    <td>
                      <div className="table-content">{note.content}</div>
                    </td>
                    <td>
                      <div className="table-date">{formatDate(note.id)}</div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button onClick={() => handleEditClick(note)}> ✏️ Edit</button>
                       <button onClick={() => deleteNote(note.id)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-text">No notes found.</p>
          )}
        </>
      )}

      <NoteForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onAddNote={addNote}
        editingNote={editingNote}
        onEditNote={editNote}
      />
    </div>
    </>
  );
};

export default NotesPage;