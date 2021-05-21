type ClockCallback = (clock: Clock) => void;

class Clock {
  private readonly callback: ClockCallback;
  private readonly delay: number;
  private readonly onStart: boolean;
  private clock: number;
  private interval?: NodeJS.Timeout;

  constructor(callback: ClockCallback, seconds: number, onStart: boolean = false) {
    this.callback = callback;
    this.delay = seconds;
    this.onStart = onStart;
  }

  start(): void {
    this.clock = this.delay;

    if (this.onStart) {
      this.callback(this);
    }

    this.interval = setInterval(() => {
      this.clock--;
      if (0 === this.clock) {
        this.callback(this);
        this.clock = this.delay;
      }
    }, 1000);
  }

  stop(): void {
    clearInterval(this.interval);
  }

  setNextExecutionIn(seconds: number): void {
    this.clock = seconds;
  }
}

export default Clock;
