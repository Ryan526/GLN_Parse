# GLN Extractor

GLN Extractor is a simple tool built with Node.js and Express, using `mammoth.js`, `multer`, `textract`, and `xlsx` to extract Global Location Numbers (GLNs) from `.docx`, `.txt`, and `.xlsx` files.

The tool provides a user-friendly interface for uploading files and choosing output options, allowing users to extract GLNs and output them either as an SQL script or a plain list.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [File Overview](#file-overview)

## Installation

You'll need to have [Node.js](https://nodejs.org/) installed on your machine to run this application.

To install the application, first clone this repository:

git clone https://github.com/Ryan526/GLN_Parse.git

Next, navigate to the project's root directory and install the necessary dependencies:

cd yourrepository
npm install


## Usage

To start the server, run the following command:
npm start


Then, open your web browser and navigate to `http://localhost:80` to start using the GLN Extractor.

## Dependencies

This project depends on the following npm packages:

- `express` for creating the server and routing
- `multer` for handling file uploads
- `mammoth` for extracting text from `.docx` files
- `textract` for extracting text from `.txt` files
- `xlsx` for reading `.xlsx` files
- `fs` (built into Node.js) for file system operations

## File Overview

- `Extractor.js`: This is the main server file. It sets up the server, handles routing and file uploads, extracts GLNs from the uploaded files, and sends the extracted GLNs back to the client.

- `Index.html`: This is the client-side HTML file. It includes a form for file upload and output option selection, a div for displaying the results, and scripts for handling form submissions and displaying the results.

