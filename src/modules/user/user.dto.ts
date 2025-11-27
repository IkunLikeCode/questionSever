import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  // 登录账号
  @IsNotEmpty({ message: '登录账号不能为空' })
  @MinLength(2, { message: '登录账号长度不能小于2' })
  @MaxLength(12, { message: '登录账号长度不能大于12' })
  loginId: string;
  username: string;
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能小于6' })
  @MaxLength(12, { message: '密码长度不能大于12' })
  password: string;
  // 头像
  avatar: string;
  // nickname
  nickname: string;
}
