import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
    ){}

    async createUser(user: Pick<UsersModel, 'email'|'nickname'|'password'>) {
        // 1) nickname 중복확인
        // exist() => 만약 조건에 해당되는 값이 있으면 true 반환
        const nicknameExist = await this.usersRepository.exists({
            where: {
                nickname: user.nickname,
            }
        }); 

        if(nicknameExist){
            throw new BadRequestException('이미 존재하는 닉네임입니다.');
        }

        const emailExist = await this.usersRepository.exists({
            where: {
                email: user.email,
            }
        });
        
        if(emailExist){
            throw new BadRequestException('이미 존재하는 이메일입니다.');
        }

        const userObj = this.usersRepository.create({
            nickname: user.nickname,
            email: user.email,
            password: user.password,
        });

        const joinUser = this.usersRepository.save(userObj);

        return joinUser;
    }

    async getAllUsers() {
        return this.usersRepository.find();
    }

    async getUserByEmail(email: string) {
        return this.usersRepository.findOne({ 
            where: { 
                email,
            },
         });
    }
}
