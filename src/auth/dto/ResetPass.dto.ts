import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDTO {
    @ApiProperty()
    token: string;
    @ApiProperty() 
    password: string;
    @ApiProperty() 
    password_confirm: string;
}