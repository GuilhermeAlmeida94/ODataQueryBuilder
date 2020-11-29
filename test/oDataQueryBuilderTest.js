"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var oDataQueryBuilder_1 = require("../src/classes/oDataQueryBuilder");
var stringOperator_1 = require("../src/enums/stringOperator");
var valueOperator_1 = require("../src/enums/valueOperator");
describe('', function () {
    var employee = { name: 'Will', salary: 5000, age: null, departament: { name: 'Sales' } };
    it('Value operator', function () {
        //Arrange
        var expectValue = '$filter=salary eq 5000';
        var oDataQueryBuilder = new oDataQueryBuilder_1.ODataQueryBuilder();
        //Act
        oDataQueryBuilder
            .filter(function (f) { return f.valueFilter('salary', valueOperator_1.ValueOperator.Equals, employee.salary); });
        //Assert
        chai_1.expect(oDataQueryBuilder.generate()).to.be.equal(expectValue);
    });
    it('String operator', function () {
        //Arrange
        var expectValue = '$filter=name.contains(\'Will\')';
        var oDataQueryBuilder = new oDataQueryBuilder_1.ODataQueryBuilder();
        //Act
        oDataQueryBuilder
            .filter(function (f) { return f.stringFilter('name', stringOperator_1.StringOperator.Contains, employee.name); });
        //Assert
        chai_1.expect(oDataQueryBuilder.generate()).to.be.equal(expectValue);
    });
    it('Value and String operator', function () {
        //Arrange
        var expectValue = '$filter=salary eq 5000 and name.contains(\'Will\')';
        var oDataQueryBuilder = new oDataQueryBuilder_1.ODataQueryBuilder();
        //Act
        oDataQueryBuilder
            .filter(function (f) { return f.valueFilter('salary', valueOperator_1.ValueOperator.Equals, employee.salary).and()
            .stringFilter('name', stringOperator_1.StringOperator.Contains, employee.name); });
        //Assert
        chai_1.expect(oDataQueryBuilder.generate()).to.be.equal(expectValue);
    });
    it('Ignore value null and String operator', function () {
        //Arrange
        var expectValue = '$filter=name.contains(\'Will\')';
        var oDataQueryBuilder = new oDataQueryBuilder_1.ODataQueryBuilder();
        //Act
        oDataQueryBuilder
            .filter(function (f) { return f.valueFilter('age', valueOperator_1.ValueOperator.Equals, employee.age).and()
            .stringFilter('name', stringOperator_1.StringOperator.Contains, employee.name); });
        //Assert
        chai_1.expect(oDataQueryBuilder.generate()).to.be.equal(expectValue);
    });
    it('Value null and String operator', function () {
        //Arrange
        var expectValue = '$filter=age eq null and name.contains(\'Will\')';
        var builderOptions = { ignoreNull: false };
        var oDataQueryBuilder = new oDataQueryBuilder_1.ODataQueryBuilder(builderOptions);
        //Act
        oDataQueryBuilder
            .filter(function (f) { return f.valueFilter('age', valueOperator_1.ValueOperator.Equals, employee.age).and()
            .stringFilter('name', stringOperator_1.StringOperator.Contains, employee.name); });
        //Assert
        chai_1.expect(oDataQueryBuilder.generate()).to.be.equal(expectValue);
    });
    it('String operator and internal condition (value or string operator)', function () {
        //Arrange
        var expectValue = '$filter=name.contains(\'Will\') and (salary gt 5000 or departament/name.startswith(\'Sales\'))';
        var oDataQueryBuilder = new oDataQueryBuilder_1.ODataQueryBuilder();
        //Act
        oDataQueryBuilder
            .filter(function (f) { return f.stringFilter('name', stringOperator_1.StringOperator.Contains, employee.name)
            .andFilter(function (f2) { return f2.valueFilter('salary', valueOperator_1.ValueOperator.Greater, employee.salary).or()
            .stringFilter('departament/name', stringOperator_1.StringOperator.StartsWith, employee.departament.name); }); });
        //Assert
        chai_1.expect(oDataQueryBuilder.generate()).to.be.equal(expectValue);
    });
});
