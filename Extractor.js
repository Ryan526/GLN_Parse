const express = require('express');
const app = express();
const fs = require('fs');
const mammoth = require('mammoth');
const multer = require('multer');
const textract = require('textract');
const xlsx = require('xlsx');

// Set up multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle the file upload and GLN extraction
app.post('/extract-glns', upload.single('file'), (req, res) => {
  const outputOption = req.body.outputOption;
  const filePath = req.file.path;
  const fileType = req.file.originalname.split('.').pop();

  let extractor;

  switch (fileType) {
    case 'docx':
      extractor = mammoth.extractRawText;
      break;
    case 'txt':
      extractor = (options) => {
        return new Promise((resolve, reject) => {
          textract.fromFileWithPath(options.path, (error, text) => {
            if (error) {
              reject(error);
            } else {
              resolve({ value: text });
            }
          });
        });
      };
      break;
    case 'xlsx':
      extractor = (options) => {
        const workbook = xlsx.readFile(options.path);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const text = xlsx.utils.sheet_to_csv(worksheet, { header: 1 });
        return Promise.resolve({ value: text });
      };
      break;
    default:
      res.status(400).send('Unsupported file type');
      return;
  }

  extractor({ path: filePath })
    .then(result => {
      const text = result.value;
      const regex = /\b\d{6}-\d{6}\b/g;
      let matches = text.match(regex);

      if (outputOption === 'sql') {
        matches = matches.map(match => `'${match}'`);
        const output = `LABELTEXT IN (${matches.join(', ')})`;
        res.send(output);
      } else {
        res.send(matches.join('\n'));
      }

      // Delete the uploaded file
      fs.unlinkSync(filePath);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error extracting GLNs');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
