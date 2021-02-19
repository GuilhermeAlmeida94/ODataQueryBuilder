import { OdataQueryMaker } from "../src/odata-query-maker";
import { StringOperator } from "../src/enums/string-operator";
import { Employee } from "./employee";

test('Select, top and multiple order by', () => {
    //Arrange
    const expectValue = '$top=5&$skip=1&$orderby=salary asc,age desc&$select=name,departament/name';
    let odataQueryMaker = new OdataQueryMaker<Employee>();

    //Act
    odataQueryMaker.select(e => e.name, e => e.departament.name)
                     .skip(1)
                     .top(5)
                     .orderBy(e => e.salary)
                     .orderByDesc(e => e.age);
        
    //Assert
    expect(odataQueryMaker.generate()).toEqual(expectValue);
});

test('Simple filter and count', () => {
    //Arrange
    const expectValue = '$count=true&$filter=contains(name, \'Will\')';
    let odataQueryMaker = new OdataQueryMaker<Employee>();

    //Act
    odataQueryMaker.filter(f => f.stringFilter(e => e.name, StringOperator.Contains, 'Will'))
                     .count();
        
    //Assert
    expect(odataQueryMaker.generate()).toEqual(expectValue);
});

test('Expand', () => {
    //Arrange
    const expectValue = '$expand=departament($count=true)';
    let odataQueryMaker = new OdataQueryMaker<Employee>();

    //Act
    odataQueryMaker.expand(e => e.departament, dep => dep.count());
        
    //Assert
    expect(odataQueryMaker.generate()).toEqual(expectValue);
});