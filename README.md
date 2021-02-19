# OData Query Maker
A typescript library to make OData queries.

## Inspirations
This library was made based in the following libraries: 
<a href="https://github.com/skynet2/ngx-odata">ngx-odata</a>
,
<a href="https://github.com/jaredmahan/odata-query-builder">odata-query-builder</a>
and
<a href="https://github.com/vanilsonbr/odata-form-builder">odata-form-builder</a>
. It was taken parts of both and mixed. The goal is to do something diferent, but not start from the scratch.

## Operators
There is two types of operators: comparison and string.
The comparison operators are `Equal`, `Less`, `Greater`, `LessOrEqual`,`GreaterOrEqual`,  `NotEqual`. The string operators are `Contains`, `StartsWith`, `EndsWith`.

## Functions
To each option in OData there is a function in this library with the same name. The function `count` no need parameter. The functions `skip` and `top` need a number. To sort ascending use `orderBy` function with the field as parameter and the `orderByDesc` function is used to sort descendent.

The function `select` need an array of the fields. The `expand` needs the field to expand and will open a predicate for do a query. At least, the `filter` function use internal functions to create conditions.

## Examples
To exemplify, lets create some classes.
```bash
export class Employee {
    name: string;
    salary: number;
    age: number;
    departament: Departament;
}

export class Departament {
    name: string;
}
```

Create the object tha will build your query
```bash
let odataQueryMaker = new OdataQueryMaker<Employee>();
```

You can filter using comparison operator.
```bash
let query1 = odataQueryMaker
    .filter(f => f.valueFilter(e => e.salary, ComparisonOperator.Equals, 5000))
    .generate();
```
The value of query1 will be `$filter=salary eq 5000`.

You can filter using string operators.
```bash
let query2 = odataQueryMaker
    .filter(f => f.stringFilter(e => e.name, StringOperator.Contains, 'Will'))
    .generate();
```
The value of query2 will be `$filter=contains(name, 'Will')`.

If the value is null, by standart the filter will ignore the condition.
```bash
let query3 = odataQueryMaker
    .filter(f => f.valueFilter(e => e.age, ComparisonOperator.Equal, null))
    .generate();
```
The value of query3 will be empty. If the null value must exist, define in the options on the constructor method like:
```bash
let odataQueryOptions = {ignoreNull: false};
let odataQueryMakerNotIgnoreNull = new OdataQueryMaker<Employee>(odataQueryOptions);
```
Then, the same query will return `$filter=age eq null`.

To add logical operators use the functions `and()` and `or()`.
```bash
let query4 = odataQueryMaker
    .filter(f => f.valueFilter(e => e.salary, ComparisonOperator.Equal, 5000).and()
                    .stringFilter(e => e.name, StringOperator.Contains, 'Will'))
    .generate();
```
The value of query4 will be `$filter=salary eq 5000 and contains(name, 'Will')`.

If some value is null, the filter will ignore the condition.
```bash
let query5 = odataQueryMaker
    .filter(f => f.valueFilter(e => e.age, ComparisonOperator.Equal, null).and()
                    .stringFilter(e => e.name, StringOperator.Contains, 'Will'))
    .generate();
```
The value of query5 will be `$filter=contains(name, 'Will')`.

You can add a inner filter (that will generate filter with parentesis).
```bash
let query6 = odataQueryMaker
    .filter(f => f.stringFilter(e => e.name, StringOperator.Contains, 'Will')
                  .andFilter(f2 => f2.valueFilter(e => e.salary, ComparisonOperator.Greater, 5000).or()
                                     .stringFilter(e => e.departament.name, StringOperator.StartsWith, 'Sales')))
    .generate();
```
The value of query6 will be `$filter=contains(name, 'Will') and (salary gt 5000 or startswith(departament/name, 'Sales'))`.

If the inner condition is null, both it and its logical operator will be ignored.
```bash
let query7 = odataQueryMaker
    .filter(f => f.stringFilter(e => e.name, StringOperator.Contains, 'Will')
                      .andFilter(f2 => f2.and().valueFilter('age', ComparisonOperator.Greater, null).or()))
    .generate();
```
The value of query7 will be `$filter=contains(name, 'Will')`.

The example below shows how to use `select`, `skip`, `top`, `orderBy`, `orderByDesc`.
```bash
let query8 = odataQueryMaker
    .select(e => e.name, e => departament.name)
    .skip(1)
    .top(5)
    .orderBy(e => salary)
    .orderByDesc(e => age);
    .generate();
```
The value of query8 will be `$top=5&$skip=1&$orderby=salary asc,age desc&$select=name,departament/name`.

The example below shows how to use `count` associate with a `filter`.
```bash
let query9 = odataQueryMaker
    .filter(f => f.stringFilter(e => e.name, StringOperator.Contains, 'Will'))
    .count()
    .generate();
```
The value of query9 will be `$count=true&$filter=contains(name, 'Will')'`.

The example below shows how to use `expand` associate with a `count`.
```bash
let query10 = odataQueryMaker
    .expand(e => e.departament, dep => dep.count())
    .generate();
```
The value of query10 will be `$expand=departament($count=true)`.
