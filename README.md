# ODataQueryBuilder
A typescript library for build OData queries.

## Inspirations
This library was made based in two others libraries: 
<a href="https://github.com/skynet2/ngx-odata">ngx-odata</a>
and 
<a href="https://github.com/jaredmahan/odata-query-builder">odata-query-builder</a>. It was taken parts of both and mixed. The goal is to do something diferent, but not start from the stratch.

## Operators
There is two types of operators: comparison and string.
The comparison operators are `Equal`, `Less`, `Greater`, `LessOrEqual`,`GreaterOrEqual`,  `NotEqual`. The string operators are `Contains`, `StartsWith`, `EndsWith`.

## Functions
To each option in OData there is a function in this library with the same name. The function `count` no need parameter. The functions `skip` and `top` need a number. To sort ascending use `orderBy` function with the field as parameter and the `orderByDesc` function is used to sort descendent.

The function `select` need an array of the fields. The `expand` needs the field to expand and will open a predicate for do a query. At least, the `filter` function use internal functions to create conditions.

## Examples
Create the object tha will build your query
```bash
let oDataQueryBuilder = new ODataQueryBuilder();
```

You can filter using comparison operator.
```bash
let query1 = oDataQueryBuilder
    .filter(f => f.valueFilter('salary', ComparisonOperator.Equals, 5000))
    .generate();
```
The value of query1 will be `$filter=salary eq 5000`.

You can filter using string operators.
```bash
let query2 = oDataQueryBuilder
    .filter(f => f.stringFilter('name', StringOperator.Contains, 'Will'))
    .generate();
```
The value of query2 will be `$filter=name.contains('Will')`.

If the value is null, by standart the filter will ignore the condition.
```bash
let query3 = oDataQueryBuilder
    .filter(f => f.valueFilter('age', ComparisonOperator.Equal, null))
    .generate();
```
The value of query3 will be empty. If the null value must exist, define in the options on the constructor method like:
```bash
let builderOptions = {ignoreNull: false};
let oDataQueryBuilderNotIgnoreNull = new ODataQueryBuilder(builderOptions);
```
Then, the same query will return `$filter=age eq null`.

To add logical operators use the functions `and()` and `or()`.
```bash
let query4 = oDataQueryBuilder
    .filter(f => f.valueFilter('salary', ComparisonOperator.Equal, 5000).and()
                    .stringFilter('name', StringOperator.Contains, 'Will'))
    .generate();
```
The value of query4 will be `$filter=salary eq 5000 and name.contains('Will')`.

If some value is null, the filter will ignore the condition.
```bash
let query5 = oDataQueryBuilder
    .filter(f => f.valueFilter('age', ComparisonOperator.Equal, null).and()
                    .stringFilter('name', StringOperator.Contains, 'Will'))
    .generate();
```
The value of query5 will be `$filter=name.contains('Will')`.

You can add a inner filter (that will generate filter with parentesis).
```bash
let query6 = oDataQueryBuilder
    .filter(f => f.stringFilter('name', StringOperator.Contains, 'Will')
                  .andFilter(f2 => f2.valueFilter('salary', ComparisonOperator.Greater, 5000).or()
                                     .stringFilter('departament/name', StringOperator.StartsWith, 'Sales')))
    .generate();
```
The value of query6 will be `$filter=name.contains('Will') and (salary gt 5000 or departament/name.startswith('Sales'))`.

If the inner condition is null, both it and its logical operator will be ignored.
```bash
let query7 = oDataQueryBuilder
    .filter(f => f.stringFilter('name', StringOperator.Contains, 'Will')
                      .andFilter(f2 => f2.and().valueFilter('age', ComparisonOperator.Greater, null).or()))
    .generate();
```
The value of query7 will be `$filter=name.contains('Will')`.

Above is how to use `select`, `skip`, `top`, `orderBy`, `orderByDesc`.
```bash
let query8 = oDataQueryBuilder
    .select('name', 'departament/name')
    .skip(1)
    .top(5)
    .orderBy('salary')
    .orderByDesc('age');
    .generate();
```
The value of query8 will be `$top=5&$skip=1&$orderby=salary asc,age desc&$select=name,departament/name`.

Above is how to use `count` associate with a `filter`.
```bash
let query9 = oDataQueryBuilder
    .filter(f => f.stringFilter('name', StringOperator.Contains, 'Will'))
    .count()
    .generate();
```
The value of query9 will be `$count=true&$filter=name.contains('Will')'`.

Above is how to use `expand` associate with a `count`.
```bash
let query10 = oDataQueryBuilder
    .expand('departament', e => e.count())
    .generate();
```
The value of query10 will be `$expand=departament($count=true)`.
