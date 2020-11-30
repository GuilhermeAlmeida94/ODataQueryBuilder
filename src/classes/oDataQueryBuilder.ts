import { OrderBy } from "../enums/orderByEnum";
import { FilterBuilder } from './filterBuilder';
import { BuilderOptions } from '../interfaces/builderOptions';
import { PropertyClass, PropertyObjectType, PropertyType } from "./propertyClass";

export class ODataQueryBuilder<T> {
    private selects: string[] = [];
    private filters: string[] = [];
    private orderBys: string[] = [];
    private expands: ODataQueryBuilder<T>[] = [];
    private skipValue: number;
    private topValue: number;
    private doCount: boolean;

    constructor(
        private options?: BuilderOptions,
        private extendedPropName?: string) {
            if (!this.options)
                this.options = {ignoreNull: true};
        }

    public orderBy(field: PropertyType<T>): ODataQueryBuilder<T> {
        return this.orderByInternal(field, OrderBy.Asc)
    }

    public orderByDesc(field: PropertyType<T>): ODataQueryBuilder<T> {
        return this.orderByInternal(field, OrderBy.Desc)
    }

    private orderByInternal(field: PropertyType<T>, order: OrderBy): ODataQueryBuilder<T> {
        if (!field || field.length == 0)
            return this;

        return this.freeOrderBy(`${PropertyClass.getPropertyName(field)} ${order}`);
    }

    public freeOrderBy(orderBy: string): ODataQueryBuilder<T> {
        this.orderBys.push(orderBy);

        return this;
    }

    public expand(field: PropertyObjectType<T>, func?: (query: ODataQueryBuilder<T>) => void, options?: BuilderOptions): ODataQueryBuilder<T> {
        if (options)
            options = this.options;

        let expandQuery = new ODataQueryBuilder<T>(options, PropertyClass.getPropertyObjectName(field));

        if (func !== null) {
            func(expandQuery);
        }

        this.expands.push(expandQuery);

        return this;
    }

    public filter(predicate: (filter: FilterBuilder<T>) => FilterBuilder<T>): this {
        if (this.filters.length > 1)
            this.filters.push('and');

        this.filters.push(
            predicate(new FilterBuilder(this.options)).toQuery()
        );
        return this;
    };

    public skip(skip: number): ODataQueryBuilder<T> {
        this.skipValue = skip;
        return this;
    }

    public top(top: number): ODataQueryBuilder<T> {
        this.topValue = top;
        return this;
    }

    public count(): ODataQueryBuilder<T> {
        this.doCount = true;
        return this;
    }

    public select(...fields: PropertyType<T>[]): ODataQueryBuilder<T> {
        let selects: string[] = [];
        for (let field of fields)
            selects.push(PropertyClass.getPropertyName(field));
        this.selects = selects;
        return this;
    }

    public freeSelect(...fields: string[]): ODataQueryBuilder<T> {
        this.selects = fields;
        return this;
    }

    private static checkAndAppend(result: string, prefix: string, delimiter: string, variable: any): string {
        if (variable == null)
            return result;

        if (typeof variable == "number" && variable == 0) {
            return result;
        }

        if (typeof variable == "boolean" && !variable) {
            return result;
        }

        if (variable)
            return ODataQueryBuilder.append(result, prefix, delimiter, variable);

        return result;
    }

    private static append(result: string, prefix: string, delimiter: string, variable: any): string {
        let length = result.length;

        if (length > 0)
            result = `${result}${delimiter}${prefix}=${variable}`;
        else
            result = `${prefix}=${variable}`;

        return result;
    }

    public generate(): string {
        let isExpand = this.extendedPropName != null && this.extendedPropName.length > 0;

        let resultStr = "";
        let delimiter = isExpand ? ';' : '&';

        if (this.topValue != 0) {
            resultStr = ODataQueryBuilder.checkAndAppend(resultStr, '$top', delimiter, this.topValue);
        }

        if (this.skipValue != 0) {
            resultStr = ODataQueryBuilder.checkAndAppend(resultStr, '$skip', delimiter, this.skipValue);
        }

        resultStr = ODataQueryBuilder.checkAndAppend(resultStr, '$count', delimiter, this.doCount);

        if (this.filters.length > 0) {
            resultStr = ODataQueryBuilder.checkAndAppend(resultStr, '$filter', delimiter, this.filters.join(` and `))
        }

        if (this.orderBys.length > 0) {
            resultStr = ODataQueryBuilder.checkAndAppend(resultStr, '$orderby', delimiter, this.orderBys.join(','));
        }

        if (this.selects.length > 0) {
            resultStr = ODataQueryBuilder.checkAndAppend(resultStr, '$select', delimiter, this.selects.join(','))
        }

        if (this.expands.length > 0) {
            let result = [];
            for (let item of this.expands) {
                let compiled = item.generate();

                result.push(compiled);
            }

            if (result.length > 0) {
                resultStr = ODataQueryBuilder.checkAndAppend(resultStr, '$expand', delimiter, result.join(','));
            }
        }

        if (resultStr.length > 0 && isExpand)
            resultStr = `(${resultStr})`;

        if (isExpand)
            resultStr = `${this.extendedPropName}${resultStr}`;

        return resultStr;
    }
}
