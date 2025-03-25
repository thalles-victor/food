import { InternalServerErrorException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import * as path from 'node:path';
import * as fs from 'node:fs';

export function generateShortId(length: number = 14): string {
  if (length < 10) {
    throw new Error(
      'Length must be at least 10 characters for reasonable uniqueness',
    );
  }
  const timestamp = process.hrtime.bigint().toString(36);
  const randomLength = length - timestamp.length - 1;
  const randomPart = randomBytes(Math.ceil(randomLength / 2))
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, randomLength > 0 ? randomLength : 1);
  const fullId = `${timestamp}-${randomPart}`;

  return fullId.slice(0, length);
}

export function splitKeyAndValue(param: object) {
  const [key, value] = Object.entries(param)[0];

  if (!key || !value) {
    console.error('require key and value');
    throw new InternalServerErrorException();
  }

  return [key, value];
}

export function checkIfFolderExistAndCreate(bucket: string) {
  const uploadPath = path.join(process.cwd(), '@Upload');
  const filePath = path.join(uploadPath, bucket);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }

  return filePath;
}
