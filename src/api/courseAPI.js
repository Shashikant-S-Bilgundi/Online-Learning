import axios from "axios";

const url = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

export async function getAllCourses({ q, category, level, sort }) {
  const params = {};
  if (q) params.q = q;
  if (category) params.category = category;
  if (level) params.level = level;
  if (sort) params.sort = sort;

  const res = await axios.get(`${url}/api/courses`, { params });
  return res.data;
}

export async function getCourseById(id) {
  const res = await axios.get(`${url}/api/courses/${id}`);
  return res.data;
}

export async function createCourse(courseData) {
  const res = await axios.post(`${url}/api/courses`, courseData);
  return res.data;
}

export async function updateCourse(id, courseData) {
  const res = await axios.put(`${url}/api/courses/${id}`, courseData);
  return res.data;
}

export async function deleteCourse(id) {
  const res = await axios.delete(`${url}/api/courses/${id}`);
  return res.data;
}
