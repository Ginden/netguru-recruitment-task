import { object, ObjectSchema, string } from 'joi';

export function notNull<T>(v: T): NonNullable<T> {
  if (v === null || v === undefined) {
    throw new TypeError(`Forbidden nullish value: ${v}`);
  }
  return v!;
}

export const authorizationHeadersRequired: ObjectSchema = object({
  authorization: string().required(),
}).unknown(true);
