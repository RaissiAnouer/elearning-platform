import React, { useState } from 'react';
import Button from '../components/shared/Button';
import PageBanner from '../components/shared/PageBanner';
import FilterSidebar from '../components/FilterSidebar'; // Import the new sidebar component
import { useAuth } from '../contexts/AuthContext'; // Import the Auth context
import AddCourseModal from '../components/AddCourseModal'; // Import the modal component

const Formation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all'); // State for price range
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [courses, setCourses] = useState([]); // State to hold courses
  const { user } = useAuth(); // Get the user from Auth context

  // Form state
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    image: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Course Data:', courseData);
    // Reset form
    setCourseData({ title: '', description: '', price: '', duration: '', image: '' });
    setIsModalOpen(false); // Hide the modal after submission
  };

  const handleCourseAdded = (newCourse) => {
    setCourses([...courses, newCourse]); // Add new course to the list
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageBanner
        title="Formation"
        subtitle="Explorez nos programmes de formation"
        highlight="formation"
        tag="Restons connectés"
      />
      <div className="flex p-4">
        <aside className="w-1/4 p-4">
          <FilterSidebar 
            priceRange={priceRange} 
            setPriceRange={setPriceRange} 
          />
        </aside>
        <main className="flex-1 p-4">
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-lg p-2 w-1/2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {user?.role === 'teacher' && (
            <Button className="mb-4" onClick={() => setIsModalOpen(true)}>
              Ajouter un cours
            </Button>
          )}
          <AddCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCourseAdded={handleCourseAdded} />
          <div className="mt-6">
            {courses.length > 0 ? (
              courses.map(course => <div key={course._id}>{course.title}</div>) // Display course titles
            ) : (
              <p>Aucun cours à afficher pour le moment.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Formation; 