import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entitys/User';
import { createHash } from 'node:crypto';
// 加密密码
function encryptPassword(password: string) {
  return createHash('sha256').update(password).digest('hex');
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const findUser = await this.userRepository.findOne({
      where: {
        loginId: createUserDto.loginId,
      },
    });
    if (findUser) {
      throw new Error('账号已存在');
    }
    const user = this.userRepository.create(createUserDto);
    user.password = encryptPassword(user.password);
    const res = await this.userRepository.save(user);
    if (!res) {
      throw new Error('注册失败');
    }
    return {
      msg: '注册成功',
      success: true,
    };
  }

  async findOne(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        loginId: createUserDto.loginId,
        password: encryptPassword(createUserDto.password),
      },
      select: ['id', 'username', 'avatar', 'nickname', 'loginId'],
    });
    return user;
  }

  /**
   * 更新用户信息
   * @param updateUserDto 更新用户信息 dto
   * @param userId 用户 id
   * @returns 更新结果
   */
  async updateProfile(updateUserDto: CreateUserDto, userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error('用户不存在');
    }
    const res = await this.userRepository.update(user.id, updateUserDto);
    if (!res) {
      throw new Error('更新失败');
    }
    return {
      msg: '更新成功',
      success: true,
    };
  }
}
