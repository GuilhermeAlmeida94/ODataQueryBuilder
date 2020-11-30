import { ODataQueryBuilder } from "../src/classes/oDataQueryBuilder";
import { StringOperator } from "../src/enums/stringOperator";
import { ComparisonOperator } from "../src/enums/comparisonOperator";
import { Employee } from "./employee";

const employee: Employee = {name: 'Will', salary: 5000, age: null, departament: {name: 'Sales'}};
let oDataQueryBuilder = new ODataQueryBuilder<Employee>();

test('Filter with value and String operator', () => {
    //Arrange
    const expectValue = '$filter=salary eq 5000 and name.contains(\'Will\')';

    //Act
    oDataQueryBuilder.clear();
    oDataQueryBuilder
        .filter(f => f.valueFilter(e => e.salary, ComparisonOperator.Equal, employee.salary).and()
                        .stringFilter(e => e.name, StringOperator.Contains, employee.name));
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('Filter with value null and String operator', () => {
    //Arrange
    const expectValue = '$filter=name.contains(\'Will\')';

    //Act
    oDataQueryBuilder.clear();
    oDataQueryBuilder
        .filter(f => f.valueFilter(e => e.age, ComparisonOperator.Equal, employee.age).and()
                        .stringFilter(e => e.name, StringOperator.Contains, employee.name));
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('Filter with not ignoring value null and String operator', () => {
    //Arrange
    const expectValue = '$filter=age eq null and name.contains(\'Will\')';
    let builderOptions = {ignoreNull: false};
    let oDataQueryBuilder2 = new ODataQueryBuilder<Employee>(builderOptions);

    //Act
    oDataQueryBuilder2
        .filter(f => f.valueFilter(e => e.age, ComparisonOperator.Equal, employee.age).and()
                        .stringFilter(e => e.name, StringOperator.Contains, employee.name));
        
    //Assert
    expect(oDataQueryBuilder2.generate()).toEqual(expectValue);
});