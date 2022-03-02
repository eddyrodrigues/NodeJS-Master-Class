const { statSync } = require('fs');
const http = require('http');
const { parse } = require('path');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;


urlParser = (url) => {
    console.log();
}


const server = http.createServer((req, res)=>{
    // parsing url
    const parsedUrl = url.parse(req.url, true);
    const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

    console.log(trimmedPath);

    // Get request method
    const reqMethod = req.method.toLowerCase();

    // Parsed query strings
    const parsedQueryString = parsedUrl.query;

    const decoder = new StringDecoder('utf-8');
    var payload = '';

    req.on('data', (data) =>{
        payload += decoder.write(data);
    })

    req.on('end', () =>{
        
        payload += decoder.end();

        const data = {
            path:trimmedPath,
            'query-string': parsedQueryString,
            method: reqMethod,
            payload,
        };

        const route = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        route(data, (statusCode, payload) => {
            // res.writeHead(statusCode);
            res.statusCode = statusCode;
            res.writeHead(statusCode, {
                'Content-type': 'application/json',
                //'enconding': 'utf-8',
            });
            payload = JSON.stringify(payload);
            res.end(payload);
        });

        
    });
})







server.listen(3000, ()=>{
    console.log("listening on port 3000");
});


const handlers = {};

handlers.root = (data, callback) => {
    callback(200, {index: 'my index page in json object'});
};


handlers.notFound = (data, callback) => {
    callback(404, {message: 'not found - não encontrado'});
};



const router = {
    '/': handlers.root,
    '': handlers.root,
};


