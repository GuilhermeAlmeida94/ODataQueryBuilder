import { OdataQueryMaker } from "../src/odata-query-maker";
import { StringOperator } from "../src/enums/string-operator";
import { ComparisonOperator } from "../src/enums/comparison-operator";
import { Employee } from "./employee";
import { EmployeeData } from "./employee-data";

const employee = new EmployeeData().employee;
let oDataQueryBuilder = new OdataQueryMaker<Employee>();

test('Filter with value and String operator', () => {
    //Arrange
    const expectValue = '$filter=salary eq 5000 and contains(name, \'Will\')';

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
    const expectValue = '$filter=contains(name, \'Will\')';

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
    const expectValue = '$filter=age eq null and contains(name, \'Will\')';
    let builderOptions = {ignoreNull: false};
    let oDataQueryBuilder2 = new OdataQueryMaker<Employee>(builderOptions);

    //Act
    oDataQueryBuilder2
        .filter(f => f.valueFilter(e => e.age, ComparisonOperator.Equal, employee.age).and()
                      .stringFilter(e => e.name, StringOperator.Contains, employee.name));
        
    //Assert
    expect(oDataQueryBuilder2.generate()).toEqual(expectValue);
});

test('Filter with multiple conditions', () => {
    //Arrange
    const expectValue = '$filter=contains(name, \'Will\')';
    let oDataQueryBuilder2 = new OdataQueryMaker<Employee>();

    //Act
    oDataQueryBuilder2
        .filter(f => f.valueFilter(e => e.age, ComparisonOperator.Equal, employee.age).and()
                      .stringFilter(e => e.name, StringOperator.Contains, employee.name).or()
                      .stringFilter(e => e.motherName, StringOperator.Contains, employee.motherName).and()
                      .stringFilter(e => e.fatherName, StringOperator.Contains, employee.fatherName));
        
    //Assert
    expect(oDataQueryBuilder2.generate()).toEqual(expectValue);
});