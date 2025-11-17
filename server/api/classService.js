import axios from "axios";

const url = process.env.REACT_APP_BASE_URL  || "https://online-learning-backend-xi.vercel.app/api/classes";

// Get all classes with optional filters
export async function fetchClasses({ subject, track, date, tab, q }) {
  try {
    const params = {};
    if (subject) params.subject = subject;
    if (track) params.track = track;
    if (date) params.date = date;
    if (tab) params.tab = tab;
    if (q) params.q = q;

    const res = await axios.get(url, { params });
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching classes:", err);
    return [];
  }
}

// Create new class
export async function createClass(newClass) {
  try {
    const res = await axios.post(url, newClass);
    return res.data;
  } catch (err) {
    console.error("Error creating class:", err);
    throw err;
  }
}

// Get single class
export async function getClassById(id) {
  try {
    const res = await axios.get(`${url}/${id}`);
    return res.data?.data;
  } catch (err) {
    console.error("Error fetching class by ID:", err);
    throw err;
  }
}

// Update class
export async function updateClass(id, updates) {
  try {
    const res = await axios.put(`${url}/${id}`, updates);
    return res.data;
  } catch (err) {
    console.error("Error updating class:", err);
    throw err;
  }
}

// Delete class
export async function deleteClass(id) {
  try {
    const res = await axios.delete(`${url}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting class:", err);
    throw err;
  }
}

// Toggle booking
export async function toggleBook(id) {
  try {
    const res = await axios.post(`${url}/${id}/book`);
    return res.data;
  } catch (err) {
    console.error("Error toggling booking:", err);
    throw err;
  }
}
