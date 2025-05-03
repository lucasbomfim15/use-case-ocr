import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";

import { CreateAccountDTO } from "../dtos/create-account.dto";
import UsersRepository from "../repository/users.repository";
import { PrismaService } from "src/app/shared/prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { IAuthService } from "../interfaces/auth-service.interface";



@Injectable()
export default class AuthService implements IAuthService{
    constructor(private readonly usersRepository: UsersRepository,
                private readonly prismaService: PrismaService,
                private readonly jwt: JwtService
    ) {}

    async createAccount(createAccountDto: CreateAccountDTO): Promise<User> {
       const userExists = await this.usersRepository.findUserByEmail(createAccountDto.email);

         if (userExists) {
              throw new BadRequestException("User already exists");
         }


         const hashedPassword = await bcrypt.hash(createAccountDto.password, 8);

         return this.usersRepository.createUser(createAccountDto, hashedPassword);

    }

    async authenticate(email: string, password: string) {
     const user = await this.usersRepository.findUserByEmail(email);
 
     if (!user) {
       throw new UnauthorizedException(
         "User Credentials do not match.",
       );
     }
 
     const isPasswordValid = await compare(password, user.password);
 
     if (!isPasswordValid) {
       throw new UnauthorizedException(
         "User Credentials do not match.",
       );
     }
 
     const accessToken = this.jwt.sign({ sub: user.id });
 
     return {
       access_token: accessToken,
     };
   }

}