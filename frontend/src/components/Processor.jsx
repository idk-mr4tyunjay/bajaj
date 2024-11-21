import React, { useState, useMemo } from 'react';
import axios from 'axios';
import FilterDropdown from './Dropdown';
import ResponseDisplay from './Display';
import JSONInput from './Json';

const JSONProcessor = () => {
  // State management
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    alphabets: false,
    numbers: false,
    highestLowercase: false
  });

  // Handle JSON submission
  const handleSubmit = async (jsonInput) => {
    // Reset previous states
    setError(null);
    setResponse(null);

    try {
      const apiResponse = await axios.post('http://localhost:3000/bfhl', JSON.parse(jsonInput));
      setResponse(apiResponse.data);
    } catch (err) {
      setError(err.response?.data || 'An error occurred during API call');
    }
  };

  // Update filter selections
  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  // Memoized filter response to prevent unnecessary recalculations
  const filteredData = useMemo(() => {
    // If no response, return empty array
    if (!response) return [];

    // Determine the data source based on the response structure
    let processedData = [];

    // Check for different possible data locations
    if (response.alphabets) processedData = [...response.alphabets];
    else if (response.data && response.data.alphabets) processedData = [...response.data.alphabets];
    else if (Array.isArray(response)) processedData = [...response];

    // Apply filters
    if (selectedFilters.alphabets) {
      processedData = processedData.filter(item => /[a-zA-Z]/.test(item));
    }
    

    if (selectedFilters.numbers) {
      processedData = processedData.filter(item => {
        // Allow numeric types or strings that represent valid numbers
        return typeof item === 'number' || (!isNaN(item) && !/[^\d]/.test(item));
      });
    }
    

    if (selectedFilters.highestLowercase) {
      const lowercaseItems = processedData.filter(item => 
        typeof item === 'string' && /[a-z]/.test(item)  // Checks for lowercase characters
      );
      processedData = lowercaseItems.length > 0 
        ? [lowercaseItems.sort().reverse()[0]]  // Selects the highest lowercase character
        : [];
    }
    

    return processedData;
  }, [response, selectedFilters]);

  // Prepare full response details for comprehensive display
  const responseDetails = useMemo(() => {
    if (!response) return {};
    return {
      User_ID: response.user_id,
      Email: response.email,
      Roll_Number: response.roll_number,
      Is_Success: response.is_success,
      Numbers: response.numbers,
      Alphabets: response.alphabets,
      Highest_Lowercase: response.highest_lowercase_alphabet,
      Is_Prime_Found: response.is_prime_found,
      File_Valid: response.file_valid 
    };
  }, [response]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              JSON Data Processor
            </div>
            <div className="card-body">
              {/* JSON Input Component */}
              <JSONInput onSubmit={handleSubmit} />

              {/* Error Display */}
              {error && (
                <div className="alert alert-danger mt-3">
                  {error}
                </div>
              )}

              {/* Filter Dropdown - Only show when response exists */}
              {response && (
                <FilterDropdown 
                  onFilterChange={handleFilterChange}
                  selectedFilters={selectedFilters}
                />
              )}

              {/* Full Response Details */}
              {response && (
                <div className="card mt-3">
                  <div className="card-header">Response Details</div>
                  <div className="card-body">
                    <pre>{JSON.stringify(responseDetails, null, 2)}</pre>
                  </div>
                </div>
              )}

              {/* Filtered Data Display */}
              {response && (
                <ResponseDisplay 
                  filteredData={filteredData} 
                  title="Filtered Alphabets" 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JSONProcessor;