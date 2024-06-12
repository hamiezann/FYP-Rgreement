import React from 'react';
import { FaHome } from 'react-icons/fa';

const FilterModal = ({ filterOptions, handleFilterChange, handleApplyFilters, handleClearFilters, showNearest, handleShowNearestChange, showFarthest, handleShowFarthestChange, closeModal }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Rent Nearby</h2>
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="sortBy" className="form-label">Sort By:</label>
            <select
              id="sortBy"
              name="sortBy"
              value={filterOptions.sortBy}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">Select</option>
              <option value="cheapest">Cheapest</option>
              <option value="expensive">Most Expensive</option>
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="houseType" className="form-label">House Type:</label>
            <select
              id="houseType"
              name="houseType"
              value={filterOptions.houseType}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">Select</option>
              <option value="Flat">Flat</option>
              <option value="Lot House">Lot House</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>
          <div className="col-md-3">
            <div className="form-check mt-4">
              <input
                type="checkbox"
                id="showNearest"
                name="showNearest"
                checked={showNearest}
                onChange={handleShowNearestChange}
                className="form-check-input"
              />
              <label htmlFor="showNearest" className="form-check-label">Show Nearest</label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-check mt-4">
              <input
                type="checkbox"
                id="showFarthest"
                name="showFarthest"
                checked={showFarthest}
                onChange={handleShowFarthestChange}
                className="form-check-input"
              />
              <label htmlFor="showFarthest" className="form-check-label">Show Farthest</label>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <button onClick={handleApplyFilters} className="btn btn-primary me-2">Apply Filters</button>
          <button onClick={handleClearFilters} className="btn btn-secondary">Clear Filters</button>
        </div>
        <button className="btn btn-secondary mt-3" onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default FilterModal;
