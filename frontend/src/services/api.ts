const deleteDocument = async (courseId: string, documentId: string) => {
  const response = await axios.delete(
    `${API_URL}/courses/${courseId}/documents/${documentId}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` }
    }
  );
  return response.data;
}; 