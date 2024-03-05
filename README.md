# @inawy/stream-meter

A utility to monitor the stream progress.

### Install

```
npm i --save @inawy/stream-meter
```

### Usage example

```ts
/**
 * An example to demonstrate the stream-meter usage!
 */
import fs from 'fs';
import { createGzip } from 'zlib';
import { pipeline } from 'stream';
import { createServer } from 'net';

import { getStreamMeter } from '@inawy/stream-meter';

const file = '<path/to/file>';

const { watch, progress } = getStreamMeter(
  fs.statSync(file).size, // total file size
  true // show progress bar in terminal - default = true
);

pipeline(
  fs.createReadStream(file),
  createGzip(),
  // Adding the stream-meter stream to the pipline to watch its progress
  watch,
  fs.createWriteStream(file + '.gz'),
  error => {
    if (error) console.error(error);
  }
);

createServer(socket => {
  // Listening to the data event from the stream-meter progress event emitter
  progress.on('data', data => {
    socket.write(data.toString());
    if (data === 100) progress.removeAllListeners();
  });
})
  .listen(3000)
  .on('error', error => {});
```
