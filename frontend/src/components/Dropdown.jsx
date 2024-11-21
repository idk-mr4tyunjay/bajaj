import React from 'react';

const FilterDropdown = ({ onFilterChange, selectedFilters }) => {
  // Handle individual filter toggle
  const handleFilterToggle = (filterName) => {
    const updatedFilters = {
      ...selectedFilters,
      [filterName]: !selectedFilters[filterName]
    };
    onFilterChange(updatedFilters);
  };

  return (
    <div className="mb-3">
      <h5>Filter Results</h5>
      <div className="dropdown">
        <button 
          className="btn btn-secondary dropdown-toggle w-100" 
          type="button" 
          data-bs-toggle="dropdown" 
          aria-expanded="false"
        >
          Select Filters
        </button>
        <ul className="dropdown-menu w-100">
          {/* Alphabets Filter */}
          <li>
            <div className="dropdown-item">
              <input 
                type="checkbox" 
                className="form-check-input me-2"
                id="alphabetsFilter"
                checked={selectedFilters.alphabets}
                onChange={() => handleFilterToggle('alphabets')}
              />
              <label 
                className="form-check-label" 
                htmlFor="alphabetsFilter"
              >
                Alphabets
              </label>
            </div>
          </li>

          {/* Numbers Filter */}
          <li>
            <div className="dropdown-item">
              <input 
                type="checkbox" 
                className="form-check-input me-2"
                id="numbersFilter"
                checked={selectedFilters.numbers}
                onChange={() => handleFilterToggle('numbers')}
              />
              <label 
                className="form-check-label" 
                htmlFor="numbersFilter"
              >
                Numbers
              </label>
            </div>
          </li>

          {/* Highest Lowercase Filter */}
          <li>
            <div className="dropdown-item">
              <input 
                type="checkbox" 
                className="form-check-input me-2"
                id="highestLowercaseFilter"
                checked={selectedFilters.highestLowercase}
                onChange={() => handleFilterToggle('highestLowercase')}
              />
              <label 
                className="form-check-label" 
                htmlFor="highestLowercaseFilter"
              >
                Highest Lowercase Alphabet
              </label>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FilterDropdown;