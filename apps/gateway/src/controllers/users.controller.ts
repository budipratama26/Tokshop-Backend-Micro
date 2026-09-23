import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { CreateUserDto } from '../dto/users/create-user.dto.js';
import { UpdateUserDto } from '../dto/users/update-user.dto.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { Roles } from '../decorators/roles.decorator.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  @Post()
  async register(@Body() createUserDto: CreateUserDto) {
    return firstValueFrom(
      this.authClient
        .send({ cmd: 'users.register' }, createUserDto)
        .pipe(timeout(5000)),
    );
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async findAll() {
    return firstValueFrom(
      this.authClient.send({ cmd: 'users.findAll' }, {}).pipe(timeout(5000)),
    );
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return firstValueFrom(
      this.authClient
        .send({ cmd: 'users.findOne' }, { id: user.sub })
        .pipe(timeout(5000)),
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return firstValueFrom(
      this.authClient
        .send({ cmd: 'users.findOne' }, { id })
        .pipe(timeout(5000)),
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    if (user.role !== 'admin' && user.sub !== id) {
      throw new ForbiddenException('Tidak bisa mengupdate user lain!');
    }

    return firstValueFrom(
      this.authClient
        .send({ cmd: 'users.update' }, { id, dto: updateUserDto })
        .pipe(timeout(5000)),
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'users.remove' }, { id }).pipe(timeout(5000)),
    );
  }
}
