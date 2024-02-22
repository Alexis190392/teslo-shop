import { v4 as uuid } from 'uuid'

export const fileNamer = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

  if (!file) return callback( new Error('Falta archivo'), false);

  const  fileExtension = file.mimetype.split('/')[1]; //tomo la extension del archivo

  const fileName = `${uuid()}.${fileExtension}`;


  callback(null, fileName );
}