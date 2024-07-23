import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async updateUserPhone(id: string, phoneNumber: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      // throw new Error('User not found');
      console.log('user not found');
      return;
    }
    user.number = phoneNumber;
    // console.log('found and updated');
    return this.userRepository.save(user);
  }

  async findAndVerifyUserByPhoneNumber(phoneNumber: string) {
    const user = await this.userRepository.findOne({
      where: { number: phoneNumber },
    });
    if (!user) {
      // throw new Error('User not found');
      console.log('User not found by phone number');
      return;
    }
    user.isVerified = true;
    return this.userRepository.save(user);
  }
}
