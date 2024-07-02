import {Bench} from 'tinybench';
import {getStringWidth} from '../dist/string-width.js';
import fastStringTruncatedWidth from 'fast-string-truncated-width';

const fastStringTruncatedWidthOptions = {limit: Infinity, ellipsis: ''};

const suites = [
  {
    name: 'Basic ASCII',
    input: 'Hello'
  },
  {
    name: 'ANSI + ASCII',
    input: '\x1b[31mabc\x1b[31m'
  },
  {
    name: 'Emoji',
    input: '😀🤪🙂‍↔️🥶☝🏿☝🏿'
  },
  {
    name: 'Emoji+ASCII',
    input: '😀hello . 🤪🙂‍↔️🥶was☝🏿☝🏿'
  },
  {
    name: 'CJK',
    input: '古池や'
  }
];

for (const suite of suites) {
  const bench = new Bench();

  bench
    .add('picospinner getStringWidth()', () => {
      for (const suite of suites) {
        getStringWidth(suite.input);
      }
    })
    .add('fast-string-truncated-width', () => {
      for (const suite of suites) {
        fastStringTruncatedWidth(suite.input, fastStringTruncatedWidthOptions, {}).width;
      }
    });

  console.log('Benchmark:', suite.name);

  await bench.warmup();
  await bench.run();

  console.table(bench.table());
}
