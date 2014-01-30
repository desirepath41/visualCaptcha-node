visualCaptcha-node
==================

Node.js sample for visualCaptcha.


## Installation 

You need Node.js installed with npm.
```
npm install
```


## Run server

Run next command to start Node.js server on port 8282 (default):
```
npm start
```


## Run tests

Run next command to start mocha unit tests:
```
npm test
```


## API

### GET `/start/:howmany`

This route is for generation common data (image field name, image name, image values and audio field name) for visual captcha front-end.

Parameters:

- `howmany` is required, the number of images to generate.

### GET `/image/:index`

This route is for getting generated image file by index. 

Parameters:

- `index` is required, the index of the image you wish to get.

### GET `/audio/:type`

This route is for getting generated audio file.

Parameters:

- `type` is optional, the audio file format and defaults to `mp3`, but can also be `ogg`.

### POST `/try` 

It is a demo example of validating the visual captcha.