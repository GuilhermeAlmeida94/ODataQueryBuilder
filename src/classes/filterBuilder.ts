import { QueryFragment } from './queryFragment'
import { ODataOption } from '../enums/oDataOption'
import { ValueOperator } from '../enums/valueOperator';
import { StringOperator } from '../enums/stringOperator';

type filterExpressionType = string | number | boolean | Date;

export class FilterBuilder {
    
    private filters: QueryFragment[] = [];

    public valueFilter(field: string, operator: ValueOperator, value: filterExpressionType): this {
        if (value !== null) {
            this.filters.push(
                new QueryFragment(ODataOption.Filter, `${field} ${operator} ${this.getValue(value)}`)
            );
        }
        return this;
    }

    public stringFilter(field: string, operator: StringOperator, value: string): this {
        if (value !== null) {
            this.filters.push(
                new QueryFragment(ODataOption.Filter, `${field}.${operator}('${value}')`)
            );
        }
        return this;
    }

    public freeFilter(text: string): this {
        this.filters.push(new QueryFragment(ODataOption.Filter, text));
        return this;
    }

    private addLogic(phrase: string, checkLength: boolean): this {
        if (!checkLength || this.filters.length > 1)
            this.filters.push(new QueryFragment(ODataOption.Filter, phrase));
        return this;
    }

    public and(checkLength = true): this {
        return this.addLogic('and', checkLength);
    }

    public or(checkLength = true): this {
        return this.addLogic('or', checkLength);
    }

    andFilter = (predicate: (filter: FilterBuilder) => FilterBuilder) => {
        this.and(false);
        this.filters.push(
            new QueryFragment(ODataOption.Filter, `(${predicate(new FilterBuilder()).toQuery()})`)
        );
        return this;
    };
    orFilter = (predicate: (filter: FilterBuilder) => FilterBuilder) => {
        this.or(false);
        this.filters.push(
            new QueryFragment(ODataOption.Filter, `(${predicate(new FilterBuilder()).toQuery()})`)
        );
        return this;
    };

    public toQuery(): string {
        if (!this.filters || this.filters.length < 1) return '';
        return this.filters.map(f => f.value).join(' ');
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