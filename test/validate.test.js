var assert = require('assert');

//var expect = require('chai').expect;
import {expect} from 'chai';

//var bundle = require('../src/validate_csv.js')
import * as bundle from '../src/validate_csv.js'

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});


describe('bundle.validateFile()', function(){
  it('should return true', function(){
    expect(bundle.validateFile()).to.equal(true);
  });
});
