# csv

  Super simple csv parsing

## Show it

```js
csv.parse(
  'first,row,of data\n' +
  'second,row,of data\n'
);
```

## API

### csv.parse(string, [config])

  Parse a CSV string

### config

Option | Default | Description
------ | ------- | -----------
delimiter | `,` | Field delimiting character
newline | `\n` | Row terminating character

# License

  MIT
