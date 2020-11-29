import { ODataQueryBuilder } from "../src/classes/oDataQueryBuilder";
import { StringOperator } from "../src/enums/stringOperator";
import { ComparisonOperator } from "../src/enums/comparisonOperator";

const employee = {name: 'Will', salary: 5000, age: null, departament: {name: 'Sales'}};

test('Filter with string operator and internal condition (value or string operator)', () => {
    //Arrange
    const expectValue = '$filter=name.contains(\'Will\') and (salary gt 5000 or departament/name.startswith(\'Sales\'))';
    let oDataQueryBuilder = new ODataQueryBuilder();

    //Act
    oDataQueryBuilder
        .filter(f => f.stringFilter('name', StringOperator.Contains, employee.name)
                        .andFilter(f2 => f2.valueFilter('salary', ComparisonOperator.Greater, employee.salary).or()
                                            .stringFilter('departament/name', StringOperator.StartsWith, employee.departament.name))
                        );
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('Removing unecessary \'and\' and not use \'or\' thanks to null value from filter', () => {
    //Arrange
    const expectValue = '$filter=name.contains(\'Will\') and (departament/name.startswith(\'Sales\'))';
    let oDataQueryBuilder = new ODataQueryBuilder();

    //Act
    oDataQueryBuilder
        .filter(f => f.stringFilter('name', StringOperator.Contains, employee.name)
                        .andFilter(f2 => f2.and().valueFilter('age', ComparisonOperator.Greater, employee.age).or()
                                            .stringFilter('departament/name', StringOperator.StartsWith, employee.departament.name))
                        );
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('Removing unecessary \'and\' and not use \'or\' thanks to null value from filter', () => {
    //Arrange
    const expectValue = '$filter=name.contains(\'Will\')';
    let oDataQueryBuilder = new ODataQueryBuilder();

    //Act
    oDataQueryBuilder
        .filter(f => f.stringFilter('name', StringOperator.Contains, employee.name)
                        .andFilter(f2 => f2.and().valueFilter('age', ComparisonOperator.Greater, employee.age).or())
                        );
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});