import {Bench} from 'tinybench';
import {getStringWidth} from '../dist/string-width.js';
import fastStringTruncatedWidth from 'fast-string-truncated-width';
import stringWidth from 'string-width';

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
      getStringWidth(suite.input);
    })
    .add('fast-string-truncated-width', () => {
      fastStringTruncatedWidth(suite.input, fastStringTruncatedWidthOptions, {}).width;
    })
    .add('string-width', () => {
      stringWidth(suite.input).width;
    });

  console.log('Benchmark:', suite.name);

  await bench.warmup();
  await bench.run();

  console.table(bench.table());
}
