$(document).ready(function() {
  $("#tweet-text").on('input', function() {
    let textLength = 140 - this.value.length;

    let counter = $(this).parent().find(".counter")[0]
    
    counter.innerHTML = textLength;

    if (textLength < 0) {
      $(counter).addClass("overLength");
    } else {
      $(counter).removeClass("overLength");
    }

  })
});
