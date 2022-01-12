import { ApiProperty } from "@nestjs/swagger";

export class UserDTO {
    @ApiProperty()
    name: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
}