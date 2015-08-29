# node-opc-server
Open Pixel Control protocol parser

node-opc-server implements the Open Pixel Control protocol and drives ws281x RGB LEDs using the rpi-ws281x-native library.

## System overview

```
 PC or Rapsi running -> Network -> Raspi #18 -> 3.3V -> 5V -> NeoPixel
 grid8x8_dot.pde                                              8x8 array
```

- Drives one WS2812 LED strip up to 1024 LEDs but only tested up to 64 LEDs.

- Implements the Open Pixel Control protocol on TCP port 7890. This is the same
  protocol used by Fadecandy server (fcserver).

This is not a Fadecandy controller hardware clone.

- No dithering.
- No keyframe interpolation.
- Fixed gamma correction of 2.2
- SysEx ignored.

## Use it

```
npm install node-opc-server
cd node_modules/node-opc-server/opc-server
npm install
sudo node index.js
```

## Example programs to drive the LEDs

Many open pixel control and Fade Candy examples work with node-opc-server. If the example code is not running on the Raspi running opc-server, be sure to modify the examples with the Raspi IP address.

The following examples from https://github.com/zestyping/openpixelcontrol work.

    python\_clients/
        lava_lamp.py,miami.py,nyan_cat.py,sailor_moon.py,spatial_stripes.py

```
$ ./lava\_lamp.py -l grid8x8.json -s <Raspi IP addr>:7890 -f 30
```

The Fadecandy grid8x8 Processing examples at https://github.com/scanlime/fadecandy work with this program. These examples show how to create interactive LED displays. Edit the PDE file to add the Raspi IP address.

    examples/processing/
        grid8x8_dot, grid8x8_noise_sample, grid8x8_orbits, grid8x8_wavefronts

## References

The rpi-ws281x-native library is used to drive the WS281x LEDs. See https://www.npmjs.com/package/rpi-ws281x-native for more details.

See https://github.com/zestyping/openpixelcontrol for the OPC protocol specification.

The following Adafruit LED art tutorial covers wiring and powering the LEDs, etc. In addition, it covers installing and running Fadecandy example programs.

https://learn.adafruit.com/led-art-with-fadecandy/
