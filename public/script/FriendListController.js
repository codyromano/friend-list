class FriendListController {
  constructor(domRoot, dispatcher) {
    this.dispatcher = dispatcher;
    this.root = domRoot;
    this.onCatchUpClicked = this.onCatchUpClicked.bind(this);
    this.root.addEventListener('click', (event) => {
      if (event.target.classList.contains('catch-up')) {
        this.onCatchUpClicked(event);
      }
    });
  }
  onCatchUpClicked(event) {
    const id = parseInt(event.target.dataset.friendId);

    if (!isNaN(id) && typeof id === 'number' && id > 0) {
      this.dispatcher.publish(
        Dispatcher.prototype.ACTION_FRIEND_CATCH_UP,
        id
      );
    } else {
      throw new TypeError('Invalid friend id');
    }
  }
}
