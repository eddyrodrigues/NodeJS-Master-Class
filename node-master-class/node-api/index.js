const { statSync } = require('fs');
const http = require('http');
const { parse } = require('path');
const url = require('url');
const { Users } = require('./models/People.js');
const StringDecoder = require('string_decoder').StringDecoder;
const modeled_db = require('./models/People.js');


urlParser = (url) => {
    console.log();
}


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
            'query-string': parsedQueryString,
            method: reqMethod,
            payload,
        };

        // route selecting, if exists, the routed wich you be called (not found as default one)
        const route = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // calling the route
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

handlers.getAllUsers = (data, callback) => {
    if (data.method === 'get')
        callback(200, modeled_db);
    else
        callbacl(403, {})
}

handlers.getUser = (data, callback) => {
    if (data.method === 'get'){
        userId = null;
        data.id = 1;
        if ( typeof(data.id !== 'undefined') ? userId = data.id: null )
        if (userId === null){
            callback(204, {});
            return;
        }

        for(let user of Users)
            if (userId === user.id) {
                callback(200, { user: user['user'] });
                return;
            }
    }  
    callback(400, {message : 'Wrong method - this method is not allowed'});
    return;
}


const router = {
    '/': handlers.root,
    '': handlers.root,
    'users': handlers.getAllUsers,
    'user/1': handlers.getUser,
};



