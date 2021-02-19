import { OdataQueryMaker } from "../src/odata-query-maker";
import { StringOperator } from "../src/enums/string-operator";
import { ComparisonOperator } from "../src/enums/comparison-operator";
import { Employee } from "./employee";
import { EmployeeData } from "./employee-data";

const employee = new EmployeeData().employee;
let odataQueryMaker = new OdataQueryMaker<Employee>();

test('Filter with value operator', () => {
    //Arrange
    const expectValue = '$filter=salary eq 5000';

    //Act
    odataQueryMaker.clear();
    odataQueryMaker
        .filter(f => f.valueFilter(e => e.salary, ComparisonOperator.Equal, employee.salary));
        
    //Assert
    expect(odataQueryMaker.generate()).toEqual(expectValue);
});

test('Filter with boolean value operator', () => {
    //Arrange
    const expectValue = '$filter=hasChildrens eq false';

    //Act
    odataQueryMaker.clear();
    odataQueryMaker
        .filter(f => f.valueFilter(e => e.hasChildrens, ComparisonOperator.Equal, employee.hasChildrens));
        
    //Assert
    expect(odataQueryMaker.generate()).toEqual(expectValue);
});

test('Filter with string operator', () => {
    //Arrange
    const expectValue = '$filter=contains(name, \'Will\')';

    //Act
    odataQueryMaker.clear();
    odataQueryMaker
        .filter(f => f.stringFilter(e => e.name, StringOperator.Contains, employee.name).or());
        
    //Assert
    expect(odataQueryMaker.generate()).toEqual(expectValue);
});

test('Filter with null value', () => {
    //Arrange
    const expectValue = '';

    //Act
    odataQueryMaker.clear();
    odataQueryMaker
        .filter(f => f.valueFilter(e => e.age, ComparisonOperator.Equal, employee.age));
        
    //Assert
    expect(odataQueryMaker.generate()).toEqual(expectValue);
});

test('Filter with array value', () => {
    //Arrange
    const expectValue = '$filter=(salary eq 4000 or salary eq 3000)';

    //Act
    odataQueryMaker.clear();
    odataQueryMaker
        .filter(f => f.valueFilter(e => e.salary, ComparisonOperator.Equal, [4000, 3000]));
        
    //Assert
    expect(odataQueryMaker.generate()).toEqual(expectValue);
});

test('Filter with array string', () => {
    //Arrange
    const expectValue = '$filter=(contains(name, \'Will\') or contains(name, \'Sam\'))';

    //Act
    odataQueryMaker.clear();
    odataQueryMaker
        .filter(f => f.stringFilter(e => e.name, StringOperator.Contains, ['Will', 'Sam']));
        
    //Assert
    expect(odataQueryMaker.generate()).toEqual(expectValue);
});
