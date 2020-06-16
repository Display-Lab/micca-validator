import {csvParse} from 'd3-dsv';
import {expect} from 'chai';
import * as CONST from '../src/consts.js';
import Marple from '../src/marple.js'
import goodCsvRaw from './fixtures/good_data.csv'
import badCsvRaw from './fixtures/bad_data.csv'

// Helper function to read a file from disk
function readFile(path){
  try{
    let reader = new FileReader();
    reader.readAsText(file);	
  }
  catch(err){
    console.log(err);
  }
}

var goodDf, badDf;
before("Setup data frames.", function(){
  goodDf = csvParse(goodCsvRaw.toLowerCase()); 
  badDf = csvParse(badCsvRaw.toLowerCase()); 
})

describe('Marple static methods', function(){
  describe('missingHeaders', function(){
    it('returns empty array when all headers are present', function(){
      let result = Marple.missingHeaders(CONST.EXPECT_HEADER);
      expect(result).to.eql([]);
    });

    it('returns list of missing headers', function(){
      let missingLast = CONST.EXPECT_HEADER.slice(0,6);

      let result = Marple.missingHeaders(missingLast);
      expect(result).to.eql(CONST.EXPECT_HEADER.slice(6));
    });
  });

  describe('extraHeaders', function(){
    it('returns empty array when all headers are present', function(){
      let result = Marple.extraHeaders(CONST.EXPECT_HEADER);
      expect(result).to.eql([]);
    });

    it('returns list of extra headers', function(){
      let hasExtra = [...CONST.EXPECT_HEADER];
      hasExtra.push("extra");

      let result = Marple.extraHeaders(hasExtra);
      expect(result).to.eql(["extra"]);
    });
  });

  describe('sleuthRow', function(){
    it('returns empty array when data is good', function(){
      let result = Marple.sleuthRow(goodDf[1]);
      expect(result).to.eql([]);
    });

    it('returns name of column if column is empty.', function(){
      let row, result;
      goodDf.columns.forEach( (col) => {
        row = {...goodDf[1]};
        row[col] = "";
        result = Marple.sleuthRow(row);
        expect(result).to.eql([col]);
      });
    });

    it('identifies date columns with bad dates.', function(){
      let badDatesRow = {...goodDf[1]};
      badDatesRow['delivery_date'] = "2/10/2020";
      badDatesRow['choice_date'] = "2020-13-01";

      let result = Marple.sleuthRow(badDatesRow);

      expect(result).to.eql(['delivery_date', 'choice_date']);
    });

    it('identifies columns with garbage data.', function(){
      let garbageRow = {...goodDf[1]};
      let garbageCols = [];

      goodDf.columns.slice(1).forEach( (col) => {
        if(Math.random() >= 0.7){
          garbageRow[col] = "garbage";
          garbageCols.push(col);
        }
      });

      let result = Marple.sleuthRow(garbageRow);
      expect(result).to.eql(garbageCols);
    });
  });

  describe('problemReport', function(){
    it('is empty for good data.', function(){
      let result = Marple.problemReport(goodDf);
      expect(result).to.eql({});
    });

    it('has one key for each row of bad data', function(){
      let result = Marple.problemReport(badDf);
      let nkeys = Object.keys(result).length;
      expect(nkeys).to.eql(badDf.length);
    });
  });

});

