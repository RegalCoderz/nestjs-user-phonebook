import { ApiProperty } from "@nestjs/swagger";

export class SignInDTO {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
}