import React from 'react';
import AddCourseForm from './AddCourseForm'; // Import the form component
import Button from './shared/Button';

const AddCourseModal = ({ isOpen, onClose, onCourseAdded }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Course</h2>
          <Button onClick={onClose} className="text-red-500">X</Button>
        </div>
        <AddCourseForm onCourseAdded={onCourseAdded} /> {/* Pass the callback */}
      </div>
    </div>
  );
};

export default AddCourseModal; 