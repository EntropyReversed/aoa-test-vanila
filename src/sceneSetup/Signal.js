export class Signal {
  subscribers = new Set();

  constructor(value) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  setValue(newValue) {
    this.value = newValue;
    this.emit();
  }

  emit() {
    this.subscribers.forEach((subscriber) => subscriber(this.value));
  }

  subscribe(callback, order = null) {
    if (order === null) {
      this.subscribers.add(callback);
      return;
    }

    this.subscribers = new Set([...this.subscribers].toSpliced(order, 0, callback));

    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }
}