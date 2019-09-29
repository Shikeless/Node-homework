const http = require('http');
const time = require('moment');
require('dotenv').config();

const timestamp = time.utc().format('LLLL')

const server = http.createServer((req, res) => {
    if (req.url !== '/favicon.ico') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        const loger = setInterval(() => {console.log(timestamp)}, process.env.INTERVAL)
        setTimeout(
            () => { 
                clearInterval(loger);
                res.end(timestamp)
            }, process.env.TIMEOUT);
    }
});

server.listen(3000, () => {
	console.log('listen port 3000');
})