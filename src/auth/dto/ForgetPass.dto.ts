import { ApiProperty } from "@nestjs/swagger";

export class ForgetPasswordDTO {
    @ApiProperty()
    email: string;
}