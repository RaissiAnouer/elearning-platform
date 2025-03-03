import React from 'react';

interface FilterSidebarProps {
  priceRange: string;
  setPriceRange: (range: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ priceRange, setPriceRange }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Filtres</h2>
      <h3 className="text-md font-medium mb-2">Prix</h3>
      <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="border rounded-lg p-2 w-full">
        <option value="all">Tous les prix</option>
        <option value="0-50">0 - 50 €</option>
        <option value="51-100">51 - 100 €</option>
        <option value="101-200">101 - 200 €</option>
        <option value="200+">Plus de 200 €</option>
      </select>
    </div>
  );
};

export default FilterSidebar; 