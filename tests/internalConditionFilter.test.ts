import { OdataQueryMaker } from "../src/odata-query-maker";
import { StringOperator } from "../src/enums/string-operator";
import { ComparisonOperator } from "../src/enums/comparison-operator";
import { Employee } from "./employee";
import { EmployeeData } from "./employee-data";

const employee = new EmployeeData().employee;
let oDataQueryBuilder = new OdataQueryMaker<Employee>();

test('Filter with string operator and internal condition (value or string operator)', () => {
    //Arrange
    const expectValue = '$filter=contains(name, \'Will\') and (salary gt 5000 or startswith(departament/name, \'Sales\'))';

    //Act
    oDataQueryBuilder.clear();
    oDataQueryBuilder
        .filter(f => f.stringFilter(e => e.name, StringOperator.Contains, employee.name)
                        .andFilter(f2 => f2.valueFilter(e => e.salary, ComparisonOperator.Greater, employee.salary).or()
                                            .stringFilter(e => e.departament.name, StringOperator.StartsWith, employee.departament.name))
                        );
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('Removing unecessary \'and\' and not use \'or\' thanks to null value from filter 1', () => {
    //Arrange
    const expectValue = '$filter=contains(name, \'Will\') and (startswith(departament/name, \'Sales\'))';

    //Act
    oDataQueryBuilder.clear();
    oDataQueryBuilder
        .filter(f => f.stringFilter(e => e.name, StringOperator.Contains, employee.name)
                        .andFilter(f2 => f2.and().valueFilter(e => e.age, ComparisonOperator.Greater, employee.age).or()
                                            .stringFilter(e => e.departament.name, StringOperator.StartsWith, employee.departament.name))
                        );
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('Removing unecessary \'and\' and not use \'or\' thanks to null value from filter 2', () => {
    //Arrange
    const expectValue = '$filter=contains(name, \'Will\')';

    //Act
    oDataQueryBuilder.clear();
    oDataQueryBuilder
        .filter(f => f.stringFilter(e => e.name, StringOperator.Contains, employee.name)
                        .andFilter(f2 => f2.and().valueFilter(e => e.age, ComparisonOperator.Greater, employee.age).or())
                        );
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('Filter with null condition and internal filter', () => {
    //Arrange
    const expectValue = '$filter=(salary eq 5000)';

    //Act
    oDataQueryBuilder.clear();
    oDataQueryBuilder
        .filter(f => f
                .valueFilter(e => e.age, ComparisonOperator.Equal, employee.age)
                .andFilter(f2 => f2
                    .valueFilter(e => e.salary, ComparisonOperator.Equal, employee.salary)
            )
        );
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});