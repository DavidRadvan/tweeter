/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//escapes a string to prevent XSS attacks.
const escape = function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Creates a new tweet element from a JSON tweet object
const createTweetElement = function(tweet) {

  let timeNow = new Date();
  const timeAgo = new Date(tweet.created_at);
  let difference = timeNow - timeAgo;
  let daysAgo = Math.floor(difference / (1000 * 60 * 60 * 24));
  let hoursAgo = Math.floor(difference / (1000 * 60 * 60));
  let minutesAgo = Math.floor(difference / (1000 * 60));

  let dateData = daysAgo + " days ago";

  if (daysAgo === 1) {
    daysAgo + " day ago";
  }

  if (daysAgo < 1) {
    dateData = hoursAgo + " hours ago";
  }

  if (hoursAgo === 1) {
    dateData = hoursAgo + " hour ago";
  }

  if (hoursAgo < 1) {
    dateData = minutesAgo + " minutes ago";
  }

  if (minutesAgo === 1) {
    dateData = minutesAgo + " minute ago";
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
      ${escape(tweet.content.text)}
    </article>

    <footer class="dateIcons">
      <span>${dateData}</span>
      <span class="icons"><i class="fas fa-flag"></i><i class="fas fa-retweet"></i><i class="fas fa-heart"></i></span>
    </footer>
  </article>`);
  return $tweet;
};



// Renders tweets on to the main HTML page
const renderTweets = function(tweets) {
  for (let tweet of tweets) {
    let $tweet = createTweetElement(tweet);
    $('#tweets-container').append($tweet);
  }
};

// Fetches tweets from the server
const loadTweets = function() {
  let output = "";
  $.ajax('/tweets', { method: 'GET' })
    .then(renderTweets);
};

$(document).ready(function() {
  //adds a new tweet to the page.
  $('#newTweetSubmission').submit(function() {

    event.preventDefault();

    let errorMessage = $("#error")[0];

    let tweetContent = $("#tweet-text")[0].value;

    if (!tweetContent) {

      $(errorMessage).slideUp(400, function() {
        errorMessage.innerText = "❕ Error - Tweet is empty.";
        $(errorMessage).slideDown(400);
      });

    } else if (tweetContent.length > 140) {

      $(errorMessage).slideUp(400, function() {
        errorMessage.innerText = "❕ Error - Tweet is too long. Please reduce to 140 characters or less.";
        $(errorMessage).slideDown(400);
      });

    } else {

      $(errorMessage).slideUp(400);

      $.ajax('/tweets', {
        method: 'POST',
        data: $(this).serialize(),
        success: function(data) {
          loadTweets();
        }
      });

      // clears new tweet box after tweet is posted.
      $(this).children('#tweet-text')[0].value = "";
    }

  });

  loadTweets();

  //allows composer button to hide/show new tweet and auto-focus on it.
  let newTweet = $("#tweetHider")[0];

  $('.composer').click(function() {
    $(newTweet).slideToggle(400, function() {
      if ($(newTweet).is(':visible')) {
        $("#tweet-text").focus();
      } else {
        $("#tweet-text").blur();
      }
    });
  })
});
