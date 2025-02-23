import React from 'react';
import { TrashIcon, PlayIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { VideoCameraIcon } from '@heroicons/react/24/outline';
import { Video } from '../../types/course';
import { ClockIcon } from '@heroicons/react/24/outline';

interface CourseVideoListProps {
  courseId: string;
  videos: Video[];
  onVideoDeleted: () => void;
  setIsVideoModalOpen: (isOpen: boolean) => void;
  isTeacher: boolean;
}

const CourseVideoList: React.FC<CourseVideoListProps> = ({
  courseId,
  videos,
  onVideoDeleted,
  setIsVideoModalOpen,
  isTeacher
}) => {
  const handleDelete = async (videoId: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      await axios.delete(`/api/courses/${courseId}/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Video deleted successfully');
      onVideoDeleted();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  const handlePlay = (video: Video) => {
    const baseUrl = 'http://localhost:5000';
    const fullUrl = `${baseUrl}${video.url}`;
    
    const playerModal = document.createElement('div');
    playerModal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90';
    playerModal.innerHTML = `
      <div class="relative w-full max-w-5xl mx-4">
        <div class="absolute -top-12 right-0 flex items-center space-x-4">
          <h3 class="text-white text-lg font-medium">${video.title}</h3>
          <button class="text-white hover:text-gray-300 transition-colors">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <video 
          src="${fullUrl}" 
          controls 
          autoplay 
          class="w-full rounded-xl shadow-2xl"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    `;

    playerModal.querySelector('button')?.addEventListener('click', () => {
      document.body.removeChild(playerModal);
    });

    playerModal.addEventListener('click', (e) => {
      if (e.target === playerModal) {
        document.body.removeChild(playerModal);
      }
    });

    document.body.appendChild(playerModal);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <VideoCameraIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Course Videos</h3>
            <p className="text-sm text-gray-500">{videos.length} videos available</p>
          </div>
        </div>
        {isTeacher && (
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium
              text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 
              transition-colors duration-200"
          >
            <VideoCameraIcon className="h-5 w-5 mr-2" />
            Add Video
          </button>
        )}
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white 
          rounded-xl border-2 border-dashed border-gray-200">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-blue-50 
            flex items-center justify-center">
            <VideoCameraIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-base font-medium text-gray-900">No videos yet</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
            {isTeacher 
              ? "Start adding video content for your students."
              : "No video content has been added yet."}
          </p>
          {isTeacher && (
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium
                text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 
                transition-colors duration-200"
            >
              <VideoCameraIcon className="h-5 w-5 mr-2" />
              Add First Video
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {videos.map((video) => (
            <div 
              key={video._id} 
              className="group p-4 bg-white rounded-xl border border-gray-200 
                hover:shadow-lg hover:border-blue-100 transition-all duration-200
                transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handlePlay(video)}
                    className="relative flex-shrink-0 w-20 h-20 bg-gradient-to-br 
                      from-blue-50 to-blue-100 rounded-lg overflow-hidden
                      group-hover:from-blue-100 group-hover:to-blue-200 
                      transition-colors duration-200"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircleIcon className="h-8 w-8 text-blue-600" />
                    </div>
                  </button>
                  <div>
                    <h4 className="text-base font-medium text-gray-900 group-hover:text-blue-600 
                      transition-colors duration-200">
                      {video.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="flex items-center text-xs text-gray-500">
                        <ClockIcon className="h-3.5 w-3.5 mr-1" />
                        {video.duration}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        Added {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {isTeacher && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="p-2 text-gray-400 hover:text-red-600
                        rounded-lg hover:bg-red-50 transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      title="Delete Video"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseVideoList; 