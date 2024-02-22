import { BadRequestException, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesService } from './files.service';
import { FileInterceptor } from "@nestjs/platform-express";
import { fileFilter } from "./helpers/fileFilter.helper";

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file',{
    fileFilter: fileFilter
  }))
  uploadFile(
    @UploadedFiles() file: Express.Multer.File){

    if (!file){
      throw new BadRequestException('Asegurese que el archivo sea admitido.')
    }

    return {
      filename: file.originalname
    };

  }
}
