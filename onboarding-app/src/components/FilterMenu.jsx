import React, { useState } from 'react';
import FilterOption from './FilterOption';
import DownloadButton from './DownloadButton';

export default function FilterMenu() {

    const [filters, setFilters] = useState({
    role: '',
    industry: '',
    country: '',
    cnae: ''
  });

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };
      const roles = ['Director', 'COO', 'CMO','CEO','CFO','CTO','VP']; // Reemplaza con opciones reales
  const industries = ['Entertainment', 'Education', 'Finance','Healthcare']; // Reemplaza con opciones reales
  const countries = ['Faroe Islands', 'Kiribati', 'Myanmar','Switzerland','Western Sahara','United Kingdom'];
  return (
    
<div className="filter-menu p-6 bg-white shadow-md rounded-md   " >
      <FilterOption name="Rol" value={filters.role} onChange={(value) => handleFilterChange('role', value)} options={roles} />
      <FilterOption name="Industria" value={filters.industry} onChange={(value) => handleFilterChange('industry', value)} options={industries} />
      <FilterOption name="País" value={filters.country} onChange={(value) => handleFilterChange('country', value)} options={countries} />
      <FilterOption name="CNAE" value={filters.cnae} onChange={(value) => handleFilterChange('cnae', value)} />
        <div className='text-center m-4'>   <DownloadButton filters={filters} /></div>
   
    </div>
  )
}
