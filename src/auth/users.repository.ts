import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { User } from "./user.entity";

@Injectable()
export class UserRepository extends Repository<User> {

    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager())
    }

    async createUser(authCredentialsDto: AuthCredentialDto): Promise<void>{
        const {username, password} = authCredentialsDto;
        const user = this.create({ username, password });
        await this.save(user);
    }

}