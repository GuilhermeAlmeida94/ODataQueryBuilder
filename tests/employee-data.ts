import { Employee } from "./employee";

export class EmployeeData {
    public employee: Employee;
    constructor(){
        this.employee = 
        {
            name: 'Will',
            salary: 5000,
            age: null,
            motherName: null,
            fatherName: null,
            hasChildrens: false,
            departament:
            {
                name: 'Sales'
            },
            certificates: ['Typing']
        };
    }
}
