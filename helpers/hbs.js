const moment = require('moment');
const Posts = require('../models/Posts');

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format)
    },
    //truncates blog posts 
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
          let new_str = str + ' '
          new_str = str.substr(0, len)
          new_str = str.substr(0, new_str.lastIndexOf(' '))
          new_str = new_str.length > 0 ? new_str : str.substr(0, len)
          return new_str + '...'
        }
        return str
      },
      // stirps tags (<p>, etc)
      stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
      },
      // checks the postUser id against the logged in users ID, if they match, edit icon will appear 
      editIcon: function (postUser, loggedUser, postId, floating = true) {
        console.log("postUser")
        console.log(postUser)
        console.log("loggedUser")
        console.log(loggedUser)
        if (postUser._id.toString() == loggedUser._id.toString()) {
          if (floating) {
            return `<a href="/posts/edit/${postId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
          } else {
            return `<a href="/posts/edit/${postId}"><i class="fas fa-edit"></i></a>`
          }
        } else {
          return ''
        }
      },
      select: function (selected, options) {
        return options
          .fn(this)
          .replace(
            new RegExp(' value="' + selected + '"'),
            '$& selected="selected"'
          )
          .replace(
            new RegExp('>' + selected + '</option>'),
            ' selected="selected"$&'
          )
      }
 
}