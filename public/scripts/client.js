/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const data = [{
  "user": {
    "name": "Newton",
    "avatars": "https://i.imgur.com/73hZDYK.png",
    "handle": "@SirIsaac"
  },
  "content": {
    "text": "If I have seen further it is by standing on the shoulders of giants"
  },
  "created_at": 1461116232227
}, {
  "user": {
    "name": "Descartes",
    "avatars": "https://i.imgur.com/nlhLi3I.png",
    "handle": "@rd"
  },
  "content": {
    "text": "Je pense , donc je suis"
  },
  "created_at": 1461113959088
}];

$('#newTweetSubmission').submit(function() {
  event.preventDefault();
  $.ajax('/tweets', {
      method: 'POST',
      data: $(this).serialize(),
      success: function(data) {
        console.log("Success: ", this.data);
      }
    });

    // clears new tweet box after tweet is posted.
    $(this).children('#tweet-text')[0].value = "";
});


const createTweetElement = function(tweet) {

  let timeNow = new Date();
  const timeAgo = new Date(tweet.created_at);
  let difference = timeNow - timeAgo;
  let daysAgo = Math.floor(difference / (1000 * 60 * 60 * 24));
  let hoursAgo = Math.floor(difference / (1000 * 60 * 60));
  let minutesAgo = Math.floor(difference / (1000 * 60));

  let dateData = daysAgo + " Days ago";

  if (daysAgo < 1) {
    dateData = hoursAgo + " Hours ago";
  }

  if (hoursAgo < 1) {
    dateData = minutesAgo + " Minutes ago";
  }

  if (minutesAgo < 1) {
    dateData = "Posted just now!";
  }

  const $tweet = $(`<article class="tweetBox">
    <header>
      <div class="profileTweetHeader">
        <img src=${tweet.user.avatars}>
        <span>${tweet.user.name}</span>
      </div>

      <span class="handle">${tweet.user.handle}</span>
    </header>
    <article>
      ${tweet.content.text}
    </article>

    <footer class="dateIcons">
      <span>${dateData}</span>
      <span>icons go here</span>
    </footer>
  </article>`);
  return $tweet;
};

const renderTweets = function(tweets) {
  for (let tweet of tweets) {
    let $tweet = createTweetElement(tweet);
    $('#tweets-container').append($tweet);
  }
};

renderTweets(data);
