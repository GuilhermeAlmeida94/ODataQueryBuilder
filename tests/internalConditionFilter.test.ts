import { ODataQueryBuilder } from "../src/classes/oDataQueryBuilder";
import { StringOperator } from "../src/enums/stringOperator";
import { ComparisonOperator } from "../src/enums/comparisonOperator";
import { Employee } from "./employee";

const employee: Employee = {name: 'Will', salary: 5000, age: null, departament: {name: 'Sales'}};
let oDataQueryBuilder = new ODataQueryBuilder<Employee>();

test('Filter with string operator and internal condition (value or string operator)', () => {
    //Arrange
    const expectValue = '$filter=name.contains(\'Will\') and (salary gt 5000 or departament/name.startswith(\'Sales\'))';

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

test('Removing unecessary \'and\' and not use \'or\' thanks to null value from filter', () => {
    //Arrange
    const expectValue = '$filter=name.contains(\'Will\') and (departament/name.startswith(\'Sales\'))';

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

test('Removing unecessary \'and\' and not use \'or\' thanks to null value from filter', () => {
    //Arrange
    const expectValue = '$filter=name.contains(\'Will\')';

    //Act
    oDataQueryBuilder.clear();
    oDataQueryBuilder
        .filter(f => f.stringFilter(e => e.name, StringOperator.Contains, employee.name)
                        .andFilter(f2 => f2.and().valueFilter(e => e.age, ComparisonOperator.Greater, employee.age).or())
                        );
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});