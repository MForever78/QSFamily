/**
 * Created by MForever78 on 15/10/21.
 */

$(function() {
  var textarea = $('#write-content');
  if (textarea.length !== 0) {
    var editor = new Simditor({
      textarea: textarea
    });
  }

  function bindEvents() {
    /*
      Course
     */
    $('.course-tab').on('click', function(e) {
      e.preventDefault();
      var tab = $(e.currentTarget);
      tab.addClass("active");
      tab.siblings().removeClass("active");
      // active tab content
      var content = $(e.target.dataset.target);
      // remove in first to let animation work
      content.siblings().removeClass("in");
      setTimeout(function () {
        content.siblings().removeClass("active");
        content.addClass("active in");
      }, 200);
    }).first().find('a').click();

    $('a[data-action=edit]').on('click', function(e) {
      window.href = '/edit/course/' + e.target.dataset.id;
    });

    $('a[data-action=delete]').on('click', function() {
      // TODO: delete the course
    });

    $('a[data-action=new]').on('click', function() {
      window.href = '/write/course';
    });
  }
  // binding
  bindEvents();
});
