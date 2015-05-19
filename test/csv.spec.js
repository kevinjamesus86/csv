// Many of these tests have been hijacked from PapaParse https://github.com/mholt/PapaParse
// Thanks for being thorough, man.

describe('csv.parse(input)', function() {

  var parse = csv.parse;

  // it()
  function spec(description, io) {
    it(description, function() {
      expect(parse(io.i)).toEqual(io.o);
    });
  }

  // iit()
  function _spec() {}

  /////////////
  /////////////

  spec('empty string', {
    i: '',
    o: []
  });

  spec('all newlines', {
    i: '\n\n\n',
    o: [
      [''],
      [''],
      ['']
    ]
  });

  spec('empty fields', {
    i: ',,',
    o: [
      ['', '', '']
    ]
  });

  spec('quoted fields', {
    i: '"a","b","c"',
    o: [
      ['a', 'b', 'c']
    ]
  });

  spec('two rows', {
    i: 'a,b,c\nd,e,f',
    o: [
      ['a', 'b', 'c'],
      ['d', 'e', 'f']
    ]
  });

  spec('three rows', {
    i: 'a,b,c\nd,e,f\n1,2,3',
    o: [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
      ['1', '2', '3']
    ]
  });

  spec('quoted fields with whitespace at edges (inner)', {
    i: 'a," b  ",c',
    o: [
      ['a', ' b  ', 'c']
    ]
  });

  spec('unquoted fields with whitespace at edges (inner)', {
    i: 'a, b  ,c',
    o: [
      ['a', ' b  ', 'c']
    ]
  });

  spec('quoted fields with whitespace at edges (outer)', {
    i: 'a,b," c  "',
    o: [
      ['a', 'b', ' c  ']
    ]
  });

  spec('unquoted fields with whitespace at edges (outer)', {
    i: 'a,b, c  ',
    o: [
      ['a', 'b', ' c  ']
    ]
  });

  spec('quoted field with delimiter', {
    i: 'a,"b,b",c',
    o: [
      ['a', 'b,b', 'c']
    ]
  });

  spec('quoted field with line feed', {
    i: 'a,"b\nb",c',
    o: [
      ['a', 'b\nb', 'c']
    ]
  });

  spec('quoted fields with line feeds', {
    i: 'a,"b\nb","\nc\n\nc",d',
    o: [
      ['a', 'b\nb', '\nc\n\nc', 'd']
    ]
  });

  spec('quoted fields at end of row with delimiter and line feed', {
    i: 'a,b,"c,c,\nc"\nd,e,f',
    o: [
      ['a', 'b', 'c,c,\nc'],
      ['d', 'e', 'f']
    ]
  });

  spec('quoted field with escaped quotes', {
    i: 'a,"b""b""b",c',
    o: [
      ['a', 'b"b"b', 'c']
    ]
  });

  spec('quoted field with escaped quotes at edge', {
    i: 'a,"""b""",c',
    o: [
      ['a', '"b"', 'c']
    ]
  });

  spec('unquoted field with quote at end of field', {
    i: 'a,b",c',
    o: [
      ['a', 'b"', 'c']
    ]
  });

  spec('quoted field with missing terminal quote consumes remaining input', {
    i: 'a,"b,c\n',
    o: [
      ['a', 'b,c\n']
    ]
  });

  spec('quoted field with quotes around delimiter', {
    i: 'a,""",""",c',
    o: [
      ['a', '","', 'c']
    ]
  });

  spec('quoted field with quotes on right side of delimiter', {
    i: 'a,",""",c',
    o: [
      ['a', ',"', 'c']
    ]
  });

  spec('quoted field with quotes on left side of delimiter', {
    i: 'a,""",",c',
    o: [
      ['a', '",', 'c']
    ]
  });

  spec('quoted fields with 5 consecutive quotes and a delimiter', {
    i: '"a","b:"""",c:""""","d"',
    o: [
      ['a', 'b:"",c:""', 'd']
    ]
  });

  spec('quoted field with whitespace around quotes', {
    i: 'a, "b" ,c',
    o: [
      ['a', ' "b" ', 'c']
    ]
  });

  spec('misplaced quotes in data', {
    i: 'a,b "b",c',
    o: [
      ['a', 'b "b"', 'c']
    ]
  });

  spec('row starts with quoted field', {
    i: 'a,b,c\n"d",e,f',
    o: [
      ['a', 'b', 'c'],
      ['d', 'e', 'f']
    ]
  });

  spec('row ends with quoted field', {
    i: 'a,b,"c"\nd,e,"f"',
    o: [
      ['a', 'b', 'c'],
      ['d', 'e', 'f']
    ]
  });

  spec('row (not EOF) ends with quoted field', {
    i: 'a,b,"c"\nd,e,f',
    o: [
      ['a', 'b', 'c'],
      ['d', 'e', 'f']
    ]
  });

  spec('consecutive empty fields with dense fields', {
    i: 'a,,\n,b,\n,,c',
    o: [
      ['a', '', ''],
      ['', 'b', ''],
      ['', '', 'c']
    ]
  });

  spec('empty fields with line feed', {
    i: ',,\n,,',
    o: [
      ['', '', ''],
      ['', '', '']
    ]
  });

  spec('multiple rows with one column / value and no delimiter', {
    i: 'a\nb\nc',
    o: [
      ['a'],
      ['b'],
      ['c']
    ]
  });

  spec('single column feed with inner empty fields', {
    i: 'a\nb\n\nc\n\n\nd',
    o: [
      ['a'],
      ['b'],
      [''],
      ['c'],
      [''],
      [''],
      ['d']
    ]
  });

  spec('single column feed with inner and outer empty fields', {
    i: '\n\na\nb\n\nc\n\n\nd\n\n',
    o: [
      [''],
      [''],
      ['a'],
      ['b'],
      [''],
      ['c'],
      [''],
      [''],
      ['d'],
      ['']
    ]
  });

});