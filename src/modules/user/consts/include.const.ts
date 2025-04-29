export const USER_INCLUDE = {
    include: {
        role: {
            select: {
                rolePermissions: {
                    select: {
                        permission: true
                    }
                },
                name: true,
                id: true
            }
        },
        person: true,
        password: true
    }
}
