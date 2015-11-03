/**
 * Created by MForever78 on 15/10/21.
 */

$(function() {
  /*
    Write
   */
  var textarea = $('#write-content');
  if (textarea.length !== 0) {
    var editor = new Simditor({
      textarea: textarea
    });
  }

  $('#write-form').on('submit', function(e) {
  });

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

  /*
    Assignment
   */
  var assignmentWrap = $('#assignment-wrap');
  assignmentWrap.find('a[data-action=toggle]').on('click', function(e) {
    e.preventDefault();
    var $target = $(this.dataset.target);
    $target.parents('.panel-group').find('.in').removeClass('in');
    $target.addClass('in');
  }).first().click();

  assignmentWrap.find('.btn[data-action=add]').on('click', function() {
    $(this).parent().children('.form').toggleClass('is-hidden');
  });

  assignmentWrap.find('.btn[data-action=delete]').on('click', function() {
    $.ajax('/assignment', {
      method: 'DELETE',
      data: {
        id: this.dataset.target
      },
      success: function(data) {
        console.log(data);
        location.reload();
      }
    });
  });

  /*
    Navigator
   */
  var location = window.location.pathname.split('/')[1];
  // keep index as default
  if (location) {
    $('#nav-index').removeClass('is-active');
    $('#nav-' + location).addClass('is-active');
  }

  /*
    Course management
   */
  var courseId = $('#workspace-wrap')[0].dataset.courseId;
  $('.workspace-nav').on('click', function(e) {
    e.preventDefault();
    $('#workspace-wrap').children('.is-active').removeClass('is-active');
    $('#' + e.target.dataset.target + '-wrap').addClass('is-active');
  }).find('a').first().click();

  var studentWrap = $('#student-wrap');

  studentWrap.find('.btn[data-action=add]').on('click', function() {
    $('#add-form').children('.form').toggleClass('is-hidden');
  });

  studentWrap.find('.btn[data-action=bulk]').on('click', function() {
    $('#bulk-form').children('.form').toggleClass('is-hidden');
  });

  studentWrap.find('a[data-action=delete]').on('click', function() {
    $.ajax('student', {
      method: 'DELETE',
      data: {
        course: courseId,
        student: this.dataset.target
      },
      success: function(data) {
        console.log(data);
        location.reload();
      }
    });
  });

});
