import { ComparisonOperator } from '../enums/comparisonOperator';
import { StringOperator } from '../enums/stringOperator';
import { BuilderOptions } from '../interfaces/builderOptions';
import { PropertyClass, PropertyType } from './propertyClass';

type filterExpressionType = string | number | boolean | Date;

export class FilterBuilder<T> {
    
    private filters: string[] = [];

    constructor(
        private options: BuilderOptions) {}

    public valueFilter(field: PropertyType<T>, operator: ComparisonOperator, value: filterExpressionType): this {
        if (!this.options.ignoreNull || value) {
            this.filters.push(`${PropertyClass.getPropertyName(field)} ${operator} ${this.getValue(value)}`);
        }
        this.verifyLastElement(value);

        return this;
    }

    public stringFilter(field: PropertyType<T>, operator: StringOperator, value: string): this {
        if (!this.options.ignoreNull || value) {
            this.filters.push(`${operator}(${PropertyClass.getPropertyName(field)}, '${value}')`);
        }
        this.verifyLastElement(value);

        return this;
    }

    private verifyLastElement(value: any): void {
        if (this.options.ignoreNull && !value) {
            const lastElement = this.filters.pop();
            if (lastElement !== undefined &&
                lastElement !== 'and' &&
                lastElement !== 'or') {
                this.filters.push(lastElement);
            }
        }
    }

    public freeFilter(text: string): this {
        if (!this.options.ignoreNull || text) {
            this.filters.push(text);
        }
        this.verifyLastElement(text);
        return this;
    }

    private addLogicalOperator(logical: string): this {
        if (this.filters.length > 0)
            this.filters.push(logical);
        return this;
    }

    public and(): this {
        return this.addLogicalOperator('and');
    }

    public or(): this {
        return this.addLogicalOperator('or');
    }

    andFilter = (predicate: (filter: FilterBuilder<T>) => FilterBuilder<T>) => {
        return this.logicalFilter('and', predicate);
    };

    orFilter = (predicate: (filter: FilterBuilder<T>) => FilterBuilder<T>) => {
        return this.logicalFilter('or', predicate);
    };

    private logicalFilter(logical: string, predicate: (filter: FilterBuilder<T>) => FilterBuilder<T>) {
        let innerFilter = predicate(new FilterBuilder(this.options)).toQuery()
        
        if (innerFilter){
            this.addLogicalOperator(logical);
            this.filters.push(`(${innerFilter})`);
        }

        return this;
    }

    public toQuery(): string {
        if (!this.filters || this.filters.length < 1) return '';
        return this.filters.map(f => f).join(' ');
    }

    private getValue(value: filterExpressionType): string {
        let type: string = typeof value;
        if (value instanceof Date) type = 'date';

        switch (type) {
        case 'string':
            return `'${value}'`;
        case 'date':
            return `${(value as Date).toISOString()}`;
        default:
            return `${value}`;
        }
    }
}