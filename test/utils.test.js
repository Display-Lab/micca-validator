import {expect} from 'chai';
import * as CONST from '../src/consts.js';
import Utils from '../src/utils.js'

// Helper function to remove a value from an array.
function removeFromArray(arr,val){
  let idx = arr.indexOf(val);
  if (idx > -1) { arr.splice(idx, 1); }
  return(arr);
}

describe('diffCols', function(){
  it('returns empty when no differnces.', function(){
    let result = Utils.diffCols(CONST.EXPECT_HEADER,CONST.EXPECT_HEADER);
    expect(result).to.be.empty;
  });

  it('points out bad name of column.', function(){
    let wrongName = [...CONST.EXPECT_HEADER];
    wrongName[1] = "badname";

    let result = Utils.diffCols(wrongName,CONST.EXPECT_HEADER);
    expect(result).to.have.lengthOf(1);
    expect(result).to.include("badname");
  });

  it('points out name of extra column.', function(){
    let hasExtra = [...CONST.EXPECT_HEADER];
    hasExtra.push("extra");

    let result = Utils.diffCols(hasExtra,CONST.EXPECT_HEADER);
    expect(result).to.have.lengthOf(1);
    expect(result).to.include("extra");
  });

  it('points out name of extra blank columns.', function(){
    let extraBlankCols = [...CONST.EXPECT_HEADER];
    extraBlankCols.push("");
    extraBlankCols.push("");

    let result = Utils.diffCols(extraBlankCols,CONST.EXPECT_HEADER);
    expect(result).to.have.lengthOf(1);
    expect(result).to.include("");
  });
});

describe('diffCols', function(){
  it('points out name of missing column.', function(){
    let missingColName = [...CONST.EXPECT_HEADER];
    removeFromArray(missingColName, CONST.EXPECT_HEADER[2]);

    let result = Utils.diffHeader(missingColName,CONST.EXPECT_HEADER);
    expect(result).to.have.lengthOf(1);
    expect(result).to.include(CONST.EXPECT_HEADER[2]);
  });

  it('does not report extra column.', function(){
    let hasExtra = [...CONST.EXPECT_HEADER];
    hasExtra.push("extra");

    let result = Utils.diffHeader(hasExtra,CONST.EXPECT_HEADER);
    expect(result).to.be.empty;
  });
});
