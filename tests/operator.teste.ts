import { ODataQueryBuilder } from "../src/classes/oDataQueryBuilder";
import { StringOperator } from "../src/enums/stringOperator";
import { ComparisonOperator } from "../src/enums/comparisonOperator";

const employee = {name: 'Will', salary: 5000, age: null, departament: {name: 'Sales'}};

test('Value operator', () => {
    //Arrange
    const expectValue = '$filter=salary eq 5000'
    let oDataQueryBuilder = new ODataQueryBuilder();

    //Act
    oDataQueryBuilder
        .filter(f => f.valueFilter('salary', ComparisonOperator.Equals, employee.salary));
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('String operator', () => {
    //Arrange
    const expectValue = '$filter=name.contains(\'Will\')'
    let oDataQueryBuilder = new ODataQueryBuilder();

    //Act
    oDataQueryBuilder
        .filter(f => f.stringFilter('name', StringOperator.Contains, employee.name));
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});