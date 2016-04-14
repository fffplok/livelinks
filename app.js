function LiveLinks(fbname) {

  var firebase = new Firebase("https://" + fbname + ".firebaseio.com/");
  this.firebase = firebase;
  var linksRef = firebase.child('links');

  this.submitLink = function(url, title) {
    //console.log('submitLink, url, title:', url, title);
    url = url.substring(0,4) !== "http" ? "http://" + url : url;
    //btoa: create a base-64 encoded ASCII string from a String object
    linksRef.child(btoa(url)).set({
      title: title,
      url: url //property was missing
    });
  };

  this.onLinksChanged = function() {};

  linksRef.on('value', function(snapshot) {
    var links = snapshot.val();
    console.log('links: ', links);
    var preparedLinks = [];
    //nutter's for (var url in links) is misleading and does NOT work.
    for (var key in links) {
      console.log('key, links, links[key]: ', key, links, links[key]);
      //if (links.hasOwnProperty(url)) {
      //if (links.hasOwnProperty(key)) { //why do this? we already have the property key of links
        preparedLinks.push({
          title: links[key].title,
          //url: atob(url)
          url: atob(links[key].url) //nutter didn't actually add the link
        })
      //}
    }
    this.onLinksChanged(preparedLinks);
  }.bind(this));

};


$(document).ready(function() {

  //var ll = new LiveLinks('livelinks1234');
  var ll = new LiveLinks('boiling-fire-2657');

	$(".link-form form").submit(function(event) {
    event.preventDefault();
    ll.submitLink($(this).find('input.link-url').val(), $(this).find('input.link-title').val());
    $(this).find("input[type=text]").val("").blur();
    return false;
  });

  ll.onLinksChanged = function(links) {
    $(".links-list").empty();
    links.map(function(link) {
      var linkElement = "<li><a href='" + link.url + "'>" + link.title + "</a></li>";
      $(".links-list").append(linkElement);
    });
  };

});






