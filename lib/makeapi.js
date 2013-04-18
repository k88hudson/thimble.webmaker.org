module.exports = function() {
  var MakeAPI = require('makeapi'),
      make;

  // FOLLOW-UP: this should be turned into an env variable.
  make = MakeAPI({
    makeAPI: "http://localhost:6001"
  });
/*
    var projects = [],
        id;

    makeAPI.all.withTags( ["thimble"] ).withAuthor( req.session.email ).then( function( data ) {
      data.hits.forEach(function(result) {
        id = result._id;
        projects.push(result.title + "<a href='/"+result.url+"'>view</a><a href='/"+result.url+"/edit'>edit</a>");
      });
      res.render('gallery.html', {title: 'User Projects', projects: projects});
    });
*/

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
        // results[0].url === data.withUrl is temporary.
        for (var i = 0; i < results.length; i++) {
          if ( results[i].url === data.withUrl ) {
            urlMatch = i;
            break;
          }
        }
        newData.author = data.withAuthor;
        newData.url = data.withUrl;
        newData.tags = data.withTags;
        // A matching make was returned, so we can update it.
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
