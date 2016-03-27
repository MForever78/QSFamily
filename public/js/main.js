/**
 * Created by MForever78 on 15/10/21.
 */

var QSFamily = {
  common: function() {
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
      Message
     */
    $('.message').children('.message-icon').on('click', function() {
      $(this).parent().addClass('is-hidden');
    });
  }, 

  writeWrap: function() {
    var textarea = $('#write-content');
    if (textarea.length !== 0) {
      var editor = new Simditor({
        textarea: textarea,
        toolbar: [
          'title',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'color',
          '|',
          'ol',
          'ul',
          'blockquote',
          'code',
          'table',
          '|',
          'link',
          //'image',
          'hr',
          '|',
          'indent',
          'outdent',
          'alignment'
        ]
      });
    }

    $('#write-form').on('submit', function(e) {
    });
  },

  courseListWrap: function() {
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
      location.href = '/edit/course/' + e.target.dataset.id;
    });

    $('a[data-action=delete]').on('click', function() {
      // TODO: delete the course
    });

    $('a[data-action=new]').on('click', function() {
      location.href = '/write/course';
    });
  },

  assignmentWrap: function() {
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
          window.location.reload();
        }
      });
    });

    assignmentWrap.find('.assignment-upload').submit(function(e) {
      e.preventDefault();
      $(this).find('button').prop('disabled', true).addClass('loading');
      var formData = new FormData(this);
      $.ajax('/assignment/upload', {
        method: 'POST',
        processData: false,
        cache: false,
        contentType: false,
        data: formData,
        success: function() {
          window.location.reload();
        }
      })
    });
  },

  workspaceWrap: function() {
    var courseId = $('#workspace-wrap')[0].dataset.courseId;
    $('.workspace-nav a').on('click', function(e) {
      e.preventDefault();
      $('#workspace-wrap').children('.is-active').removeClass('is-active');
      $('#' + e.target.dataset.target + '-wrap').addClass('is-active');
    }).first().click();
  },

  workspaceContentWrap: function() {
    // handle the item menu
    $('.workspace-item li').on('click', function(e) {
      e.stopPropagation();
      // TODO: replace "if" to a more generic method
      if (this.dataset.action === "close") {
        $.ajax({
          url: '/course/close/' + this.dataset.target,
          method: 'POST',
          success: function(data) {
            console.log(data);
            window.location.reload();
          }
        });
      }
    });

    $('.workspace-item').on('click', function(e) {
      location.href = this.dataset.target;
    });
  },

  studentWrap: function() {
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
          window.location.reload();
        }
      });
    });
  },

  assignmentCorrection: function() {
    var correctionWrap = $('#correction-wrap');
    correctionWrap.find('li[data-action=correct]').on('click', function() {
      $(this).addClass('active').siblings().removeClass('active');
    });
  }
};

$(function() {
  /*
   * QSFamily is the global namespace
   * 
   * The script needed by all the pages is in the "common" method
   * Other method is id-identified
   * 
   * For example:
   * #assignment-wrap will trigger the "assignmentWrap" method
   */
  QSFamily.common();
  $('[id]').each(function() {
    var id = this.id.replace(/-([a-z])/g, function(w) { return w[1].toUpperCase(); });
    if (QSFamily[id]) QSFamily[id]();
  });
});
