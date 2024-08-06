const { google } = require('googleapis');
const sheets = google.sheets('v4');
const path = require('path');
import {GOOGLE_URL}  from '../config.js'

const credentialsPath = path.resolve(__dirname, '../testcloud-431621-5623f2ecb7b3.json'); // Configurar con las credenciales de la API de Google

async function authenticate() {
  const auth = new google.auth.GoogleAuth({
   keyFile: credentialsPath,
    scopes: [GOOGLE_URL],
  });
  return await auth.getClient();
}

async function filterLeadsAndUpdateCount(filters) {
  const auth = await authenticate();
  const sheetsApi = google.sheets({ version: 'v4', auth });

  const sheetId = '1mdIfw-BIf0kEsGIl2YsMSnEW9sMGQ94Gq1h471dNXFM'; // ID de tu Google Sheets
  const range = 'SHEET_NAME!A:Z'; // Rango de tu hoja

  const response = await sheetsApi.spreadsheets.values.get({ spreadsheetId: sheetId, range });
  const rows = response.data.values;

  const headers = rows[0];
  const data = rows.slice(1);
  const filteredLeads = data.filter((row) => {
    const role = row[headers.indexOf('Role')]; // Cambia esto según el nombre exacto de la columna
    const industry = row[headers.indexOf('industry')];
    const country = row[headers.indexOf('country')];
    const cnae = row[headers.indexOf('CNAE')]; // Cambia esto según el nombre exacto de la columna
    const downloadCountIndex = headers.indexOf('DownloadCount');

    return (!filters.role || role === filters.role) &&
           (!filters.industry || industry === filters.industry) &&
           (!filters.country || country === filters.country) &&
           (!filters.cnae || cnae === filters.cnae);
  });

  // Incrementar DownloadCount
  for (let lead of filteredLeads) {
    const downloadCountIndex = headers.indexOf('DownloadCount');
    lead[downloadCountIndex] = parseInt(lead[downloadCountIndex] || 0) + 1;
  }

  // Actualizar Google Sheets con el nuevo DownloadCount
  const updateRequests = filteredLeads.map((lead, index) => {
    const rowIndex = data.indexOf(lead) + 2; // +2 para compensar el header y el índice base 1 de Google Sheets
    const downloadCountIndex = headers.indexOf('DownloadCount');

    return {
      range: `SHEET_NAME!${String.fromCharCode(65 + downloadCountIndex)}${rowIndex}`, // Ajustar al índice correcto de la columna
      values: [[lead[downloadCountIndex]]],
    };
  });

  if (updateRequests.length > 0) {
    await sheetsApi.spreadsheets.values.batchUpdate({
      spreadsheetId: sheetId,
      resource: {
        data: updateRequests,
        valueInputOption: 'RAW',
      },
    });
  }

  // Convertir los datos filtrados a CSV
  const csvData = [
    headers.join(','), 
    ...filteredLeads.map((lead) => lead.join(','))
  ].join('\n');
  
  return csvData;
}


module.exports = { filterLeadsAndUpdateCount };