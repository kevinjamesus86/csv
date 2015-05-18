var csv = (function() {

  var default_NEW_LINE = '\n';
  var default_DELIMITER = ',';

  return {
    parse: parse
  };

  ////////////
  ////////////

  function parse(input, opts) {
    opts = opts || {};

    var QUOTE = '"';
    var NEW_LINE = opts.newline || default_NEW_LINE;
    var DELIMITER = opts.delimiter || default_DELIMITER;
    var NEW_LINE_LENGTH = NEW_LINE.length;
    var DELIMITER_LENGTH = DELIMITER.length;

    var index = 0;
    var EOFIndex = input.length;
    var beginCaptureIndex = -1;
    var endCaptureIndex = -1;
    var delimiterIndex = -1;
    var newLineIndex = -1;
    var rows = [];
    var row = [];

    for (; EOFIndex ;) {

      // quoted field
      if (charAt(index) === QUOTE) {

        // field start index without opening quote
        beginCaptureIndex = index + 1;

        // consume string until we find a quote or reach the EOF
        while (isEOF() ? false : QUOTE === charAt(++index) ?
          // true  (continue) : next char is a quote, this is an escaped quote / part of the data
          // false (stop)     : next char is not a quote, we found the fields terminating quote
          QUOTE === charAt(++index) :
          // was not a quote, keep going
          true
          ){}

        // field end index without closing quote
        endCaptureIndex = index - 1;

        row.push(
          // unescape quotes within a quoted field
          unescape(
            input.substring(beginCaptureIndex, endCaptureIndex)
          ));

      } else {

        // this is not a quoted field which makes finding
        // the next delimiter pretty straight forward.
        // -1 is an acceptable value
        delimiterIndex = input.indexOf(DELIMITER, index);

        // small optimization.. we don't need to find the next newline
        // if it is already placed after the delimiter index.
        // -1 is an acceptable value
        newLineIndex = ~delimiterIndex && ~newLineIndex && delimiterIndex < newLineIndex ?
          newLineIndex : input.indexOf(NEW_LINE, index);

        // the next delimiter comes before the next newline,
        // or this is the last line. we've reached the end of a field
        if (~delimiterIndex && (delimiterIndex < newLineIndex || !~newLineIndex)) {
          endCaptureIndex = delimiterIndex;
        } else {

          // no delimiter was found or the delimier was found after the
          // next newline. this is the last field in the row (and possibly the input)
          endCaptureIndex = ~newLineIndex ? newLineIndex : EOFIndex;
        }

        row.push(input.substring(index, index = endCaptureIndex));
      }

      if (isEOF()) {
        saveRow();
        // BAIL OUT
        break;
      } else if (NEW_LINE === chars(NEW_LINE_LENGTH)) {
        saveRow();
        // advance index past the newline and continue processing
        index += NEW_LINE_LENGTH;
        // sanity check for last line
        if (isEOF()) {
          break;
        }
      } else if (DELIMITER === chars(DELIMITER_LENGTH)) {
        // advance index past the delimiter and continue processing
        index += DELIMITER_LENGTH;
      }

    }

    return rows;

    ///////////
    ///////////

    function isEOF() {
      return index >= EOFIndex;
    }

    function charAt(i) {
      return input.charAt(i);
    }

    function chars(i) {
      return input.substr(index, i);
    }

    function unescape(val) {
      return val.replace(/""/g, '"');
    }

    function saveRow() {
      rows.push(row.splice(0, row.length));
    }

  }
})();