import { Logger } from '@nestjs/common'
import 'reflect-metadata'
import { RedisService } from '../../modules/redis/redis.service'

export class ClearCacheOptions {
    keyPrefix: string | string[]
    withUser?: boolean
    userIndex?: number
}

const logger: Logger = new Logger('ClearCacheOptions')

async function deleteCache(redisService: RedisService, prefix: string, user?: any) {
    let cacheKey: string
    if (user) {
        // await isValidDto(UserDo, user)
        cacheKey = `${prefix}:user-uuid:${user.uuid}:*`
    } else {
        cacheKey = `${prefix}:all:*`
    }

    const cachedKeys: string[] = await redisService.scanKeysByPrefix(cacheKey)
    if (cachedKeys) {
        await redisService.del(cachedKeys)
        logger.log(`Кэш для ключей ${JSON.stringify(cachedKeys)} удален`)
    }
}

export function ClearCache(options: ClearCacheOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value

        const wrappedMethod = async function (...args: any[]) {
            const redisService: RedisService = this.redisService

            const prefixes = Array.isArray(options.keyPrefix) ? options.keyPrefix : [options.keyPrefix]

            await Promise.all(prefixes.map((prefix) => deleteCache(redisService, prefix, args?.at(options?.userIndex ?? 0) ?? null)))

            return await originalMethod.apply(this, args)
        }

        const metadataKeys = Reflect.getMetadataKeys(originalMethod)
        for (const key of metadataKeys) {
            const value = Reflect.getMetadata(key, originalMethod)
            Reflect.defineMetadata(key, value, wrappedMethod)
        }

        descriptor.value = wrappedMethod
        return descriptor
    }
}
