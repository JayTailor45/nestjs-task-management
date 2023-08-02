import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepo: UserRepository,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
        return this.userRepo.createUser(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = await this.userRepo.findOne({where: { username }});
        if(user && (await bcrypt.compare(password, user.password))) {
            return 'success';
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
    }
}
