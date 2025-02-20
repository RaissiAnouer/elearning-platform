import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  XMarkIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  BookmarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
  onClose: () => void;
  searchTerm?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, onClose, searchTerm }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const goToNextPage = () => {
    if (pageNumber < (numPages || 0)) {
      setPageNumber(pageNumber + 1);
    }
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleBookmark = () => {
    if (bookmarks.includes(pageNumber)) {
      setBookmarks(bookmarks.filter(b => b !== pageNumber));
    } else {
      setBookmarks([...bookmarks, pageNumber].sort((a, b) => a - b));
    }
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfUrl.split('/').pop() || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
        <button
          onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
              <XMarkIcon className="h-6 w-6" />
        </button>
          <div className="flex items-center space-x-2">
            <button
                onClick={() => setScale(scale => Math.max(0.5, scale - 0.1))}
                className="p-2 hover:bg-gray-100 rounded-lg"
            >
              -
            </button>
              <span className="text-sm">{Math.round(scale * 100)}%</span>
            <button
                onClick={() => setScale(scale => Math.min(2, scale + 0.1))}
                className="p-2 hover:bg-gray-100 rounded-lg"
            >
              +
            </button>
          </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <span className="text-sm">
                Page {pageNumber} sur {numPages || '...'}
              </span>
              <button
                onClick={goToNextPage}
                disabled={pageNumber >= (numPages || 0)}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                bookmarks.includes(pageNumber) ? 'text-yellow-500' : 'hover:bg-gray-100'
              }`}
            >
              <BookmarkIcon className="h-5 w-5" />
            </button>
            <button
              onClick={downloadPDF}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {isFullscreen ? (
                <ArrowsPointingInIcon className="h-5 w-5" />
              ) : (
                <ArrowsPointingOutIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Thumbnails Sidebar */}
          {showThumbnails && (
            <div className="w-48 bg-gray-100 overflow-y-auto border-r">
              {Array.from(new Array(numPages), (_, index) => (
                <div
                  key={index + 1}
                  className={`p-2 cursor-pointer hover:bg-gray-200 ${
                    pageNumber === index + 1 ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => setPageNumber(index + 1)}
                >
                  <Document file={pdfUrl}>
                    <Page
                      pageNumber={index + 1}
                      width={150}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                  <div className="text-center text-sm mt-1">
                    Page {index + 1}
                    {bookmarks.includes(index + 1) && (
                      <BookmarkIcon className="h-4 w-4 text-yellow-500 inline ml-1" />
                    )}
                  </div>
                </div>
              ))}
      </div>
          )}

      {/* PDF Viewer */}
          <div className="flex-1 overflow-auto flex justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4"
            >
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )}
        <Document
                file={pdfUrl}
                onLoadSuccess={handleDocumentLoadSuccess}
                loading={
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                }
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer; 