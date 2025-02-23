import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FileDropzone from './shared/FileDropzone';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentIcon } from '@heroicons/react/24/outline';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: { title: string; file: File }) => Promise<void>;
  courseId?: string;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  courseId,
  isOpen,
  onClose,
  onUpload
}) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    try {
      setIsUploading(true);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      
      // Upload the document
      await onUpload({ title, file });
      
      // Clear the form
      setFile(null);
      setTitle('');
      
      // Show success message
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Error uploading document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="mx-auto max-w-md w-full bg-gray-100 rounded-xl shadow-xl 
                  overflow-hidden transform"
              >
                <div className="relative p-6">
                  <div className="flex justify-between items-center mb-6">
                    <Dialog.Title className="text-xl font-semibold text-gray-900">
                      Ajouter un nouveau document
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="text-gray-500 hover:text-gray-700 transition duration-200"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre du document
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3
                          focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        placeholder="Entrez le titre du document"
                        required
                      />
                    </div>

                    <div>
                      <FileDropzone
                        accept={{
                          'application/pdf': ['.pdf'],
                          'application/msword': ['.doc'],
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                          'application/vnd.ms-excel': ['.xls'],
                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                          'text/plain': ['.txt']
                        }}
                        maxSize={10 * 1024 * 1024}
                        file={file}
                        onFileChange={setFile}
                        fileType="document"
                      />
                    </div>

                    {file && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 bg-blue-50 
                          rounded-lg border border-blue-100"
                      >
                        <div className="flex items-center space-x-3">
                          <DocumentIcon className="h-5 w-5 text-blue-600" />
                          <span className="text-sm text-gray-600">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Supprimer
                        </button>
                      </motion.div>
                    )}

                    <div className="flex justify-end gap-3 mt-8">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 
                          bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading || !file || !title}
                        className="px-4 py-2 text-sm font-medium text-white 
                          bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 
                          disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? (
                          <div className="flex items-center space-x-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Téléchargement...</span>
                          </div>
                        ) : (
                          'Télécharger'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default DocumentUploadModal; 