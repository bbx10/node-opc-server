/*
The MIT License (MIT)

Copyright (c) 2015 by bbx10node@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* jslint node: true */
'use strict';

// Parse Open Pixel Control protocol. See http://openpixelcontrol.org/.
var MAX_LEDS = 1024;
var parseState = 0;
var pktChannel, pktCommand, pktLength;
var pixels = new Buffer(MAX_LEDS*3);
var pixelCount = 0;
var pixelLimit = pixels.length;
var OPCDEBUG = false;

function min(x, y) {
  return ((x < y) ? x : y);
}

exports.parseOPC = function(data, callback) {
  var i = 0;
  while (i < data.length) {
    switch (parseState) {
      case 0: // Get pktChannel
        pktChannel = data[i];
        i++;
        parseState++;
        break;
      case 1:  // Get pktCommand
        pktCommand = data[i];
        i++;
        parseState++;
        break;
      case 2:  // Get pktLength.highbyte
        pktLength = data[i] << 8;
        i++;
        parseState++;
        break;
      case 3:  // Get pktLength.lowbyte
        pktLength |= data[i];
        i++;
        parseState++;
        pixelCount = 0;
        // Try not to overflow pixels[]
        pixelLimit = min(pixels.length, pktLength);
        if (OPCDEBUG) {
          console.log('pktChannel', pktChannel, 'pktCommand', pktCommand, 'pktLength', pktLength, 'pixelLimit', pixelLimit);
        }
        if (pktLength > pixels.length) {
          console.log('Received pixel packet exceeds size off buffer! Data discard!');
        }
        break;
      case 4:
        // Exact fit: data.length
        // Not enough to fill pixels: data.length
        // Too much: pixelLimit
        var copyBytes = min(pixelLimit - pixelCount, data.length - i);
        if (copyBytes > 0) {
          data.copy(pixels, pixelCount, i, i+copyBytes);
          pixelCount += copyBytes;
          i += copyBytes;
          if (OPCDEBUG) {
            console.log('pixelLimit', pixelLimit, 'pixelCount', pixelCount, 'copyBytes', copyBytes);
          }
          if (pixelCount >= pixelLimit) {
            if ((pktCommand === 0) && (pktChannel <= 1)) {
              // call callback which probably writes the pixels to the LEDs
              if (OPCDEBUG) {
                console.log(pixels.slice(0, pixelCount));
              }
              if (typeof callback == 'function') callback(pixels, pixelCount);
            }
            if (pktLength === pixelLimit) {
              parseState = 0;
            }
            else {
              parseState++;
            }
          }
        }
        else {
          i++;
        }
        if (OPCDEBUG) {
          console.log('i', i, 'parseState', parseState);
        }
        break;
      default:  // Discard data that does not fit in pixels buffer
        var discardBytes = min(pktLength - pixelLimit, data.length - i);
        if (OPCDEBUG) {
          console.log('discardBytes', discardBytes);
        }
        if (discardBytes > 0) {
          pixelCount += discardBytes;
          i += discardBytes;
          if (pktLength === pixelCount) {
            parseState = 0;
          }
        }
        if (OPCDEBUG) {
          console.log('i', i, 'parseState', parseState);
        }
        break;
    }
  }
}
