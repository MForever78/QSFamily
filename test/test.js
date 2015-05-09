/**
 * Created by MForever78 on 15/5/9.
 */

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect = chai.expect;

chai.use(chaiAsPromised);

describe('Login tests', function() {
  require('../models');

  var user = {
    username: "MForever78",
    password: "123456"
  };

  it('should return role username and userid', function() {
    expect(Login('teacher', user.username, user.password))
      .to.eventually.have.all.keys('role', 'username', 'userid');
    expect(Login('student', user.username, user.password))
      .to.eventually.have.all.keys('role', 'username', 'userid');
    expect(Login('assistant', user.username, user.password))
      .to.eventually.have.all.keys('role', 'username', 'userid');
  });
});