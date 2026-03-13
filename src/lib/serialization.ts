
export function serializeData<T>(data: T): any {
    if (data === null || data === undefined) {
        return data;
    }

    // Handle Arrays
    if (Array.isArray(data)) {
        return data.map(item => serializeData(item));
    }

    // Handle Dates
    if (data instanceof Date) {
        return data.toISOString();
    }

    // Handle BigInt
    if (typeof data === 'bigint') {
        return data.toString();
    }

    // Handle Objects
    if (typeof data === 'object') {
        const asAny = data as any;

        // Check for Decimal (Prisma/Decimal.js)
        // It usually has toNumber() or can be identified by properties like d, e, s
        if (typeof asAny.toNumber === 'function') {
            return asAny.toNumber();
        }

        // Generic Object recursion
        const serialized: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                serialized[key] = serializeData(asAny[key]);
            }
        }
        return serialized;
    }

    return data;
}
