/* eslint-disable functional/type-declaration-immutability -- Recursive types */
import type { ReadonlyDeep } from 'type-fest';

type JsonObject = Readonly<{
  [key: string]: JsonValue;
}>;
type JsonArray = readonly JsonValue[] & {};

type JsonValue = JsonArray | JsonObject | boolean | number | string | null;

type JsonOptions = ReadonlyDeep<{
  errorOnUnsupportedType?: boolean;
  maxDepth?: number;
  maxKeyDepth?: number;
  space?: number | string;
}>;

declare const json: {
  decode: (jsonString: string) => ReadonlyDeep<JsonValue>;
  encode: (value: unknown, options?: ReadonlyDeep<JsonOptions>) => string;
};

export = json;
/* eslint-enable functional/type-declaration-immutability -- Recursive types */
