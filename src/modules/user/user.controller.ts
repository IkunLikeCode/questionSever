import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Redirect,
  Get,
  ValidationPipe,
  UsePipes,
  Put,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';
import { Public } from '../auth/decorators/public.decorator';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.register(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Post('login')
  @Redirect('/api/auth/login', HttpStatus.PERMANENT_REDIRECT)
  async login() {}

  @Get('profile')
  @Redirect('/api/auth/profile', HttpStatus.FOUND)
  async getProfile() {}

  @Put('')
  async updateProfile(@Body() updateUserDto: CreateUserDto, @Req() req) {
    const userId = req.user.id;
    try {
      return await this.userService.updateProfile(updateUserDto, userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
