class EventBus {
  private events: { [key: string]: Function[] };

  constructor() {
    this.events = {};
  }

  public on = (eventType: any, listener: any) => {
    if (!this.events[eventType]) {
      this.events[eventType] = [];
    }
    this.events[eventType].push(listener);
  };

  emit(eventType: any, payload: Object) {
    if (this.events[eventType]) {
      this.events[eventType].forEach((listener) => listener(payload));
    }
  }
}

const eventBus = new EventBus();

export { eventBus };
