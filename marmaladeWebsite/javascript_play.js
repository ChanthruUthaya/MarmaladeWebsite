"use strict";
process.stdin.setEncoding('utf8');
process.stdin.on('data', receive);
function receive(text) {
  console.log("You typed", text);
}
