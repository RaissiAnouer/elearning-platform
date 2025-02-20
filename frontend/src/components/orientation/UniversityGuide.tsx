import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DocumentIcon, BookOpenIcon, ClockIcon, ArrowDownTrayIcon, StarIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import PDFViewer from './PDFViewer';

interface PDFFile {
  title: string;
  file: string;
  description: string;
  category: string;
  lastUpdated: string;
  downloadCount: number;
  isFavorite?: boolean;
  tags?: string[];
  pageCount?: number;
}

const UniversityGuide = () => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'title'>('recent');

  const pdfFiles: PDFFile[] = [
    {
      title: "Guide d'orientation universitaire 2024",
      file: '/pdfs/guide2024.pdf',
      description: "Guide complet pour l'orientation universitaire en Tunisie",
      category: 'orientation',
      lastUpdated: '2024-02-15',
      downloadCount: 1250,
      tags: ['Orientation', 'Université', '2024'],
      pageCount: 120
    },
    {
      title: "Guide Technique 2024",
      file: '/pdfs/guide_technique_2024.pdf',
      description: "Guide technique pour les filières professionnelles",
      category: 'technique',
      lastUpdated: '2024-02-10',
      downloadCount: 890,
      tags: ['Technique', 'Professionnel', '2024'],
      pageCount: 85
    }
  ];

  const categories = [
    { id: 'all', name: 'Tous les guides', icon: DocumentIcon },
    { id: 'orientation', name: 'Orientation', icon: BookOpenIcon },
    { id: 'technique', name: 'Technique', icon: ClockIcon }
  ];

  const sortedAndFilteredPdfs = pdfFiles
    .filter(pdf => {
      const matchesSearch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pdf.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || pdf.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'popular':
          return b.downloadCount - a.downloadCount;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handlePdfSelect = (file: string) => {
    setSelectedPdf(file);
    setRecentlyViewed(prev => [file, ...prev.filter(f => f !== file)].slice(0, 3));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <AnimatePresence mode="wait">
        {!selectedPdf ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Header with Quick Actions */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Guides Universitaires
                  </h1>
                  <p className="text-gray-600">
                    Découvrez nos guides pour vous aider dans votre orientation universitaire
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="p-2 rounded-lg hover:bg-gray-100"
                    title={viewMode === 'grid' ? 'Vue liste' : 'Vue grille'}
                  >
                    {viewMode === 'grid' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* External Resource Box */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <BookOpenIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">
                      Ressources supplémentaires
                    </h3>
                    <p className="mt-1 text-sm text-blue-700">
                      Pour plus d'informations sur l'orientation universitaire, visitez le site officiel :
                    </p>
                    <a 
                      href="https://www.orientation.tn/orient/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      www.orientation.tn
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher dans les guides..."
                    className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-3 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="recent">Plus récents</option>
                  <option value="popular">Plus populaires</option>
                  <option value="title">Ordre alphabétique</option>
                </select>
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2
                      ${selectedCategory === category.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* PDF Documents Display */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedAndFilteredPdfs.map((pdf) => (
                  <motion.div
                    key={pdf.file}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <DocumentIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {pdf.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {pdf.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {pdf.tags?.map(tag => (
                              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center text-sm text-gray-500 space-x-4">
                            <span className="flex items-center">
                              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                              {pdf.downloadCount.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {new Date(pdf.lastUpdated).toLocaleDateString()}
                            </span>
                            {pdf.pageCount && (
                              <span className="flex items-center">
                                <BookOpenIcon className="h-4 w-4 mr-1" />
                                {pdf.pageCount} pages
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <button 
                          onClick={() => handlePdfSelect(pdf.file)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <BookOpenIcon className="h-4 w-4 mr-2" />
                          Consulter
                        </button>
                        <button 
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Toggle favorite logic here
                          }}
                        >
                          <StarIcon className={`h-5 w-5 ${pdf.isFavorite ? 'fill-current text-yellow-400' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedAndFilteredPdfs.map((pdf) => (
                  <motion.div
                    key={pdf.file}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <DocumentIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {pdf.title}
                        </h3>
                        <p className="text-sm text-gray-500">{pdf.description}</p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <span>{new Date(pdf.lastUpdated).toLocaleDateString()}</span>
                          <span>{pdf.downloadCount} téléchargements</span>
                          {pdf.pageCount && <span>{pdf.pageCount} pages</span>}
                        </div>
                      </div>
                      <button 
                        onClick={() => handlePdfSelect(pdf.file)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Consulter
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* No Results Message */}
            {sortedAndFilteredPdfs.length === 0 && (
              <div className="text-center py-12">
                <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun guide trouvé</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PDFViewer 
              pdfUrl={selectedPdf} 
              onClose={() => setSelectedPdf(null)}
              searchTerm={searchTerm}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UniversityGuide;
