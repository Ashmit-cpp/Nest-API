import { ApiProperty } from '@nestjs/swagger';

export class createUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
