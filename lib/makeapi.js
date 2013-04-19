module.exports = function(makeEndpoint) {
  var MakeAPI = require('makeapi'),
      make;

  make = MakeAPI({
    makeAPI: makeEndpoint
  });

  /**
   * db function object that we return
   */
  var makeAPI = {

    /**
     * Create a make if no duplicates exist under this user,
     * otherwise update the duplicate.
     */
    publish: function(data, callback) {
      makeAPI.search(data, function(results) {
        var newData = {},
            urlMatch = -1;

        for (var i = 0; i < results.length; i++) {
          if ( results[i].url === data.withUrl ) {
            urlMatch = i;
            break;
          }
        }
        newData = {
          author: data.withAuthor,
          url: data.withUrl,
          tags: data.withTags
        };
        if(results.length && urlMatch > -1) {
          make.update(results[urlMatch]._id, newData, callback);
        // Nothing was returned, so we need to make one.
        } else {
          make.create(newData, callback);
        }
      });
    },

    /**
     * Find makes by search criteria.
     */
    search: function(data, callback) {
      // https://bugzilla.mozilla.org/show_bug.cgi?id=863411
      // The above ticket may change the way we search.
      var next = make.all;
      for(var prop in data) {
        next = next[prop](data[prop]);
      }
      next.then(function(data) {
        callback(data.hits);
      });
    },

    /**
     * Remove a make by id.
     */
    remove: function(id, callback) {
      make.remove(id, callback);
    }
  };

  // return api object
  return makeAPI;
};
