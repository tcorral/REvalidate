(function(root)
{
  var validations, REvalidate, isNodeEnvironment;
  if(!Array.isArray)
  {
    Array.isArray = function (input)
    {
      return Object.prototype.toString.call(input) === '[object Array]';
    };
  }
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
      'use strict';
      if (this == null) {
        throw new TypeError();
      }
      var n, k, t = Object(this),
      len = t.length >>> 0;

      if (len === 0) {
        return -1;
      }
      n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) { // shortcut for verifying if it's NaN
          n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    };
  }
  /**
   * Object that will hold all the rules to be used with isValid.
   * @private
   * @type {{}}
   */
  validations = {
    '__length__': function(input, length)
    {
      if(input.length == null)
      {
        input = String(input);
      }
      return input.length === length;
    }
  };
  /**
   * REvalidate object.
   * @private
   * @type {{}}
   */
  REvalidate = {};
  /**
   * Check if Hydra.js is loaded in Node.js environment
   * @type {Boolean}
   * @private
   */
  isNodeEnvironment = typeof exports === 'object' && typeof module === 'object' && typeof module.exports === 'object' && typeof require === 'function';
  /**
   * The core of REvalidate.
   * Is a function that will return a boolean value when the validation is done.
   * Imagine you have two validation rules:
   *  -'string' -> Checks if the input is a string or not.
   *  -'number' -> Checks if the input is a number or not.
   *  -If we supply a number we check the length -> Checks if the input, number or string, match the length.
   * Can be used in different ways:
   * Test a single rule:
   *     isValid('name', 'string');
   * Test more than one rule:
   *     isValid('name', ['string', 3]);
   * @param input
   * @param rules
   * @param prevResults (Used internally only)
   * @returns {*}
   */
  function isValid(input, rules, prevResults)
  {
    var type, results;

    if(input == null)
    {
      throw new Error('Invalid arguments');
    }
    if(!prevResults)
    {
      prevResults = [];
    }
    if(!Array.isArray(rules))
    {
      if(!rules)
      {
        return true;
      }
      if( typeof rules === 'number')
      {
        type = '__length__';
      }else{
        type = rules.toUpperCase();
      }
      if(typeof validations[type] === 'undefined')
      {
        throw new Error('Invalid validation method');
      }
      results = validations[type](input, rules);
      prevResults.push(results);
      return results;
    }else{
      while(rules.length)
      {
        isValid(input, rules.shift(), prevResults);
      }
      return prevResults.indexOf(false) === -1;
    }
  }

  /**
   * Adds or overwrites a rule to validate data.
   * @param name
   * @param callback
   */
  function addRule(name, callback)
  {
    if(name == null || typeof callback !== 'function')
    {
      throw new Error('Invalid arguments');
    }
    validations[name.toUpperCase()] = callback;
  }

  // Expose the API.
  REvalidate = {
    isValid: isValid,
    addRule: addRule
  };

  // Exports the object.
  root.REvalidate = REvalidate;
  if ( isNodeEnvironment )
  {
    module.exports = REvalidate;
  }
  else if ( typeof define !== 'undefined' )
  {
    define( 'REvalidate', [], function ()
    {
      return REvalidate;
    } );
  }
}(this));