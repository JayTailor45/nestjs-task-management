import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepo: UserRepository,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
        return this.userRepo.createUser(authCredentialsDto);
    }
}
