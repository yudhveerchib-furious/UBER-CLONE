import http from 'http';
import app, { PORT } from './app.js';

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});