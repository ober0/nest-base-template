import { Logger } from '@nestjs/common'
import 'reflect-metadata'
import { RedisService } from '../../modules/redis/redis.service'
import { isValidDto } from '../utils/is-valid-dto'

export class CacheableOptions {
    keyPrefix: string
    ttl?: number
    includedIndexes?: number[]
    withUser?: boolean
    userIndex?: number
}

const logger: Logger = new Logger('CacheableOptions')

export function Cacheable(options: CacheableOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value

        const wrappedMethod = async function (...args: any[]) {
            const redisService: RedisService = this.redisService
            if (!redisService) throw new Error('Redis service required')

            let acceptedArgs: any[]
            let keySuffix: string
            let cacheKey: string

            let user: any //JwtPayloadDto
            if (options.withUser) {
                user = args.at(options?.userIndex ?? 0)
                // await isValidDto(JwtPayloadDto, user)
                acceptedArgs = args.filter((item, index) => options.includedIndexes?.includes(index) && item.index !== 0)

                keySuffix = JSON.stringify(acceptedArgs)
                cacheKey = `${options.keyPrefix}:user-uuid:${user.uuid}:${keySuffix}`
            } else {
                acceptedArgs = args.filter((item, index) => options.includedIndexes?.includes(index))

                keySuffix = JSON.stringify(acceptedArgs)
                cacheKey = `${options.keyPrefix}:all:${keySuffix}`
            }

            const cached = await redisService.get(cacheKey)
            if (cached) {
                logger.log(`Данные по ключу ${cacheKey} найдены в кэше`)
                return JSON.parse(cached.toString())
            }

            const result = await originalMethod.apply(this, args)
            await redisService.set(cacheKey, JSON.stringify(result), options.ttl ?? 3600)
            return result
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
