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

### Fixtures
The test/fixtures directory contains flatfile examples of expected inputs, intermediates, and results.

1. `good_data.csv` Good input data
2. `good_df.csv` Processed input data into data frame (array of row objects)
3. `good_components.csv` Calculated components
4. `good_measures.csv` Calculcated measures
5. `good_maptg.csv` Final long format for upload

