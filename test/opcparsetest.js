var opcparse = require('../opcparse.js');

// Pass one complete OPC frame
opcparse.parseOPC(new Buffer([1, 0, 0, 3*3, 1, 1, 1, 2, 2, 2, 3, 3, 3]), function(rgb, count) {
  if ((count === 9) && rgb.slice(0, count).equals(Buffer([1, 1, 1, 2, 2, 2, 3, 3, 3]))) {
    console.log('Pass 1');
  }
  else {
    console.log('Fail 1');
  }
});

// Pass the same frame one byte at a time
opcparse.parseOPC(new Buffer([1]));
opcparse.parseOPC(new Buffer([0]));
opcparse.parseOPC(new Buffer([0]));
opcparse.parseOPC(new Buffer([3*3]));
opcparse.parseOPC(new Buffer([1]));
opcparse.parseOPC(new Buffer([1]));
opcparse.parseOPC(new Buffer([1]));
opcparse.parseOPC(new Buffer([2]));
opcparse.parseOPC(new Buffer([2]));
opcparse.parseOPC(new Buffer([2]));
opcparse.parseOPC(new Buffer([3]));
opcparse.parseOPC(new Buffer([3]));
opcparse.parseOPC(new Buffer([3]), function(rgb, count) {
  if ((count === 9) && rgb.slice(0, count).equals(Buffer([1, 1, 1, 2, 2, 2, 3, 3, 3]))) {
    console.log('Pass 2');
  }
  else {
    console.log('Fail 2');
  }
});

// Allocate and init big buffer that holds 1024 pixels. Each pixel consists of 3
// bytes.
var BigBuffer = new Buffer((3*1024)+1);
for (var i = 0; i < 3073; i++) {
  BigBuffer[i] = i & 0xff;
}

// Pass maximum size frame
opcparse.parseOPC(new Buffer([1, 0, 0x0C, 0x00]));
opcparse.parseOPC(BigBuffer.slice(0, 1024*3), function(rgb, count) {
  if ((count === BigBuffer.length-1) && rgb.slice(0, count).equals(BigBuffer.slice(0, 1024*3))) {
    console.log('Pass 3');
  }
  else {
    console.log('Fail 3');
  }
});

// Pass maximu size + 1 frame
opcparse.parseOPC(new Buffer([1, 0, 0x0C, 0x01]));
opcparse.parseOPC(BigBuffer, function(rgb, count) {
  if ((count === BigBuffer.length-1) && rgb.slice(0, count).equals(BigBuffer.slice(0, 1024*3))) {
    console.log('Pass 4');
  }
  else {
    console.log('Fail 4');
  }
});
