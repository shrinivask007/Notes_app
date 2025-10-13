import React from "react";
import "./NoteCard.css";

const NoteCard = ({ note, onDelete, onEdit }) => {
  // Format the date to display in a readable format
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
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <div className="note-footer">
        <span className="note-date">{formatDate(note.id)}</span>
        <div className="note-actions">
          <button onClick={() => onEdit(note)}>✏️ Edit</button>
          <button onClick={() => onDelete(note.id)}>🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;