import React from "react";

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">        
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
            <h2>Changes Made / Features Added</h2>
            <ol className="features-list">
              <li>Added Login Page and logout functionality</li>
              <li>Implemented route access control</li>
              <li>Added table view for notes data</li>
              <li>Added dropdown selector to switch between grid view and table view</li>
              <li>Added confirmation before saving and deleting notes</li>
              <li>Implemented user-specific data storage with multi-user support in localStorage</li>
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