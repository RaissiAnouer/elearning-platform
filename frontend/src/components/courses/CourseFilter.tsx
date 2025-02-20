import React, { useState } from 'react';
import { 
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import Card from '../shared/Card';
import Button from '../shared/Button';

interface FilterProps {
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  onReset: () => void;
  onApplyFilters: () => void;
}

const CourseFilter = ({ 
  priceRange, 
  onPriceChange,
  onReset,
  onApplyFilters
}: FilterProps) => {
  const [openSection, setOpenSection] = useState<'price' | null>(null);
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);

  const toggleSection = (section: 'price') => {
    setOpenSection(openSection === section ? null : section);
  };

  const handlePriceChange = (value: number) => {
    const newRange: [number, number] = [0, value];
    setTempPriceRange(newRange);
  };

  const handleApplyFilters = () => {
    onPriceChange(tempPriceRange);
    onApplyFilters();
  };

  const handleReset = () => {
    setTempPriceRange([0, 1000]);
    onReset();
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100" hover={false}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
          </div>
          {tempPriceRange[1] < 1000 && (
            <button
              onClick={handleReset}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Réinitialiser
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Price Range Filter */}
          <div className="border border-gray-100 rounded-lg">
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-gray-700">Budget</span>
              <ChevronDownIcon 
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 
                  ${openSection === 'price' ? 'transform rotate-180' : ''}`}
              />
            </button>
            {openSection === 'price' && (
              <div className="p-3 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Prix maximum:</span>
                  <span className="text-sm font-medium text-blue-600">
                    {tempPriceRange[1]} DT
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={tempPriceRange[1]}
                  onChange={(e) => handlePriceChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                    accent-blue-600 hover:accent-blue-700 transition-all duration-200"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0 DT</span>
                  <span>1000 DT</span>
                </div>
              </div>
            )}
          </div>

          {/* Apply Filters Button */}
          <Button
            onClick={handleApplyFilters}
            className="w-full mt-4"
            variant="primary"
          >
            Appliquer les filtres
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CourseFilter; 