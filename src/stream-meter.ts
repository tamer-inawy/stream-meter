import { PassThrough } from 'stream';
import { EventEmitter } from 'events';

export function getStreamMeter(
  size: number,
  showBar = true,
) {
  const watch = new PassThrough();
  const progress = new EventEmitter();


  let done = 0;
  watch.on('data', chunk => {
    done += chunk.length;
    const perc = done / size * 100;
    progress.emit<number>('data', +(perc.toFixed(2)));

    if (showBar) drawBar(Math.round(perc));
  });

  watch.once('finish', () => {
    if (showBar) drawBar(100, true);

    progress.emit('data', 100);
  });


  return { watch, progress };
}

function drawBar(percentage: number, isFinised: boolean = false) {
  const margen = 15;
  const width = process.stdout.columns - margen;
  let length = Math.min(width, 100);
  const step = Math.ceil(100 / length);

  let output = `${percentage}% `;
  for (let i = 0; i <= 100; i += step) output += (i <= percentage ? String.fromCharCode(9617) : '-'); // ░

  hideCursor();
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(output);
  if (isFinised) {
    process.stdout.write(' Done!\n');
    showCursor();
  }
}

/**
 * Hide the cursor
 */
function hideCursor() {
  process.stdout.write('\u001B[?25l');
}

/**
 * Show the cursor
 */
function showCursor() {
  process.stdout.write('\u001B[?25h');
}
