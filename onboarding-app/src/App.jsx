import React from 'react';
import FilterMenu from './components/FilterMenu';

function App() {
  return (
  <div className="app-container flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h3 className='text-2xl font-semibold text-gray-800 mb-6'>
        Busqueda archivo "AllLeads "
      </h3>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <FilterMenu />
      </div>
    </div>
  );
}

export default App;