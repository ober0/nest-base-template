import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { InternalServerErrorException } from '@nestjs/common'

export async function isValidDto<T extends object>(dtoClass: new () => T, obj: object): Promise<void> {
    const instance = plainToInstance(dtoClass, obj)
    const errors = await validate(instance)
    if (errors.length !== 0) {
        throw new InternalServerErrorException('Не соответствие dto. Попробуйте еще раз, или обратитесь в поддержку')
    }
}
