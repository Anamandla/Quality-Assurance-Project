const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite(function () {
  this.timeout(5000);
  suite(function () {
    
    test(function (done) {
      chai
        .request(server)
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });
    
    test(function (done) {
      chai
        .request(server)
        .get('/hello?name=Ali')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Ali');
          done();
        });
    });
    
    test( function (done) {
      chai
        .request(server)
        .put('/travellers')
        .send({surname: 'Colombo'})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.name, 'Cristoforo');
          assert.equal(res.body.surname, 'Colombo');

          done();
        });
    });
    
    test(function (done) {
      chai
        .request(server)
        .put('/travellers')
        .send({ surname: 'da Verrazzano' })
        .end(function (err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body.name, 'Giovanni');
          assert.equal(res.body.surname,'da Verrazzano');

          done();
        });
    });
  });
});

const Browser = require('zombie');

Browser.site = 'http://localhost:3000/';

suite(function () {
  const browser = new Browser();
  suiteSetup(function(done) {
    return browser.visit('/', done);
  });

  this.timeout(5000);



  suite(function () {
    test(function() {
      assert.isNotNull(browser.site);
    });
  });

  suite(function () {
    
    test(function (done) {
      browser.fill('surname', 'Colombo').then(() => {
      browser.pressButton('submit', () => {
      browser.assert.success();
      browser.assert.text('span#name', 'Cristoforo');
      browser.assert.text('span#surname', 'Colombo')
      browser.assert.elements('span#dates', 1);

      done();
      });
      });

    });
    
    test('Submit the surname "Vespucci" in the HTML form', function (done) {
      browser.fill('surname', 'Vespucci').then(() => {
        browser.pressButton('submit', () => {
          browser.assert.success();
          browser.assert.text('span#name', 'Amerigo');
          browser.assert.text('span#surname', 'Vespucci');
          browser.assert.elements('span#dates', 1);
        });
      });

      done();
    });
  });
});
