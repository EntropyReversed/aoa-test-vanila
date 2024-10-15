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
      this.subscribers.add(callback); // Add at the end if no specific order or order is out of bounds
    } else {
      const subscribersArray = [...this.subscribers]; // Convert Set to Array for manipulation
      subscribersArray.splice(order, 0, callback); // Insert the callback at the specific order
      this.subscribers = new Set(subscribersArray); // Re-create the Set with the new order
    }
  }

  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }
}