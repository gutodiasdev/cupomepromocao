import { customAlphabet } from "nanoid";

const alphabet = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 11);

export const generateNanoId = () => {
  return nanoid();
}