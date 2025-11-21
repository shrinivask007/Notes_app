import React, { useState, useEffect } from "react";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";
import "./NotesPage.css";
import { insertNote, fetchNotes, updateNote, deleteNote as deleteNoteAPI } from "../api/cloudioService";
import { useUser } from "../context/UserContext";


const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

    const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Load notes from API when component mounts or user changes
  useEffect(() => {
    if (user && user.id) {
      loadNotesFromAPI();
    }
  }, [user]); 

  // Function to load notes from API
  const loadNotesFromAPI = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const notesData = await fetchNotes(user.id, user); 
      setNotes(notesData);
    } catch (error) {
      console.error("Failed to load notes from API:", error);
      alert("Failed to load notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (title, content) => {
    const isConfirmed = window.confirm("Are you sure you want to create this note?");
    if (!isConfirmed || !user) return;

    try {
       const noteId = Date.now();
      
      await insertNote({
        userId: user.id,
        noteId: noteId,
        title: title,
        content: content
      }, user);

      // After successful insertion, reload notes from API
      await loadNotesFromAPI();
      
      alert("Note created successfully!");
      
    } catch (error) {
      console.error("Failed to create note:", error);
      alert("Failed to create note. Please try again.");
    }
  };

  const editNote = async (id, newTitle, newContent) => {
    const isConfirmed = window.confirm("Are you sure you want to save these changes?");
    if (!isConfirmed || !user) return;

    try {
      // Find the note to get all required fields
      const noteToUpdate = notes.find(note => note.id === id);
      if (!noteToUpdate) {
        throw new Error("Note not found");
      }

      // Prepare update data with all required fields
      const updateData = {
        id: noteToUpdate.id, // Table ID (mandatory)
        content: newContent,
        title: newTitle,
        creationDate: noteToUpdate.creationDate, 
        createdBy: noteToUpdate.createdBy, 
        lastUpdateDate: noteToUpdate.lastUpdateDate, 
        lastUpdatedBy: user.username 
      };

      await updateNote(updateData, user);
      
      // Refresh the notes list from API
      await loadNotesFromAPI();
      
      setEditingNote(null);
      alert("Note updated successfully!");
      
    } catch (error) {
      console.error("Failed to update note:", error);
      alert("Failed to update note. Please try again.");
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

const deleteNote = async (id) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this note?");
  if (!isConfirmed || !user) return;

  try {
    await deleteNoteAPI(id, user);
    
    setNotes(notes.filter((note) => note.id !== id));
    
    alert("Note deleted successfully!");
  } catch (error) {
    console.error("Failed to delete note:", error);
    alert("Failed to delete note. Please try again.");
  }
};

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );



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


      {loading && <p className="loading-text">Loading notes...</p>}

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
            <p className="empty-text">
              {loading ? "Loading..." : "No notes found."}
            </p>
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
            <p className="empty-text">
              {loading ? "Loading..." : "No notes found."}
            </p>
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