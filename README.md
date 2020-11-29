# o-data-query-builder
A typescript library for build OData queries.

## Inspirations
This library was made based in two others libraries: 
<a href="https://github.com/skynet2/ngx-odata">ngx-odata</a>
and 
<a href="https://github.com/jaredmahan/odata-query-builder">odata-query-builder</a>. It was taken parts of both and mixed. The goal is to do something diferent, but not start from the stratch.

## Operators
There is two types of operators: comparison and string.
The comparison operators are `Equal`, `Less`, `Greater`, `LessOrEqual`,`GreaterOrEqual`,  `NotEqual`. The string operators are `Contains`, `StartsWith`, `EndsWith`.

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
    .filter(f => f.stringFilter('name', StringOperator.Contains, 'Will'));
```
The value of query2 will be `$filter=name.contains('Will')`.

If the value is null, by standart the filter will ignore the condition.
```bash
let query3 = oDataQueryBuilder
        .filter(f => f.valueFilter('age', ComparisonOperator.Equal, null));
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
                      .stringFilter('name', StringOperator.Contains, 'Will'));
```
The value of query4 will be `$filter=salary eq 5000 and name.contains('Will')`.

If some value is null, the filter will ignore the condition.
```bash
let query4 = oDataQueryBuilder
        .filter(f => f.valueFilter('age', ComparisonOperator.Equal, null).and()
                        .stringFilter('name', StringOperator.Contains, 'Will));
```
The value of query4 will be `$filter=name.contains('Will')`.

You can add a inner filter (that will generate filter with parentesis).
```bash
let query5 = oDataQueryBuilder
        .filter(f => f.stringFilter('name', StringOperator.Contains, 'Will')
                      .andFilter(f2 => f2.valueFilter('salary', ComparisonOperator.Greater, 5000).or()
                                         .stringFilter('departament/name', StringOperator.StartsWith, 'Sales'))
                        );
```
The value of query5 will be `$filter=name.contains('Will') and (salary gt 5000 or departament/name.startswith('Sales'))`.

If the inner condition is null, both it and its logical operator will be ignored.
```bash
let query6 = oDataQueryBuilder
        .filter(f => f.stringFilter('name', StringOperator.Contains, employee.name)
                      .andFilter(f2 => f2.and().valueFilter('age', ComparisonOperator.Greater, employee.age).or())
                        );
```
The value of query6 will be `$filter=name.contains('Will')`.