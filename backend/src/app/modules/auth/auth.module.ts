import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controller/create-account.controller";
import AuthService from "./service/auth-service";
import { PrismaService } from "src/app/shared/prisma/prisma.service";
import { PrismaModule } from "src/app/shared/prisma/prisma.module";
import UsersRepository from "./repository/users.repository";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Env } from "src/env";
import AuthenticateController from "./controller/authenticate-account.controller";
import JwtStrategy from "./jwt/jwt.strategy";

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<Env, true>) {
        const privateKey = config.get("JWT_PRIVATE_KEY", { infer: true });
        const publicKey = config.get("JWT_PUBLIC_KEY", { infer: true });

        return {
          signOptions: {
            algorithm: "RS256",
            expiresIn: "1d", 
          },
          privateKey: Buffer.from(privateKey, "base64").toString("utf-8"),
          publicKey: Buffer.from(publicKey, "base64").toString("utf-8"),
        };
      },
    }),
  ],
  controllers: [CreateAccountController, AuthenticateController],
  providers: [AuthService, UsersRepository, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
