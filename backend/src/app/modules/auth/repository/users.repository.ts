import { User } from "@prisma/client";
import { CreateAccountDTO } from "../dtos/create-account.dto";
import { PrismaService } from "src/app/shared/prisma/prisma.service";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export default class UsersRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async createUser(
        createAccountDto: CreateAccountDTO,
        hashedPassword: string,
      ): Promise<User> {
        return this.prismaService.user.create({
          data: {
            name: createAccountDto.name,
            email: createAccountDto.email,
            password: hashedPassword,
          },
        });
      }
    
    async findUserByEmail(email: string): Promise<User | null> {
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });

        return user;
    }
}