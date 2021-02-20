import { ComparisonOperator } from './enums/comparison-operator';
import { StringOperator } from './enums/string-operator';
import { OdataQueryOptions } from './interfaces/odata-query-options';
import { PropertyClass, PropertyType } from './property-class';

type valueFilterType = string | number | boolean | Date | Array<valueFilterType>;

export class FilterBuilder<T> {

    private filters: string[] = [];

    constructor(
        private options: OdataQueryOptions) {}

    public valueFilter(field: PropertyType<T>, operator: ComparisonOperator, value: valueFilterType): this {
        if (!this.options.ignoreNull || value !== null) {
            if (!Array.isArray(value)) {
                this.filters.push(`${PropertyClass.getPropertyName(field)} ${operator} ${this.getValue(value)}`);
            }
            else {
                const innerFilter = new FilterBuilder<T>(this.options);
                for (const item of value) {
                    innerFilter.valueFilter(field, operator, item).or();
                }
                this.filters.push(`(${innerFilter.generate()})`);
            }
        }
        this.verifyLastElement();

        return this;
    }

    public stringFilter(field: PropertyType<T>, operator: StringOperator, value: string | Array<string>): this {
        if (!this.options.ignoreNull || value) {
            if (!Array.isArray(value)) {
                this.filters.push(`${operator}(${PropertyClass.getPropertyName(field)}, '${value.trim()}')`);
            }
            else {
                const innerFilter = new FilterBuilder<T>(this.options);
                for (const item of value) {
                    innerFilter.stringFilter(field, operator, item).or();
                }
                this.filters.push(`(${innerFilter.generate()})`);
            }
        }
        this.verifyLastElement();

        return this;
    }

    private verifyLastElement(): void {
            const lastElement = this.filters.pop();
            if (lastElement !== undefined &&
                lastElement !== 'and' &&
                lastElement !== 'or') {
                this.filters.push(lastElement);
            }
    }

    public freeFilter(text: string): this {
        if (!this.options.ignoreNull || text) {
            this.filters.push(text);
        }
        this.verifyLastElement();
        return this;
    }

    private addLogicalOperator(logical: string): this {
        if (this.filters.length > 0) {
            this.filters.push(logical);
        }
        return this;
    }

    public and(): this {
        return this.addLogicalOperator('and');
    }

    public or(): this {
        return this.addLogicalOperator('or');
    }

    public andFilter = (predicate: (filter: FilterBuilder<T>) => FilterBuilder<T>) => {
        return this.logicalFilter('and', predicate);
    }

    public orFilter = (predicate: (filter: FilterBuilder<T>) => FilterBuilder<T>) => {
        return this.logicalFilter('or', predicate);
    }

    private logicalFilter(logical: string, predicate: (filter: FilterBuilder<T>) => FilterBuilder<T>): this {
        const innerFilter = predicate(new FilterBuilder(this.options)).generate();

        if (innerFilter){
            this.addLogicalOperator(logical);
            this.filters.push(`(${innerFilter})`);
        }

        return this;
    }

    private isGuid(value: string): boolean {
        value = value.toLowerCase();

        const regex = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i;
        const match = regex.exec(value);

        return match != null;
    }

    private getValue(value: valueFilterType): any {
        let type: string = typeof value;
        if (value instanceof Date) { type = 'date'; }

        switch (type) {
        case 'string':
           return this.isGuid(value.toString().trim()) ?  `${value}` : `'${value}'`;
        case 'date':
            return `${(value as Date).toISOString()}`;
        default:
            return `${value}`;
        }
    }

    public generate(): string {
        if (!this.filters || this.filters.length < 1) { return ''; }
        this.verifyLastElement();
        return this.filters.map(f => f).join(' ');
    }
}
