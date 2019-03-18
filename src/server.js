const Gun = require('gun');
const http = require('http');
// const fs = require('fs');

const server = http.createServer((req, res) => {
  if (Gun.serve(req, res)) { return; } // filters gun requests!
  res.writeHead(200);
  res.end('this is a gun server');
}).listen(process.env.PORT || process.argv[2] || 8089);

const gun = Gun({ web: server });
gun.get('entries').map().on(function (node, key) {
  if (node) {
    console.log(`Received Key: ${key}. In ${node.in}`);
  }
});
