import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes } from "@nestjs/common";
import { PrismaService } from "src/app/shared/prisma/prisma.service";
import AuthService from "../service/auth-service";
import { CreateAccountDTO } from "../dtos/create-account.dto";
import { User } from "@prisma/client";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";


@Controller("/auth")
export class CreateAccountController {

    constructor(private authService: AuthService) {}
 
    @Post("/signup")
    @HttpCode(201)
    async handle(@Body() createAccountDto: CreateAccountDTO): Promise<User>{
        return this.authService.createAccount(createAccountDto);
    }
}