import React from 'react';

const ResponseDisplay = ({ filteredData = [], title = "Filtered Results" }) => {
  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5>{title}</h5>
        {filteredData && filteredData.length > 0 ? (
          <pre>{JSON.stringify(filteredData, null, 2)}</pre>
        ) : (
          <p className="text-muted">No results match the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default ResponseDisplay;