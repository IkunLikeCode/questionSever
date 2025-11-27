import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Req,
  Get,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/user.dto';
import { Public } from './decorators/public.decorator';
import { ValidationPipe } from 'src/util/validation.pipe';
@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.login(createUserDto);
      return {
        ...user,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  // 获取当前用户信息
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const id = req['user']['id'];
    const user = await this.authService.getProfile(id);
    return {
      success: true,
      data: user,
    };
  }
}
