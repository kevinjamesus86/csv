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

    if (EOFIndex) for (;;) {

      // quoted field
      if (QUOTE === charAt(index)) {

        // field start index without opening quote
        beginCaptureIndex = index + 1;

        for (;;) {

          // find the next quote
          index = input.indexOf(QUOTE, index + 1);

          // found a quote
          if (~index) {

            // terminal quote if not escaped
            if (QUOTE !== charAt(++index)) {
              break;
            }
          } else {

            // booo: improperly escaped field. move to EOF and add
            // a char so we capture the remainder of the input
            index = EOFIndex + 1;
            break;
          }
        }

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

      if (DELIMITER === chars(DELIMITER_LENGTH)) {
        // advance index past the delimiter and continue processing
        index += DELIMITER_LENGTH;
      } else if (NEW_LINE === chars(NEW_LINE_LENGTH) || isEOF()) {
        // save it
        saveRow();

        // advance index past the newline (if there was one)
        index += NEW_LINE_LENGTH;

        // we were already at the end of the feed, or advancing the index
        // past the newline put us there. We've already saved the row, bail out.
        if (isEOF()) {
          break;
        }
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