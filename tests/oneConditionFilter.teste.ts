import { ODataQueryBuilder } from "../src/classes/oDataQueryBuilder";
import { StringOperator } from "../src/enums/stringOperator";
import { ComparisonOperator } from "../src/enums/comparisonOperator";
import { Employee } from "./employee";

const employee = {name: 'Will', salary: 5000, age: null, departament: {name: 'Sales'}};

test('Filter with value operator', () => {
    //Arrange
    const expectValue = '$filter=salary eq 5000';
    let oDataQueryBuilder = new ODataQueryBuilder<Employee>();

    //Act
    oDataQueryBuilder
        .filter(f => f.valueFilter(e => e.salary, ComparisonOperator.Equal, employee.salary));
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('Filter with string operator', () => {
    //Arrange
    const expectValue = '$filter=name.contains(\'Will\')';
    let oDataQueryBuilder = new ODataQueryBuilder<Employee>();

    //Act
    oDataQueryBuilder
        .filter(f => f.stringFilter(e => e.name, StringOperator.Contains, employee.name));
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('Filter with null value', () => {
    //Arrange
    const expectValue = '';
    let oDataQueryBuilder = new ODataQueryBuilder<Employee>();

    //Act
    oDataQueryBuilder
        .filter(f => f.stringFilter(e => e.age, StringOperator.Contains, employee.age));
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});