const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const router = express.Router();

// Ruta absoluta al archivo de credenciales
const credentialsPath = path.resolve(__dirname, '../testcloud-431621-5623f2ecb7b3.json');

// Autenticación con Google Sheets API
async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return await auth.getClient();
}

// Actualiza el contador de descargas para un lead específico
async function updateDownloadCount(sheetsApi, sheetId, range, values) {
  await sheetsApi.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: range,
    valueInputOption: 'RAW',
    resource: {
      values: values,
    },
  });
}

// Ruta para la descarga de datos y actualización del contador
router.get('/', async (req, res) => {
  try {
    const auth = await authenticate();
    const sheetsApi = google.sheets({ version: 'v4', auth });

    const sheetId = '1mdIfw-BIf0kEsGIl2YsMSnEW9sMGQ94Gq1h471dNXFM'; // ID de tu Google Sheets
    const range = 'SHEET_NAME!A1:Z100'; // Ajusta el rango según la necesidad

    const response = await sheetsApi.spreadsheets.values.get({ spreadsheetId: sheetId, range });
    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      res.status(404).send('No data found in the sheet');
    } else {
      // Incrementar el contador de descargas para cada fila de datos
      const headerRow = rows[0];
      const downloadCountIndex = headerRow.indexOf('DownloadCount');
      
      if (downloadCountIndex === -1) {
        // Si la columna DownloadCount no existe, añadirla
        headerRow.push('DownloadCount');
      }

      const updatedRows = rows.map((row, index) => {
        if (index === 0) return row; // Mantener la fila de encabezado sin cambios
        const currentCount = parseInt(row[downloadCountIndex] || '0', 10);
        row[downloadCountIndex] = currentCount + 1;
        return row;
      });

      // Actualizar la hoja de cálculo
      await updateDownloadCount(sheetsApi, sheetId, range, updatedRows);

      // Enviar los datos para la descarga
      const csvData = rows.map(row => row.join(',')).join('\n');
      res.json({ csvData, rows });
    }
  } catch (error) {
    console.error('Error in test route:', error);
    res.status(500).send(`Error accessing Google Sheets: ${error.message}`);
  }
});

module.exports = router;