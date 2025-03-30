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
  const fullId = `${timestamp}${randomPart}`;

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

export function isValidCPF(cpf: string): boolean {
  if (typeof cpf !== 'string') return false;
  cpf = cpf.replace(/[\s.-]*/gim, '');

  if (
    !cpf ||
    cpf.length !== 11 ||
    cpf === '00000000000' ||
    cpf === '11111111111' ||
    cpf === '22222222222' ||
    cpf === '33333333333' ||
    cpf === '44444444444' ||
    cpf === '55555555555' ||
    cpf === '66666666666' ||
    cpf === '77777777777' ||
    cpf === '88888888888' ||
    cpf === '99999999999'
  ) {
    return false;
  }

  let sum: number = 0;
  let rest: number;

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}
