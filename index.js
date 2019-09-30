const http = require('http');
const time = require('moment');
require('dotenv').config();

const timestamp = time.utc().format('LLLL')

const server = http.createServer((req, res) => {
    if (req.url !== '/favicon.ico') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        const start = Date.now();
        const loger = setInterval(
            () => {
                console.log(timestamp)
                if (start + Number(process.env.TIMEOUT) <= Date.now()) {
                    clearInterval(loger)
                    return res.end(timestamp)
                }
            }, process.env.INTERVAL)
    }
});

server.listen(3000, () => {
	console.log('listen port 3000');
})