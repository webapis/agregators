export function createStore(reducer, initState = {}, storeName) {
  localStorage.setItem(storeName, JSON.stringify(initState));
  return {
    state: initState,
    events: {},
    subscribe: function(evName, fn) {
      console.log(`PUBSUB: someone just subscribed to know about ${evName}`);
      //add an event with a name as new or to existing list

      this.events[evName] = this.events[evName] || [];
      this.events[evName].push(fn);
    },
    _publish: function(evName) {
      console.log(
        `PUBSUB: Making an broadcast about ${evName} with ${this.state}`
      );
      //emit|publish|announce the event to anyone who is subscribed
      if (this.events[evName]) {
        this.events[evName].forEach(f => {
          f(this.state);
        });
        /*
          this.events[evName].forEach(f => {
          f(this.state);
        });
        */
      }
    },
    getState: function() {
      return this.state;
    },
    _setState: function(state) {
      this.state = state;
    },
    dispatch: function(action) {
      this._setState(reducer(this.state, action));
      let stateInlocalStorage = JSON.parse(localStorage.getItem(storeName));
      localStorage.setItem(
        storeName,
        JSON.stringify({ ...stateInlocalStorage, ...this.getState() })
      );
      this._publish(action.type);
    }
  };
}
