var should = require( 'should' ),
  REvalidate = require( '../src/REvalidate' ),
  sinon = require( 'sinon' );

describe('Revalidate', function()
{
  describe('isValid', function()
  {
    it('should return true if no rules are supplied', function()
    {
      REvalidate.isValid('5').should.equal( true );
      REvalidate.isValid(5 ).should.equal( true );
      REvalidate.isValid([] ).should.equal( true );
    });

    it('should return true if the first argument has a length of N where N is supplied as second argument', function()
    {
      REvalidate.isValid('5', 1 ).should.equal( true );
      REvalidate.isValid(5, 1 ).should.equal( true );
      REvalidate.isValid(['name'], 1 ).should.equal( true );
    });

    it('should return false if the first argument has a different length of N where N is supplied as second', function()
    {
      REvalidate.isValid('52', 1 ).should.equal( false );
      REvalidate.isValid(52, 1 ).should.equal( false );
      REvalidate.isValid(['name', 'surname'], 1 ).should.equal( false );
    });

    it('should throw an "Invalid validation method" error if the validation method does not exist', function()
    {
      (function(){
        REvalidate.isValid('name', 'string' );
      }).should.throw('Invalid validation method');
    });
  });

  describe('addRule', function()
  {
    it('should add a "string" rule that checks if the input is a string or not', function()
    {
      REvalidate.addRule('string', function(input)
      {
        return typeof input === 'string';
      });

      REvalidate.isValid('name', 'string' ).should.equal(true);
      REvalidate.isValid(555, 'string' ).should.equal(false);
    });
  });
});

