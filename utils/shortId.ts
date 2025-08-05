import { customAlphabet } from 'nanoid';

const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 8);

export function generateShortId(): string {
  return nanoid();
}