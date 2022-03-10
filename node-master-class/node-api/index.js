const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');



const server = http.createServer((req, res)=>{
    // parsing url
    const parsedUrl = url.parse(req.url, true);

    // path that was trimmed and read to me worked on
    const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

    // Get request method
    const reqMethod = req.method.toLowerCase();

    // Parsed query strings
    const parsedQueryString = parsedUrl.query;

    // StringDecoder wich is responsible to receive the data
    const decoder = new StringDecoder('utf-8');

    // payload received
    var payload = '';

    // while we have data been received, loads on payload
    req.on('data', (data) =>{
        payload += decoder.write(data);
    })

    req.on('end', () =>{
        // payload end
        payload += decoder.end();
      
        // mounting the trimmed path
        const data = {
            path:trimmedPath,
            'queryObject': parsedQueryString,
            method: reqMethod,
            payload,
            headers: req.headers,
        };


        
        // route selecting, if exists, the routed wich you be called (not found as default one)
        const route = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // calling the route
        route(data, (statusCode, payload) => {
            // res.writeHead(statusCode);
            res.statusCode = statusCode;
            res.setHeader("Content-Type", "application/json");
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

const router = {
    '/': handlers.root,
    '': handlers.root,
    'users': handlers.getAllUsers,
    'user': handlers.users,
    'create-user': handlers.postUser,
    'tokens': handlers.tokens
};




