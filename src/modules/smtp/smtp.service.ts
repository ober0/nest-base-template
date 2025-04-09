import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import * as process from 'node:process'

@Injectable()
export class SmtpService {
    private readonly logger = new Logger('SmtpService')
    private readonly apiUrl = 'https://api.mailersend.com/v1/email'
    private readonly apiKey = process.env.MAILERSEND_API_KEY
    private readonly fromEmail = process.env.MAILERSEND_FROM_EMAIL
    private readonly fromName = process.env.MAILERSEND_FROM_NAME || 'MailerSend'

    async send(to: string, text: string, subject: string) {
        const payload = {
            from: {
                email: this.fromEmail,
                name: this.fromName
            },
            to: [
                {
                    email: to,
                    name: to
                }
            ],
            subject,
            text,
            html: `<p>${text}</p>`
        }

        try {
            await axios.post(this.apiUrl, payload, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            })

            return { success: true }
        } catch (error) {
            this.logger.error('MailerSend error:', error?.response?.data || error.message)
            return null
        }
    }
}
