import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactDTO {
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  country: string;
  @ApiProperty()
  is_favorite: boolean;
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  @ApiPropertyOptional()
  avatar_path: any;
}
