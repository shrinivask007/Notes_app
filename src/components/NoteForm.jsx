import React, { useState, useEffect } from "react";
import "./NoteForm.css";

const NoteForm = ({ isOpen, onClose, onAddNote, editingNote, onEditNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingNote, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "" || content.trim() === "") return;

    if (editingNote) {
      onEditNote(editingNote.id, title, content);
    } else {
      onAddNote(title, content);
    }
    
    setTitle("");
    setContent("");
    onClose();
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="note-form-modal">
        <h2>{editingNote ? "Edit Note" : "Create a New Note"}</h2>
        <form className="note-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
          <div className="form-actions">
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit">
              {editingNote ? "Save Changes" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;