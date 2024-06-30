import * as constants from './constants';

export type Formatter = (input: string) => string;

export type DisplayOptions = {
  symbolFormatter?: Formatter;
  text?: string;
  symbol?: string;
};

export type Symbols = {
  succeed: string;
  fail: string;
  warn: string;
  info: string;
};

export class Spinner {
  public running = false;

  private text: string = '';
  private currentSymbol: string;
  private symbolFormatter?: Formatter;
  private interval?: NodeJS.Timeout;
  private frameIndex = 0;
  private symbols: Symbols;
  private frames: string[];
  private terminalSize?: [number, number];
  private lastLinesAmt = 0;
  private linesInText = 0;

  constructor(
    display: DisplayOptions | string = '',
    {frames = constants.DEFAULT_FRAMES, symbols = {} as Partial<Symbols>} = {}
  ) {
    // Merge symbols with defaults
    this.symbols = {...constants.DEFAULT_SYMBOLS, ...symbols};

    if (typeof display === 'string') display = {text: display};
    delete display.symbol;
    this.setDisplay(display, false);

    this.frames = frames;
    this.currentSymbol = frames[0];
  }

  start(tickMs = constants.DEFAULT_TICK_MS) {
    this.interval = setInterval(this.tick.bind(this), tickMs);
    this.running = true;
    this.terminalSize = process.stdout.getWindowSize
      ? process.stdout.getWindowSize()
      : undefined;
  }

  tick() {
    this.currentSymbol = this.frames[this.frameIndex++];
    if (this.frameIndex === this.frames.length) this.frameIndex = 0;
    this.render();
  }

  private clearMultiLineOutput() {
    for (let i = 0; i < this.lastLinesAmt - 1; i++) {
      process.stdout.write(constants.CLEAR_LINE + constants.UP_LINE);
    }
  }

  render() {
    let symbol = this.currentSymbol;
    if (this.symbolFormatter) symbol = this.symbolFormatter(symbol);

    this.clearMultiLineOutput();

    const output = (symbol ? symbol + ' ' : '') + this.text;
    if (this.terminalSize)
      this.lastLinesAmt =
        Math.ceil(output.length / this.terminalSize[0]) + this.linesInText - 1;
    else this.lastLinesAmt = 0;

    process.stdout.write(constants.CLEAR_LINE + constants.HIDE_CURSOR + output);
  }

  setDisplay(displayOpts: DisplayOptions = {}, render = true) {
    if (typeof displayOpts.symbol === 'string')
      this.currentSymbol = displayOpts.symbol;
    if (typeof displayOpts.text === 'string') {
      this.text = displayOpts.text;
      this.linesInText = countLines(this.text);
    }
    if (displayOpts.symbolFormatter)
      this.symbolFormatter = displayOpts.symbolFormatter;

    if (render) this.render();
    if (typeof displayOpts.symbol === 'string') this.end();
  }

  setText(text: string) {
    this.text = text;
    this.linesInText = countLines(text);
    if (this.running) this.render();
  }

  succeed(display?: DisplayOptions | string) {
    if (typeof display === 'string')
      this.setDisplay({text: display, symbol: this.symbols.succeed});
    else this.setDisplay({...display, symbol: this.symbols.succeed});
  }

  fail(display?: DisplayOptions | string) {
    if (typeof display === 'string')
      this.setDisplay({text: display, symbol: this.symbols.fail});
    else this.setDisplay({...display, symbol: this.symbols.fail});
  }

  warn(display?: DisplayOptions | string) {
    if (typeof display === 'string')
      this.setDisplay({text: display, symbol: this.symbols.warn});
    else this.setDisplay({...display, symbol: this.symbols.warn});
  }

  info(display?: DisplayOptions | string) {
    if (typeof display === 'string')
      this.setDisplay({text: display, symbol: this.symbols.info});
    else this.setDisplay({...display, symbol: this.symbols.info});
  }

  stop() {
    this.clearMultiLineOutput();
    process.stdout.write(constants.CLEAR_LINE);
    this.end(false);
  }

  private end(newLine = true) {
    clearInterval(this.interval);
    process.stdout.write(constants.SHOW_CURSOR + (newLine ? '\n' : ''));
    this.running = false;
  }
}

function countLines(str: string) {
  return (str.match(/\n/g)?.length ?? 0) + 1;
}
