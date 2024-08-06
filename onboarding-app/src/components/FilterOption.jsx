import React from 'react'

export default function FilterOption({ name, value, onChange,options }) {
      if (options) {
    return (
      <div className="filter-option mb-4">
        <label className="block text-gray-700">{name}</label>
        <select 
          className="mt-1 block  rounded-md  h-10 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select {name}</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }

    
  return (
   <div className="filter-option mb-4">
      <label className="block text-gray-700">{name}</label>
      <input 
        type="text" 
        className="mt-1 block rounded-md  h-10 w-full bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
