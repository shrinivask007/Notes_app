import React from "react";
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About NotesApp</h1>
        
        <div className="about-content">
          <section className="about-section">
            <h2>What is NotesApp?</h2>
            <p>
              NotesApp is a simple, note-taking application designed to help you 
              organize your thoughts, tasks, and ideas in one place.
            </p>
          </section>

          <section className="about-section">
            <h2>Features</h2>
            <ol className="features-list">
              <li>Add New notes easily</li>
              <li>Edit notes easily</li>
              <li>Search notes by title/content</li>
              <li>Delete the notes easily</li>
              <li>Show all notes in grid view (like sticky notes).</li>
              <li>Automatic save to local storage</li>
              <li>Clean and user-friendly interface</li>

            </ol>
          </section>

          <section className="about-section">
            <h2>Development</h2>
            <p>
              NotesApp is built with modern web technologies including React.js, 
              which is designed to be fast and responsive.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;