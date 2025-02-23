import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { TrashIcon, DocumentIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface Document {
  _id: string;
  title: string;
  url: string;
  type: string;
  size: string;
  createdAt: string;
  description?: string;
  category?: string;
}

interface CourseDocumentListProps {
  courseId: string;
  documents: Document[];
  onDocumentDeleted: () => void;
  setIsDocumentModalOpen: (isOpen: boolean) => void;
  isTeacher: boolean;
}

const CourseDocumentList: React.FC<CourseDocumentListProps> = ({
  courseId,
  documents,
  onDocumentDeleted,
  setIsDocumentModalOpen,
  isTeacher
}) => {
  const { user } = useAuth();

  const handleDelete = async (documentId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await axios.delete(`/api/courses/${courseId}/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Document deleted successfully');
      onDocumentDeleted();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const baseUrl = 'http://localhost:5000';
      const fullUrl = `${baseUrl}${doc.url}`;
      
      const loadingToast = toast.loading(
        <div className="flex items-center space-x-2">
          <span className="animate-spin">⏳</span>
          <span>Downloading {doc.title}...</span>
        </div>
      );
      
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.title;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      toast.dismiss(loadingToast);
      toast.success(`${doc.title} downloaded successfully!`);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <DocumentIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Course Documents</h3>
            <p className="text-sm text-gray-500">{documents.length} documents available</p>
          </div>
        </div>
        {isTeacher && (
          <button
            onClick={() => setIsDocumentModalOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium
              text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 
              transition-colors duration-200"
          >
            <DocumentIcon className="h-5 w-5 mr-2" />
            Add Document
          </button>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white 
          rounded-xl border-2 border-dashed border-gray-200">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-blue-50 
            flex items-center justify-center">
            <DocumentIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-base font-medium text-gray-900">No documents yet</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
            {isTeacher 
              ? "Start adding course materials for your students."
              : "No course materials have been added yet."}
          </p>
          {isTeacher && (
            <button
              onClick={() => setIsDocumentModalOpen(true)}
              className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium
                text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 
                transition-colors duration-200"
            >
              <DocumentIcon className="h-5 w-5 mr-2" />
              Add First Document
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <div 
              key={doc._id} 
              className="group p-4 bg-white rounded-xl border border-gray-200 
                hover:shadow-lg hover:border-blue-100 transition-all duration-200
                transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br 
                    from-blue-50 to-blue-100 rounded-lg flex items-center 
                    justify-center group-hover:from-blue-100 group-hover:to-blue-200 
                    transition-colors duration-200">
                    <DocumentIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-900 group-hover:text-blue-600 
                      transition-colors duration-200">
                      {doc.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-xs text-gray-500">{doc.size}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        Added {new Date(doc.createdAt).toLocaleDateString()} at {' '}
                        {new Date(doc.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                  flex items-center gap-2">
                  <button 
                    onClick={() => handleDownload(doc)} 
                    className="p-2 text-blue-600 hover:text-blue-700 
                      rounded-lg hover:bg-blue-50 transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    title="Download Document"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                  {isTeacher && (
                    <button 
                      onClick={() => handleDelete(doc._id)} 
                      className="p-2 text-gray-400 hover:text-red-600
                        rounded-lg hover:bg-red-50 transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      title="Delete Document"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseDocumentList; 