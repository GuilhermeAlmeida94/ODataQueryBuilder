import { ODataQueryBuilder } from "../src/classes/oDataQueryBuilder";
import { StringOperator } from "../src/enums/stringOperator";
import { ComparisonOperator } from "../src/enums/comparisonOperator";

const employee = {name: 'Will', salary: 5000, age: null, departament: {name: 'Sales'}};

test('Filter with value and String operator', () => {
    //Arrange
    const expectValue = '$filter=salary eq 5000 and name.contains(\'Will\')';
    let oDataQueryBuilder = new ODataQueryBuilder();

    //Act
    oDataQueryBuilder
        .filter(f => f.valueFilter('salary', ComparisonOperator.Equal, employee.salary).and()
                        .stringFilter('name', StringOperator.Contains, employee.name));
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('Filter with value null and String operator', () => {
    //Arrange
    const expectValue = '$filter=name.contains(\'Will\')';
    let oDataQueryBuilder = new ODataQueryBuilder();

    //Act
    oDataQueryBuilder
        .filter(f => f.valueFilter('age', ComparisonOperator.Equal, employee.age).and()
                        .stringFilter('name', StringOperator.Contains, employee.name));
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('Filter with not ignoring value null and String operator', () => {
    //Arrange
    const expectValue = '$filter=age eq null and name.contains(\'Will\')';
    let builderOptions = {ignoreNull: false};
    let oDataQueryBuilder = new ODataQueryBuilder(builderOptions);

    //Act
    oDataQueryBuilder
        .filter(f => f.valueFilter('age', ComparisonOperator.Equal, employee.age).and()
                        .stringFilter('name', StringOperator.Contains, employee.name));
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});