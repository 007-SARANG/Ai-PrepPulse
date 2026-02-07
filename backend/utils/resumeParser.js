const pdf = require('pdf-parse');

async function extractResumeText(file) {
  try {
    if (!file) {
      return '';
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'pdf') {
      const dataBuffer = file.data;
      const pdfData = await pdf(dataBuffer);
      return pdfData.text;
    } else if (fileExtension === 'txt') {
      return file.data.toString('utf-8');
    } else {
      throw new Error('Unsupported file format. Please upload PDF or TXT file.');
    }
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw new Error('Failed to parse resume: ' + error.message);
  }
}

module.exports = { extractResumeText };
