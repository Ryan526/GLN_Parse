const express = require('express');
const app = express();
const fs = require('fs');
const mammoth = require('mammoth');
const multer = require('multer');

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

  mammoth.extractRawText({ path: filePath })
    .then(result => {
      const text = result.value;
      const regex = /(?<!GLN: )\b\d{6}-\d{6}\b/g;
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
