const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 56617; // Port number to serve on
const BASE_DIR = path.join(__dirname); // Path to the noVNC directory

http.createServer((req, res) => {
    console.log(`Requested URL: ${req.url}`); // Log the requested URL for debugging

    // Resolve the requested file path
    let filePath = path.join(BASE_DIR, req.url === '/' ? 'vnc.html' : req.url);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
        return;
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';

    // Determine the correct content type
    switch (extname) {
        case '.js':
            contentType = 'application/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        default:
            contentType = 'text/html';
    }

    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err.message}`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}).listen(PORT, () => {
    console.log(`noVNC server running at http://localhost:${PORT}`);
});
