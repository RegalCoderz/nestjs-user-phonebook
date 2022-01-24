import { ApiProperty } from '@nestjs/swagger';

export class UserDTO {
  @ApiProperty({
    example: 'Muhammad Zeeshan',
    description: 'User name',
  })
  name: string;

  @ApiProperty({
    example: 'zshaan',
    description: 'User username',
  })
  username: string;

  @ApiProperty({
    example: 'muhammadzeeshan@gmail.com',
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'User password',
  })
  password: string;
}