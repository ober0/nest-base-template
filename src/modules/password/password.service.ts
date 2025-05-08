import * as bcrypt from 'bcryptjs'
import { BadRequestException, Injectable } from '@nestjs/common'
import { getCurrentLang } from '../../i18n/utils'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class PasswordService {
    constructor(private readonly i18n: I18nService) {}

    async hashPassword(password: string): Promise<string> {
        await this.validate(password)

        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password, salt)
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword)
    }

    async validate(password: string): Promise<boolean> {
        // При необходимости валидировать пароль вернуть
        //
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
        //
        // if (!passwordRegex.test(password)) {
        //     throw new BadRequestException(
        //         this.i18n.t('errors.password.invalid', {
        //             lang: getCurrentLang()
        //         })
        //     )
        // }
        return true
    }
}
