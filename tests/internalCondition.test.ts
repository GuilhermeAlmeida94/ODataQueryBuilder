import { ODataQueryBuilder } from "../src/classes/oDataQueryBuilder";
import { StringOperator } from "../src/enums/stringOperator";
import { ComparisonOperator } from "../src/enums/comparisonOperator";

const employee = {name: 'Will', salary: 5000, age: null, departament: {name: 'Sales'}};

test('String operator and internal condtestion (value or string operator)', () => {
    //Arrange
    const expectValue = '$filter=name.contains(\'Will\') and (salary gt 5000 or departament/name.startswith(\'Sales\'))'
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