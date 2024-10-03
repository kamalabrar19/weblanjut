var http = require('http');

http.createServer(function(req, res) {  
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(`
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(45deg, #6a11cb, #2575fc);
            font-family: 'Arial', sans-serif;
          }
          .box {
            padding: 50px;
            background-color: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 20px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
            text-align: center;
            transition: transform 0.3s ease-in-out;
          }
          h1 {
            font-size: 4rem;
            color: #fff;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
            margin: 0;
          }
          .box:hover {
            transform: scale(1.05);
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Hello World</h1>
        </div>
      </body>
    </html>
  `); 
  res.end(); 
}).listen(8080);

console.log('Server running at http://localhost:8080/');
