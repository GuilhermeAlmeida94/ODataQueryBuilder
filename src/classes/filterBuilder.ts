import { QueryFragment } from './queryFragment'
import { ODataOption } from '../enums/oDataOption'
import { ComparisonOperator } from '../enums/comparisonOperator';
import { StringOperator } from '../enums/stringOperator';
import { BuilderOptions } from '../interfaces/builderOptions';

type filterExpressionType = string | number | boolean | Date;

export class FilterBuilder {
    
    private filters: QueryFragment[] = [];

    constructor(
        private options: BuilderOptions) {}

    public valueFilter(field: string, operator: ComparisonOperator, value: filterExpressionType): this {
        if (!this.options.ignoreNull || value) {
            this.filters.push(
                new QueryFragment(ODataOption.Filter, `${field} ${operator} ${this.getValue(value)}`)
            );
        }
        return this;
    }

    public stringFilter(field: string, operator: StringOperator, value: string): this {
        if (!this.options.ignoreNull || value) {
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
        if (!checkLength || this.filters.length > 0)
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
            new QueryFragment(ODataOption.Filter, `(${predicate(new FilterBuilder(this.options)).toQuery()})`)
        );
        return this;
    };
    orFilter = (predicate: (filter: FilterBuilder) => FilterBuilder) => {
        this.or(false);
        this.filters.push(
            new QueryFragment(ODataOption.Filter, `(${predicate(new FilterBuilder(this.options)).toQuery()})`)
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