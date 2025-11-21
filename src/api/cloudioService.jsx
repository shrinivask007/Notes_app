import axios from "axios";

export const insertNote = async ({ userId, noteId, title, content }, user) => {
  if (!user?.id) return;

  const body = {
    NotesDataShriAlias: {
      ds: "NotesDataShri", 
      data: [
        {
          _rs: "I",
          userId: String(userId),
          noteId: String(noteId),
          title: String(title),
          content: String(content)
        }
      ]
    }
  };

  console.log("INSERT API Request Body:", JSON.stringify(body, null, 2));
  console.log("User context in service:", user);
  
  try {
    const response = await axios.post(`https://dev.cloudio.io/v1/api?x=${encodeURIComponent(user.x)}`, body, {
      headers: {
        "Content-Type": "application/json",
        "X-Application": "training",
        "Authorization": user.jwt,
      }
    });
    
    console.log("INSERT API Response:", response.data);
    return response;
  } catch (error) {
    console.error("INSERT API Error:", error);
    console.error("INSERT API Error Response:", error.response?.data);
    throw error;
  }
};

// Logout Function
export const logoutUser = async (user) => {
  if (!user?.x) return;

  try {
    const response = await fetch(`https://dev.cloudio.io/v1/signout?x=${encodeURIComponent(user.x)}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "X-Application": "SignIn",
        "Content-Type": "application/json",
      },
    });
    
    console.log("Logout API Response:", response);
    return response;
  } catch (err) {
    console.error("Signout error:", err);
    throw err;
  }
};


export const fetchNotes = async (userId, user) => {
  if (!user?.id) return;

  const body = {
    NotesDataShriAlias: {
      ds: "NotesDataShri",
      query: {
        filter: [{ userId: { is: String(userId) } }],
        projection: { 
          id: 1, 
          userId: 1, 
          noteId: 1, 
          title: 1, 
          content: 1,
          creationDate: 1,
          createdBy: 1,
          lastUpdateDate: 1,
          lastUpdatedBy: 1
        },
        limit: 1000,
      }
    }
  };

  console.log("FETCH API Request Body:", JSON.stringify(body, null, 2));
  
  try {
    const response = await axios.post(`https://dev.cloudio.io/v1/api?x=${encodeURIComponent(user.x)}`, body, {
      headers: {
        "Content-Type": "application/json",
        "X-Application": "training",
        "Authorization": user.jwt,
      }
    });
    
    console.log("FETCH API Response:", response.data);
    
    const rows = response.data?.data?.NotesDataShriAlias?.data ?? [];
    return rows.map((row) => ({
      id: row.id, // Use the table ID for updates
      noteId: row.noteId, // Keep noteId for reference
      userId: row.userId,
      title: row.title,
      content: row.content,
      creationDate: row.creationDate,
      createdBy: row.createdBy,
      lastUpdateDate: row.lastUpdateDate,
      lastUpdatedBy: row.lastUpdatedBy
    }));
  } catch (error) {
    console.error("FETCH API Error:", error);
    throw error;
  }
};


