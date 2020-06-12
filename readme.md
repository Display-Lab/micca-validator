# MICCA Data Validator and Aggregation

## Building
See `npm` scripts in package.json

```sh
npm run-script build
```

## Testing

```sh
npm test
```

### Automating testing
Use [`fd`](https://github.com/sharkdp/fd) and [`entr`](https://github.com/eradman/entr/) to watch for changes in `src/` or `test/`.
Run tests when an existing file changes.
```
fd . src/ test/ | entr -c npm test
```

