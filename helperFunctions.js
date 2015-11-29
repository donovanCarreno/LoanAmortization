function $(id) {
  return document.getElementById(id);
}

// loop thru a collection and call a function on each element
function each(collection, callback) {
  if (Array.isArray(collection)) {
    for (var i = 0; i < collection.length; i++) {
      callback(collection[i]);
    }
  } else {
    for (var prop in collection) {
      callback(collection[prop]);
    }
  }
}

// create and return a new array from looping thru a collection
function map(collection, callback) {
  var result = [];
  each(collection, function(element) {
    result.push(callback(element));
  });
  return result;
}

// loop thru a collection of values and return a single value
function reduce(collection, callback, initial) {
  var accumulator = initial;
  each(collection, function(element) {
    if (accumulator == undefined) {
      accumulator = element;
    } else {
      accumulator = callback(accumulator, element);
    }
  });
  return accumulator;
}

// comma separate a string to mimic currency values
function commaSeparatedString(string) {
  
  if (typeof string === 'string') {
    var newString = string.split('.');

    if (newString[0].length > 3) {
      newString[0] = newString[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }

    return newString.join('.');
  }

  return string;
}