# picospinner

<img src="https://raw.githubusercontent.com/PondWader/picospinner/main/assets/demo.gif" width="522" alt="Demo">

A lightweight, no dependency, pluggable CLI spinner library.

## Install

```
npm i picospinner
```

## Usage

### Basic

```js
import {Spinner} from 'picospinner';

const spinner = new Spinner('Loading...');
spinner.start();
setTimeout(() => {
  spinner.succeed('Finished.');
}, 5000);
```

### Custom symbols

```js
import {Spinner} from 'picospinner';

const spinner = new Spinner('Loading...', {
  symbols: {
    warn: '⚠'
  }
});
spinner.start();
setTimeout(() => {
  spinner.warn("Something didn't go quite right.");
}, 5000);
```

### Custom frames

```js
import {Spinner} from 'picospinner';

const spinner = new Spinner('Loading...', {
  frames: ['-', '\\', '|', '/']
});
spinner.start();
setTimeout(() => {
  spinner.info('Finished.');
}, 5000);
```

### Removing the spinner

Calling `spinner.stop();` will stop the spinner and remove it.

### Colours

Colours can be achieved by using a formatter such as picocolors or chalk. First install picocolors:

```
npm i picocolors
```

Text can be formatted by passing pre-formatted text:

```js
import {Spinner} from 'picospinner';
import pc from 'picocolors';

const spinner = new Spinner(pc.blue('Loading...'));
spinner.start();
setTimeout(() => spinner.setText(pc.magenta("Now it's magenta!")), 1000);
```

Symbols can be formatted by passing a symbol formatter.

```js
import {Spinner} from 'picospinner';
import pc from 'picocolors';

const spinner = new Spinner({
  text: pc.blue('Loading...'),
  symbolFormatter: pc.green
});
spinner.start();
spinner.fail({
  text: 'Disaster!',
  symbolFormatter: pc.red
});
```

### Custom rotation speed

A custom tick speed (how often the spinner rotates) in milliseconds can be passed to `spinner.start`:

```js
import {Spinner} from 'picospinner';

const spinner = new Spinner();
spinner.start(10);
```
