class Dispatcher {
  constructor() {
    this.subscribers = {};
    this.currentSubscriberId = 0;
  }

  validateEventName(eventName) {
    if (typeof eventName !== 'string' || !eventName.length) {
      throw new TypeError(`Invalid event name "${eventName}"`);
    }
    return true;
  }

  subscribe(eventName, callback) {
    this.validateEventName(eventName);

    this.currentSubscriberId+= 1;
    const subscriberId = this.currentSubscriberId;

    this.subscribers[eventName] = this.subscribers[eventName] || {};
    this.subscribers[eventName][subscriberId] = callback;

    return this.unsubscribe.bind(this, eventName, subscriberId);
  }

  unsubscribe(eventName, subscriberId) {
    if (!this.subscribers[eventName]) {
      return false;
    }
    if (!this.subscribers[eventName][subscriberId]) {
      return false;
    }

    delete this.subscribers[eventName][subscriberId];
    return true;
  }

  publish(eventName, ...args) {
    this.validateEventName(eventName);
    
    if (this.subscribers[eventName]) {
      for (const subscriberId in this.subscribers[eventName]) {
        this.subscribers[eventName][subscriberId](...args);
      }
      return true;
    }
    return false;
  }
}

// Static action names. This could be replaced with "static"
// keyword syntax if you're using Babel.
Dispatcher.prototype.ACTION_NEW_FRIEND_DATA = 'newFriendsList';
Dispatcher.prototype.ACTION_FRIEND_CATCH_UP = 'catchUp';
