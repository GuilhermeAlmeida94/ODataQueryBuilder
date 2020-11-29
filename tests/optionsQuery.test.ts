import { ODataQueryBuilder } from "../src/classes/oDataQueryBuilder";
import { StringOperator } from "../src/enums/stringOperator";
import { OrderBy } from "../src/enums/orderByEnum";

test('Select, top and multiple order by', () => {
    //Arrange
    const expectValue = '$top=5&$skip=1&$orderby=salary asc,age desc&$select=name,departament/name';
    let oDataQueryBuilder = new ODataQueryBuilder();

    //Act
    oDataQueryBuilder.select('name', 'departament/name')
                     .skip(1)
                     .top(5)
                     .orderBy('salary')
                     .orderByDesc('age');
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('Simple filter and count', () => {
    //Arrange
    const expectValue = '$count=true&$filter=name.contains(\'Will\')';
    let oDataQueryBuilder = new ODataQueryBuilder();

    //Act
    oDataQueryBuilder.filter(f => f.stringFilter('name', StringOperator.Contains, 'Will'))
                     .count();
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('Expand', () => {
    //Arrange
    const expectValue = '$expand=departament($count=true)';
    let oDataQueryBuilder = new ODataQueryBuilder();

    //Act
    oDataQueryBuilder.expand('departament', e => e.count());
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});