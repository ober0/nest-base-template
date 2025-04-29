import { ApiProperty } from '@nestjs/swagger'
import { BaseResponse } from 'src/common/base/response'

export class PermissionResponseDto extends BaseResponse {
    @ApiProperty()
    id: string

    @ApiProperty()
    name: string
}
