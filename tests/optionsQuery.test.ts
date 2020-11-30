import { ODataQueryBuilder } from "../src/classes/oDataQueryBuilder";
import { StringOperator } from "../src/enums/stringOperator";
import { Employee } from "./employee";

test('Select, top and multiple order by', () => {
    //Arrange
    const expectValue = '$top=5&$skip=1&$orderby=salary asc,age desc&$select=name,departament/name';
    let oDataQueryBuilder = new ODataQueryBuilder<Employee>();

    //Act
    oDataQueryBuilder.select(e => e.name, e => e.departament.name)
                     .skip(1)
                     .top(5)
                     .orderBy(e => e.salary)
                     .orderByDesc(e => e.age);
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('Simple filter and count', () => {
    //Arrange
    const expectValue = '$count=true&$filter=contains(name, \'Will\')';
    let oDataQueryBuilder = new ODataQueryBuilder<Employee>();

    //Act
    oDataQueryBuilder.filter(f => f.stringFilter(e => e.name, StringOperator.Contains, 'Will'))
                     .count();
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});

test('Expand', () => {
    //Arrange
    const expectValue = '$expand=departament($count=true)';
    let oDataQueryBuilder = new ODataQueryBuilder<Employee>();

    //Act
    oDataQueryBuilder.expand(e => e.departament, dep => dep.count());
        
    //Assert
    expect(oDataQueryBuilder.generate()).toEqual(expectValue);
});