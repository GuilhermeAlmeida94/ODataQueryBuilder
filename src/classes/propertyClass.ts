
export type PropertyType<T> = (obj: T) => string | number | boolean | null;
export type PropertyObjectType<T> = (obj: T) => object;

export class PropertyClass {
    public static getPropertyName<T>(property: PropertyType<T>): string {
        let propertyName: string;
        let matches = /function\s*\((\w+)\)\s*\{\s*return \1[.](\w.+);*\s*\}/g.exec(property.toString());
        propertyName = matches![2];
        let propertyNameTransformed = propertyName.substr(0, propertyName.length-2).replace('.', '/');
        return propertyNameTransformed;
    }

    public static getPropertyObjectName<T>(propertyObject: PropertyObjectType<T>): string {
        let propertyName: string;
        let matches = /function\s*\((\w+)\)\s*\{\s*return \1[.](\w.+);*\s*\}/g.exec(propertyObject.toString());
        propertyName = matches![2];
        let propertyNameTransformed = propertyName.substr(0, propertyName.length-2).replace('.', '/');
        return propertyNameTransformed;
    }
}