// Update note function - 
export const updateNote = async (noteData, user) => {
  if (!noteData?.id) throw new Error("Missing note id");
  if (!user?.x || !user?.jwt) {
    throw new Error("User session missing. Please login again.");
  }

  try {
    // 1) First fetch the current note data to get all required fields
    const fetchBody = {
      NotesDataShriAlias: {
        ds: "NotesDataShri",
        query: {
          filter: [{ id: { is: Number(noteData.id) } }],
          projection: {
            id: 1,
            userId: 1,
            noteId: 1,
            title: 1,
            content: 1,
            creationDate: 1,
            createdBy: 1,
            lastUpdateDate: 1,
            lastUpdatedBy: 1
          },
          limit: 1,
          offset: 0,
        },
      },
    };

    console.log("FETCH FOR UPDATE Request Body:", JSON.stringify(fetchBody, null, 2));

    const fetchRes = await fetch(
      `https://dev.cloudio.io/v1/api?x=${encodeURIComponent(user.x)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Application": "training",
          Authorization: user.jwt,
        },
        body: JSON.stringify(fetchBody),
      }
    );

    if (!fetchRes.ok) {
      const txt = await fetchRes.text().catch(() => "");
      throw new Error(`Failed to fetch note: ${txt || fetchRes.status}`);
    }

    const fetchJson = await fetchRes.json();
    const row = fetchJson?.data?.NotesDataShriAlias?.data?.[0];
    
    if (!row) throw new Error("Note not found on server");

    console.log("Fetched note data for update:", row);

    // 2) Build update payload merging current values with new values
    const updateData = {
      _rs: "U",
      id: row.id,
      userId: row.userId,
      noteId: row.noteId,
      title: noteData.title || row.title,
      content: noteData.content || row.content,
      creationDate: row.creationDate,        
      createdBy: row.createdBy,              
      lastUpdateDate: row.lastUpdateDate,   
      lastUpdatedBy: row.lastUpdatedBy,      
    };

    const updateBody = {
      NotesDataShriAlias: {
        ds: "NotesDataShri",
        data: [updateData],
      },
    };

    console.log("UPDATE API Request Body:", JSON.stringify(updateBody, null, 2));

    // 3) Send update using the same endpoint pattern
    const updateRes = await fetch(
      `https://dev.cloudio.io/v1/api?x=${encodeURIComponent(user.x)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Application": "training",
          Authorization: user.jwt,
        },
        body: JSON.stringify(updateBody),
      }
    );

    if (!updateRes.ok) {
      const txt = await updateRes.text().catch(() => "");
      throw new Error(`Update failed: ${txt || updateRes.status}`);
    }

    const updateJson = await updateRes.json();
    
    if (updateJson?.status && updateJson.status !== "OK") {
      throw new Error(updateJson?.message ?? updateJson?.title ?? "Update failed");
    }

    console.log("UPDATE API Response:", updateJson);
    return updateJson;

  } catch (error) {
    console.error("UPDATE API Error:", error);
    console.error("UPDATE API Error Response:", error.response?.data);
    throw error;
  }
};

// Delete note function 
export const deleteNote = async (noteId, user) => {
  if (!noteId) throw new Error("Missing note id");
  if (!user?.x || !user?.jwt) {
    throw new Error("User session missing. Please login again.");
  }

  try {
    // 1) First fetch the current note data to get all required fields (optional for delete, but follows the pattern)
    const fetchBody = {
      NotesDataShriAlias: {
        ds: "NotesDataShri",
        query: {
          filter: [{ id: { is: Number(noteId) } }],
          projection: {
            id: 1,
            userId: 1,
            noteId: 1,
            title: 1,
            content: 1,
            creationDate: 1,
            createdBy: 1,
            lastUpdateDate: 1,
            lastUpdatedBy: 1
          },
          limit: 1,
          offset: 0,
        },
      },
    };

    console.log("FETCH FOR DELETE Request Body:", JSON.stringify(fetchBody, null, 2));

    const fetchRes = await fetch(
      `https://dev.cloudio.io/v1/api?x=${encodeURIComponent(user.x)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Application": "training",
          Authorization: user.jwt,
        },
        body: JSON.stringify(fetchBody),
      }
    );

    if (!fetchRes.ok) {
      const txt = await fetchRes.text().catch(() => "");
      throw new Error(`Failed to fetch note for deletion: ${txt || fetchRes.status}`);
    }

    const fetchJson = await fetchRes.json();
    const row = fetchJson?.data?.NotesDataShriAlias?.data?.[0];
    
    if (!row) throw new Error("Note not found on server");

    console.log("Fetched note data for deletion:", row);

    // 2) Build delete payload - only need ID for deletion, but following the pattern
    const deleteData = {
      _rs: "D",  
      id: row.id, 
      lastUpdateDate:row.lastUpdateDate
    };

    const deleteBody = {
      NotesDataShriAlias: {
        ds: "NotesDataShri",
        data: [deleteData],
      },
    };

    console.log("DELETE API Request Body:", JSON.stringify(deleteBody, null, 2));

    // 3) Send delete using the same endpoint pattern
    const deleteRes = await fetch(
      `https://dev.cloudio.io/v1/api?x=${encodeURIComponent(user.x)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Application": "training",
          Authorization: user.jwt,
        },
        body: JSON.stringify(deleteBody),
      }
    );

    if (!deleteRes.ok) {
      const txt = await deleteRes.text().catch(() => "");
      throw new Error(`Delete failed: ${txt || deleteRes.status}`);
    }

    const deleteJson = await deleteRes.json();
    
    if (deleteJson?.status && deleteJson.status !== "OK") {
      throw new Error(deleteJson?.message ?? deleteJson?.title ?? "Delete failed");
    }

    console.log("DELETE API Response:", deleteJson);
    return deleteJson;

  } catch (error) {
    console.error("DELETE API Error:", error);
    console.error("DELETE API Error Response:", error.response?.data);
    throw error;
  }
};