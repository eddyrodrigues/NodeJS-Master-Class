const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./lib/handlers');

_myport = 3001;

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
        // let route = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        let route = '';
        if (trimmedPath.indexOf('public/') > - 1) {
          route = router['public'];
        } else {
          route = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        }
        
        

        // calling the route
        route(data, (statusCode, payload, contentType) => {
            // res.writeHead(statusCode);
            console.log(new Date().toISOString(), _myport);
            contentType = typeof(contentType) == 'string' && contentType.length > 0 ? contentType : 'json';
            res.statusCode = statusCode;
            if (contentType == 'json') {
              payload = JSON.stringify(payload);
              res.setHeader("Content-Type", 'application/json');
            } else if (contentType == 'html') {
              res.setHeader("Content-Type", "text/html");
            } else if (contentType == 'js') {
              res.setHeader("Content-Type", "text/plain");
            } else if (contentType == 'png') {
              res.setHeader("Content-Type", "application/png");
            }else if (contentType == 'jpeg') {
              res.setHeader("Content-Type", "image/jpeg");
            }else if (contentType == 'jpg') {
              res.setHeader("Content-Type", "file/jpeg");
            }else if (contentType == 'json') {
              res.setHeader("Content-Type", "file/json");
            }else if (contentType == 'html') {
              res.setHeader("Content-Type", "text/html");
            } else if (contentType == 'css') {
              res.setHeader('Content-Type', 'text/css');
            }
            // else if (contentType == 'js') {
            //   res.setHeader("Content-Type", "application/javascript");
            // }else if (contentType == 'js') {
            //   res.setHeader("Content-Type", "application/javascript");
            // }else if (contentType == 'js') {
            //   res.setHeader("Content-Type", "application/javascript");
            // }else if (contentType == 'js') {
            //   res.setHeader("Content-Type", "application/javascript");
            // }else if (contentType == 'js') {
            //   res.setHeader("Content-Type", "application/javascript");
            // }else if (contentType == 'js') {
            //   res.setHeader("Content-Type", "application/javascript");
            // }

            res.end(payload);
        });
    });
})

server.listen(_myport, ()=>{
    console.log("listening on port " + _myport);
});




const router = {
    '': handlers.index,
    'login':handlers.login,
    'logout': handlers.logout,
    'my-profile': handlers.user_profile,
    'api/user': handlers.users,
    'api/create-user': handlers.postUser,
    'api/tokens': handlers.tokens,
    'public' : handlers.public
};
