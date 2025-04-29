export function mapSearch<T>(filters: T, excludedValues: string[] = [], query?: string, queryFields: string[] = []): any {
    const mappedFilters: Record<string, any> = {}

    if (filters) {
        for (const [key, value] of Object.entries(filters)) {
            if (excludedValues.includes(key)) continue

            if (typeof value === 'string') {
                mappedFilters[key] = { contains: value.toLowerCase(), mode: 'insensitive' }
            } else {
                mappedFilters[key] = value
            }
        }
    }

    const andConditions: any[] = []

    if (Object.keys(mappedFilters).length > 0) {
        andConditions.push(mappedFilters)
    }

    if (query && queryFields.length > 0) {
        const queryConditions = queryFields.map((fieldPath) => {
            const condition = fieldPath
                .split('.')
                .reverse()
                .reduce((acc, key) => ({ [key]: acc }), {
                    contains: query.toLowerCase(),
                    mode: 'insensitive'
                } as any)

            return condition
        })

        andConditions.push({ OR: queryConditions })
    }

    return andConditions.length > 0 ? { AND: andConditions } : {}
}
