import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/user.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entitys/User';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(createUserDto: CreateUserDto) {
    const user = await this.userService.findOne(createUserDto);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    const payload = {
      loginId: user.loginId,
      id: user.id,
      avatar: user.avatar,
      nickname: user.nickname,
      username: user.username,
    };
    return {
      token: await this.jwtService.signAsync(payload),
      success: true,
      msg: '登录成功',
    };
  }
  // 获取当前用户信息
  async getProfile(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    return {
      ...user,
    };
  }
}
