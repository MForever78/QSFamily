/**
 * Created by MForever78 on 15/10/24.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var attachmentCategorySchema = new Schema({
  title: {
    type: String,
    required: true
  },

  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  attachments: [{
    url: String,
    title: String,
    type: String
  }],

  create_at: {
    type: Date,
    "default": Date.now()
  },

  update_at: Date
});

attachmentCategorySchema.pre('save', function() {
  this.update_at = Date.now();
});

var AttachmentCategory = mongoose.model('AttachmentCategory', attachmentCategorySchema);
module.exports = AttachmentCategory;
