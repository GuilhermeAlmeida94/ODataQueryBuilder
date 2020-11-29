# o-data-query-builder
A typescript library for build OData queries.

## Inspirations
This library was made based in two others libraries: 
<a href="https://github.com/skynet2/ngx-odata">ngx-odata</a>
and 
<a href="https://github.com/jaredmahan/odata-query-builder">odata-query-builder</a>. It was taken parts of both and mixed. The goal is to do something diferent, but not start from the stratch.

## Operators
There is two types of operators: comparison and string.
Comparison operators are `equals`

## Examples
Create the object tha will build your query
```bash
let oDataQueryBuilder = new ODataQueryBuilder();
```

To filter using comparison operator, do something like this:
```bash
let query1 = oDataQueryBuilder
    .filter(f => f.valueFilter('salary', ComparisonOperator.Equals, 5000))
    .generate();
```
The value of query1 will be `$filter=salary eq 5000`.

To filter using string operators, do something like this:
```bash
let query2 = oDataQueryBuilder
    .filter(f => f.stringFilter('name', StringOperator.Contains, 'Will'));
```
The value of query2 will be `$filter=name.contains('Will')`.
