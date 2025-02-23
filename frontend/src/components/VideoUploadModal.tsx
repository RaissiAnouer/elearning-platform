import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FileDropzone from './shared/FileDropzone';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: { title: string; file: File }) => Promise<void>;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    try {
      setIsUploading(true);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);

      await onUpload({ title, file });
      setUploadProgress(100);
      
      // Reset form after successful upload
      setTimeout(() => {
        setTitle('');
        setFile(null);
        setCurrentStep(1);
        setUploadProgress(0);
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Error uploading video:', error);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && file) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-gray-100 p-6 w-full shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-800">
              {currentStep === 1 ? 'Sélectionner une vidéo' : 'Détails de la vidéo'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition duration-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'
                }`}>
                  1
                </div>
                <div className={`h-1 w-16 mx-2 ${
                  currentStep === 2 ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'
                }`}>
                  2
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {currentStep === 1 ? (
              <FileDropzone
                accept={{
                  'video/*': ['.mp4', '.webm', '.ogg']
                }}
                maxSize={100 * 1024 * 1024}
                file={file}
                onFileChange={setFile}
                fileType="video"
                isUploading={isUploading}
                progress={uploadProgress}
              />
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre de la vidéo
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Entrez un titre descriptif"
                />
              </div>
            )}

            <div className="flex justify-between gap-3 mt-6">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 text-sm font-medium text-gray-700 
                    bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
                >
                  Retour
                </button>
              )}
              {currentStep === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!file}
                  className="ml-auto px-4 py-2 text-sm font-medium text-white 
                    bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200 
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isUploading || !title}
                  className={`px-4 py-2 text-sm font-medium text-white 
                    ${isUploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
                    rounded-lg transition duration-200`}
                >
                  {isUploading ? (
                    <span>Uploading...</span>
                  ) : (
                    <span>Upload Video</span>
                  )}
                </button>
              )}
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default VideoUploadModal; 