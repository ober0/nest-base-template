export enum PermissionEnum {
    UserCreate = 'user-create',
    UserGet = 'user-get',
    UserGetAll = 'user-get-all',
    UserUpdate = 'user-update',
    UserDelete = 'user-delete',

    RoleCreate = 'role-create',
    RoleGet = 'role-get',
    RoleGetAll = 'role-get-all',
    RoleUpdate = 'role-update',
    RoleDelete = 'role-delete',

    RolePermissionCreate = 'role-permission-create',
    RolePermissionGet = 'role-permission-get',
    RolePermissionGetAll = 'role-permission-get-all',
    RolePermissionUpdate = 'role-permission-update',
    RolePermissionDelete = 'role-permission-delete',

    PermissionCreate = 'plan-create',
    PermissionGet = 'plan-get',
    PermissionGetAll = 'plan-get-all',
    PermissionUpdate = 'plan-update',
    PermissionDelete = 'plan-delete'
}

export const PermissionDescriptions: Record<any, string> = {
    // Роли
    [PermissionEnum.RoleCreate]: 'Создание роли',
    [PermissionEnum.RoleGet]: 'Получение информации о роли',
    [PermissionEnum.RoleGetAll]: 'Получение списка ролей',
    [PermissionEnum.RoleUpdate]: 'Обновление роли',
    [PermissionEnum.RoleDelete]: 'Удаление роли',

    // Связь ролей и разрешений
    [PermissionEnum.RolePermissionCreate]: 'Создание связи роли и разрешения',
    [PermissionEnum.RolePermissionGet]: 'Получение информации о связи роли и разрешения',
    [PermissionEnum.RolePermissionGetAll]: 'Получение списка связей ролей и разрешений',
    [PermissionEnum.RolePermissionUpdate]: 'Обновление связи роли и разрешения',
    [PermissionEnum.RolePermissionDelete]: 'Удаление связи роли и разрешения',

    // разрешения
    [PermissionEnum.PermissionCreate]: 'Создание разрешений',
    [PermissionEnum.PermissionGet]: 'Получение разрешений',
    [PermissionEnum.PermissionGetAll]: 'Получение всех разрешений',
    [PermissionEnum.PermissionUpdate]: 'Обновление разрешений',
    [PermissionEnum.PermissionDelete]: 'Удаление разрешений'
}
