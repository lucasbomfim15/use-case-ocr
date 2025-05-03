import { Module } from "@nestjs/common";
import { DocumentsService } from "./services/document.service";
import { DocumentsController } from "./controller/document.controller";
import { OcrService } from "./services/ocr.service";
import { PrismaModule } from "src/app/shared/prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";

import { GroqModule } from "../groq/groq.module";

@Module({
    imports: [PrismaModule, AuthModule, GroqModule],
    controllers: [DocumentsController],
    providers: [DocumentsService, OcrService],
    exports: [],
})
export default class DocumentsModule{}