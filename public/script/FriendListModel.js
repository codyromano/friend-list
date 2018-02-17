(function(exports) {

  async function updateFriendCatchUpTime(friendId) {
    const url = `/friend/${friendId}/lastCatchUpTime`;
    const request = new Request(url, { method: 'PUT' });

    try {
      const result = await fetch(request)
        .then((response) => response.json());
      return result;

    } catch (err) {
      return Promise.reject('Error contacting friend list API');
    }
  }

  // TODO: Move to utils
  const sortObjectArrayByProperty = (array, property) => {
    return array.sort((itemA, itemB) => {
      if (itemA[property] === itemB[property]) {
        return 0;
      }
      return itemA[property] < itemB[property] ? -1 : 1;
    });
  };

  class FriendListModel {
    constructor(dispatcher, limit = 3) {
      this.limit = limit;
      this.dispatcher = dispatcher;
      this.onFriendCatchUp = this.onFriendCatchUp.bind(this);

      this.publishFriendList();

      this.dispatcher.subscribe(
        Dispatcher.prototype.ACTION_FRIEND_CATCH_UP,
        this.onFriendCatchUp
      );
    }
    publishFriendList() {
      this.getFriendList().then((friends) => {
        this.dispatcher.publish(
          Dispatcher.prototype.ACTION_NEW_FRIEND_DATA,
          friends
        );
      });
    }
    onFriendCatchUp(id) {
      updateFriendCatchUpTime(id).then(() => {
        this.publishFriendList();
      });
    }
    getFriendList() {
      return fetch('/friend-list')
        .then(response => response.json())
        .then(({ data }) => {
          return Promise.resolve(
            sortObjectArrayByProperty(data, 'lastCatchUpTime').slice(0, this.limit)
          );
        });
    }
  }

  exports.FriendListModel = FriendListModel;
})(window);
