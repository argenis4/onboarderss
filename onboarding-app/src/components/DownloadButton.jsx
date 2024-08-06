import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

export default function DownloadButton({ filters }) {
      const [downloadCount, setDownloadCount] = useState(0);
  const handleDownload = async () => {

    try {
      const response = await axios.post('http://localhost:3000/api/download', filters, {
        responseType: 'blob',
      });
console.log(response)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
     const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target.result;
        
        // Usa PapaParse para leer el CSV
        Papa.parse(csvData, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data.length > 1) {
              const secondRow = results.data[1]; // Segunda fila
              const lastValue = secondRow[secondRow.length - 1]; // Último valor en la fila
              setDownloadCount(parseInt(lastValue, 10) || 0); // Actualiza el estado
            }
          },
        });
      };

      // Lee el archivo como texto
      reader.readAsText(response.data);
      
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  return (
    <div>
        <button 
        onClick={handleDownload} 
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
        Descargar .csv
        </button>

        <p className="mt-2">Cantidad de descargas: {downloadCount}</p>
    </div>
  )
}
