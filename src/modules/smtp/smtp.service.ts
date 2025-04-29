import { Injectable, Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import * as process from 'node:process'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SmtpService {
    private transporter: nodemailer.Transporter
    private readonly logger: Logger = new Logger('SmtpService')
    constructor(private readonly configService: ConfigService) {
        this.createTransporter()
    }

    private createTransporter() {
        this.transporter = nodemailer.createTransport({
            service: this.configService.get<string>('SMTP_SERVICE'),
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASS')
            }
        })
    }

    async send(email: string, text: string, subject: string) {
        const mailOptions = {
            from: this.configService.get<string>('SMTP_USER'),
            to: email,
            subject,
            text
        }

        try {
            await this.transporter.sendMail(mailOptions)
            return {
                success: true
            }
        } catch (error) {
            this.logger.error(error)
            return null
        }
    }
}
