import { z } from "zod";
export declare const users: import("hono/hono-base").HonoBase<
  import("hono/types").BlankEnv,
  {
    "/:userId": {
      $get: {
        input: {
          param: {
            userId: string;
          };
        };
        output: any;
        outputFormat: "json";
        status: import("hono/utils/http-status").ContentfulStatusCode;
      };
    };
  } & {
    "/:userId": {
      $put: {
        input: {
          param: {
            userId: string;
          };
        };
        output: any;
        outputFormat: "json";
        status: import("hono/utils/http-status").ContentfulStatusCode;
      };
    };
  } & {
    "/:userId/money": {
      $put:
        | {
            input: {
              param: {
                userId: string;
              };
            };
            output: {
              error: {
                code: string;
                message: string;
              };
            };
            outputFormat: "json";
            status: 403;
          }
        | {
            input: {
              param: {
                userId: string;
              };
            };
            output: {
              error: {
                code: string;
                message: string;
                details: (
                  | {
                      readonly code: "invalid_format";
                      readonly format: z.core.$ZodStringFormats | (string & {});
                      readonly pattern?: string | undefined;
                      readonly input?: string | undefined;
                      readonly path: (string | number | null)[];
                      readonly message: string;
                    }
                  | {
                      readonly code: "invalid_type";
                      readonly expected: z.core.$ZodInvalidTypeExpected;
                      readonly input?:
                        | import("hono/utils/types").JSONValue
                        | undefined;
                      readonly path: (string | number | null)[];
                      readonly message: string;
                    }
                  | {
                      readonly code: "too_big";
                      readonly origin:
                        | "number"
                        | "int"
                        | "bigint"
                        | "date"
                        | "string"
                        | "array"
                        | "set"
                        | "file"
                        | (string & {});
                      readonly maximum: number;
                      readonly inclusive?: boolean | undefined;
                      readonly exact?: boolean | undefined;
                      readonly input?:
                        | import("hono/utils/types").JSONValue
                        | undefined;
                      readonly path: (string | number | null)[];
                      readonly message: string;
                    }
                  | {
                      readonly code: "too_small";
                      readonly origin:
                        | "number"
                        | "int"
                        | "bigint"
                        | "date"
                        | "string"
                        | "array"
                        | "set"
                        | "file"
                        | (string & {});
                      readonly minimum: number;
                      readonly inclusive?: boolean | undefined;
                      readonly exact?: boolean | undefined;
                      readonly input?:
                        | import("hono/utils/types").JSONValue
                        | undefined;
                      readonly path: (string | number | null)[];
                      readonly message: string;
                    }
                  | {
                      readonly code: "not_multiple_of";
                      readonly divisor: number;
                      readonly input?: number | undefined;
                      readonly path: (string | number | null)[];
                      readonly message: string;
                    }
                  | {
                      readonly code: "unrecognized_keys";
                      readonly keys: string[];
                      readonly input?:
                        | {
                            [x: string]: import("hono/utils/types").JSONValue;
                          }
                        | undefined;
                      readonly path: (string | number | null)[];
                      readonly message: string;
                    }
                  | {
                      readonly code: "invalid_union";
                      readonly errors: (
                        | {
                            readonly code: "invalid_format";
                            readonly format:
                              | z.core.$ZodStringFormats
                              | (string & {});
                            readonly pattern?: string | undefined;
                            readonly input?: string | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "invalid_type";
                            readonly expected: z.core.$ZodInvalidTypeExpected;
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "too_big";
                            readonly origin:
                              | "number"
                              | "int"
                              | "bigint"
                              | "date"
                              | "string"
                              | "array"
                              | "set"
                              | "file"
                              | (string & {});
                            readonly maximum: number;
                            readonly inclusive?: boolean | undefined;
                            readonly exact?: boolean | undefined;
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "too_small";
                            readonly origin:
                              | "number"
                              | "int"
                              | "bigint"
                              | "date"
                              | "string"
                              | "array"
                              | "set"
                              | "file"
                              | (string & {});
                            readonly minimum: number;
                            readonly inclusive?: boolean | undefined;
                            readonly exact?: boolean | undefined;
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "not_multiple_of";
                            readonly divisor: number;
                            readonly input?: number | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "unrecognized_keys";
                            readonly keys: string[];
                            readonly input?:
                              | {
                                  [
                                    x: string
                                  ]: import("hono/utils/types").JSONValue;
                                }
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | /*elided*/ any
                        | {
                            readonly code: "invalid_union";
                            readonly errors: [];
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly discriminator?:
                              | string
                              | undefined
                              | undefined;
                            readonly inclusive: false;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "invalid_key";
                            readonly origin: "map" | "record";
                            readonly issues: (
                              | {
                                  readonly code: "invalid_format";
                                  readonly format:
                                    | z.core.$ZodStringFormats
                                    | (string & {});
                                  readonly pattern?: string | undefined;
                                  readonly input?: string | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "invalid_type";
                                  readonly expected: z.core.$ZodInvalidTypeExpected;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "too_big";
                                  readonly origin:
                                    | "number"
                                    | "int"
                                    | "bigint"
                                    | "date"
                                    | "string"
                                    | "array"
                                    | "set"
                                    | "file"
                                    | (string & {});
                                  readonly maximum: number;
                                  readonly inclusive?: boolean | undefined;
                                  readonly exact?: boolean | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "too_small";
                                  readonly origin:
                                    | "number"
                                    | "int"
                                    | "bigint"
                                    | "date"
                                    | "string"
                                    | "array"
                                    | "set"
                                    | "file"
                                    | (string & {});
                                  readonly minimum: number;
                                  readonly inclusive?: boolean | undefined;
                                  readonly exact?: boolean | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "not_multiple_of";
                                  readonly divisor: number;
                                  readonly input?: number | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "unrecognized_keys";
                                  readonly keys: string[];
                                  readonly input?:
                                    | {
                                        [
                                          x: string
                                        ]: import("hono/utils/types").JSONValue;
                                      }
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | /*elided*/ any
                              | {
                                  readonly code: "invalid_union";
                                  readonly errors: [];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly discriminator?:
                                    | string
                                    | undefined
                                    | undefined;
                                  readonly inclusive: false;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | /*elided*/ any
                              | {
                                  readonly code: "invalid_element";
                                  readonly origin: "map" | "set";
                                  readonly key: import("hono/utils/types").JSONValue;
                                  readonly issues: (
                                    | {
                                        readonly code: "invalid_format";
                                        readonly format:
                                          | z.core.$ZodStringFormats
                                          | (string & {});
                                        readonly pattern?: string | undefined;
                                        readonly input?: string | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "invalid_type";
                                        readonly expected: z.core.$ZodInvalidTypeExpected;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "too_big";
                                        readonly origin:
                                          | "number"
                                          | "int"
                                          | "bigint"
                                          | "date"
                                          | "string"
                                          | "array"
                                          | "set"
                                          | "file"
                                          | (string & {});
                                        readonly maximum: number;
                                        readonly inclusive?:
                                          | boolean
                                          | undefined;
                                        readonly exact?: boolean | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "too_small";
                                        readonly origin:
                                          | "number"
                                          | "int"
                                          | "bigint"
                                          | "date"
                                          | "string"
                                          | "array"
                                          | "set"
                                          | "file"
                                          | (string & {});
                                        readonly minimum: number;
                                        readonly inclusive?:
                                          | boolean
                                          | undefined;
                                        readonly exact?: boolean | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "not_multiple_of";
                                        readonly divisor: number;
                                        readonly input?: number | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "unrecognized_keys";
                                        readonly keys: string[];
                                        readonly input?:
                                          | {
                                              [
                                                x: string
                                              ]: import("hono/utils/types").JSONValue;
                                            }
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | /*elided*/ any
                                    | {
                                        readonly code: "invalid_union";
                                        readonly errors: [];
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly discriminator?:
                                          | string
                                          | undefined
                                          | undefined;
                                        readonly inclusive: false;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | /*elided*/ any
                                    | /*elided*/ any
                                    | {
                                        readonly code: "invalid_value";
                                        readonly values: (
                                          | string
                                          | number
                                          | boolean
                                          | null
                                        )[];
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "custom";
                                        readonly params?:
                                          | {
                                              [x: string]: any;
                                            }
                                          | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                  )[];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "invalid_value";
                                  readonly values: (
                                    | string
                                    | number
                                    | boolean
                                    | null
                                  )[];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "custom";
                                  readonly params?:
                                    | {
                                        [x: string]: any;
                                      }
                                    | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                            )[];
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "invalid_element";
                            readonly origin: "map" | "set";
                            readonly key: import("hono/utils/types").JSONValue;
                            readonly issues: (
                              | {
                                  readonly code: "invalid_format";
                                  readonly format:
                                    | z.core.$ZodStringFormats
                                    | (string & {});
                                  readonly pattern?: string | undefined;
                                  readonly input?: string | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "invalid_type";
                                  readonly expected: z.core.$ZodInvalidTypeExpected;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "too_big";
                                  readonly origin:
                                    | "number"
                                    | "int"
                                    | "bigint"
                                    | "date"
                                    | "string"
                                    | "array"
                                    | "set"
                                    | "file"
                                    | (string & {});
                                  readonly maximum: number;
                                  readonly inclusive?: boolean | undefined;
                                  readonly exact?: boolean | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "too_small";
                                  readonly origin:
                                    | "number"
                                    | "int"
                                    | "bigint"
                                    | "date"
                                    | "string"
                                    | "array"
                                    | "set"
                                    | "file"
                                    | (string & {});
                                  readonly minimum: number;
                                  readonly inclusive?: boolean | undefined;
                                  readonly exact?: boolean | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "not_multiple_of";
                                  readonly divisor: number;
                                  readonly input?: number | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "unrecognized_keys";
                                  readonly keys: string[];
                                  readonly input?:
                                    | {
                                        [
                                          x: string
                                        ]: import("hono/utils/types").JSONValue;
                                      }
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | /*elided*/ any
                              | {
                                  readonly code: "invalid_union";
                                  readonly errors: [];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly discriminator?:
                                    | string
                                    | undefined
                                    | undefined;
                                  readonly inclusive: false;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "invalid_key";
                                  readonly origin: "map" | "record";
                                  readonly issues: (
                                    | {
                                        readonly code: "invalid_format";
                                        readonly format:
                                          | z.core.$ZodStringFormats
                                          | (string & {});
                                        readonly pattern?: string | undefined;
                                        readonly input?: string | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "invalid_type";
                                        readonly expected: z.core.$ZodInvalidTypeExpected;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "too_big";
                                        readonly origin:
                                          | "number"
                                          | "int"
                                          | "bigint"
                                          | "date"
                                          | "string"
                                          | "array"
                                          | "set"
                                          | "file"
                                          | (string & {});
                                        readonly maximum: number;
                                        readonly inclusive?:
                                          | boolean
                                          | undefined;
                                        readonly exact?: boolean | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "too_small";
                                        readonly origin:
                                          | "number"
                                          | "int"
                                          | "bigint"
                                          | "date"
                                          | "string"
                                          | "array"
                                          | "set"
                                          | "file"
                                          | (string & {});
                                        readonly minimum: number;
                                        readonly inclusive?:
                                          | boolean
                                          | undefined;
                                        readonly exact?: boolean | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "not_multiple_of";
                                        readonly divisor: number;
                                        readonly input?: number | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "unrecognized_keys";
                                        readonly keys: string[];
                                        readonly input?:
                                          | {
                                              [
                                                x: string
                                              ]: import("hono/utils/types").JSONValue;
                                            }
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | /*elided*/ any
                                    | {
                                        readonly code: "invalid_union";
                                        readonly errors: [];
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly discriminator?:
                                          | string
                                          | undefined
                                          | undefined;
                                        readonly inclusive: false;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | /*elided*/ any
                                    | /*elided*/ any
                                    | {
                                        readonly code: "invalid_value";
                                        readonly values: (
                                          | string
                                          | number
                                          | boolean
                                          | null
                                        )[];
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "custom";
                                        readonly params?:
                                          | {
                                              [x: string]: any;
                                            }
                                          | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                  )[];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | /*elided*/ any
                              | {
                                  readonly code: "invalid_value";
                                  readonly values: (
                                    | string
                                    | number
                                    | boolean
                                    | null
                                  )[];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "custom";
                                  readonly params?:
                                    | {
                                        [x: string]: any;
                                      }
                                    | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                            )[];
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "invalid_value";
                            readonly values: (
                              | string
                              | number
                              | boolean
                              | null
                            )[];
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "custom";
                            readonly params?:
                              | {
                                  [x: string]: any;
                                }
                              | undefined;
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                      )[][];
                      readonly input?:
                        | import("hono/utils/types").JSONValue
                        | undefined;
                      readonly discriminator?: string | undefined | undefined;
                      readonly inclusive?: true | undefined;
                      readonly path: (string | number | null)[];
                      readonly message: string;
                    }
                  | {
                      readonly code: "invalid_union";
                      readonly errors: [];
                      readonly input?:
                        | import("hono/utils/types").JSONValue
                        | undefined;
                      readonly discriminator?: string | undefined | undefined;
                      readonly inclusive: false;
                      readonly path: (string | number | null)[];
                      readonly message: string;
                    }
                  | {
                      readonly code: "invalid_key";
                      readonly origin: "map" | "record";
                      readonly issues: (
                        | {
                            readonly code: "invalid_format";
                            readonly format:
                              | z.core.$ZodStringFormats
                              | (string & {});
                            readonly pattern?: string | undefined;
                            readonly input?: string | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "invalid_type";
                            readonly expected: z.core.$ZodInvalidTypeExpected;
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "too_big";
                            readonly origin:
                              | "number"
                              | "int"
                              | "bigint"
                              | "date"
                              | "string"
                              | "array"
                              | "set"
                              | "file"
                              | (string & {});
                            readonly maximum: number;
                            readonly inclusive?: boolean | undefined;
                            readonly exact?: boolean | undefined;
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "too_small";
                            readonly origin:
                              | "number"
                              | "int"
                              | "bigint"
                              | "date"
                              | "string"
                              | "array"
                              | "set"
                              | "file"
                              | (string & {});
                            readonly minimum: number;
                            readonly inclusive?: boolean | undefined;
                            readonly exact?: boolean | undefined;
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "not_multiple_of";
                            readonly divisor: number;
                            readonly input?: number | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "unrecognized_keys";
                            readonly keys: string[];
                            readonly input?:
                              | {
                                  [
                                    x: string
                                  ]: import("hono/utils/types").JSONValue;
                                }
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "invalid_union";
                            readonly errors: (
                              | {
                                  readonly code: "invalid_format";
                                  readonly format:
                                    | z.core.$ZodStringFormats
                                    | (string & {});
                                  readonly pattern?: string | undefined;
                                  readonly input?: string | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "invalid_type";
                                  readonly expected: z.core.$ZodInvalidTypeExpected;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "too_big";
                                  readonly origin:
                                    | "number"
                                    | "int"
                                    | "bigint"
                                    | "date"
                                    | "string"
                                    | "array"
                                    | "set"
                                    | "file"
                                    | (string & {});
                                  readonly maximum: number;
                                  readonly inclusive?: boolean | undefined;
                                  readonly exact?: boolean | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "too_small";
                                  readonly origin:
                                    | "number"
                                    | "int"
                                    | "bigint"
                                    | "date"
                                    | "string"
                                    | "array"
                                    | "set"
                                    | "file"
                                    | (string & {});
                                  readonly minimum: number;
                                  readonly inclusive?: boolean | undefined;
                                  readonly exact?: boolean | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "not_multiple_of";
                                  readonly divisor: number;
                                  readonly input?: number | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "unrecognized_keys";
                                  readonly keys: string[];
                                  readonly input?:
                                    | {
                                        [
                                          x: string
                                        ]: import("hono/utils/types").JSONValue;
                                      }
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | /*elided*/ any
                              | {
                                  readonly code: "invalid_union";
                                  readonly errors: [];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly discriminator?:
                                    | string
                                    | undefined
                                    | undefined;
                                  readonly inclusive: false;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | /*elided*/ any
                              | {
                                  readonly code: "invalid_element";
                                  readonly origin: "map" | "set";
                                  readonly key: import("hono/utils/types").JSONValue;
                                  readonly issues: (
                                    | {
                                        readonly code: "invalid_format";
                                        readonly format:
                                          | z.core.$ZodStringFormats
                                          | (string & {});
                                        readonly pattern?: string | undefined;
                                        readonly input?: string | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "invalid_type";
                                        readonly expected: z.core.$ZodInvalidTypeExpected;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "too_big";
                                        readonly origin:
                                          | "number"
                                          | "int"
                                          | "bigint"
                                          | "date"
                                          | "string"
                                          | "array"
                                          | "set"
                                          | "file"
                                          | (string & {});
                                        readonly maximum: number;
                                        readonly inclusive?:
                                          | boolean
                                          | undefined;
                                        readonly exact?: boolean | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "too_small";
                                        readonly origin:
                                          | "number"
                                          | "int"
                                          | "bigint"
                                          | "date"
                                          | "string"
                                          | "array"
                                          | "set"
                                          | "file"
                                          | (string & {});
                                        readonly minimum: number;
                                        readonly inclusive?:
                                          | boolean
                                          | undefined;
                                        readonly exact?: boolean | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "not_multiple_of";
                                        readonly divisor: number;
                                        readonly input?: number | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "unrecognized_keys";
                                        readonly keys: string[];
                                        readonly input?:
                                          | {
                                              [
                                                x: string
                                              ]: import("hono/utils/types").JSONValue;
                                            }
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | /*elided*/ any
                                    | {
                                        readonly code: "invalid_union";
                                        readonly errors: [];
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly discriminator?:
                                          | string
                                          | undefined
                                          | undefined;
                                        readonly inclusive: false;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | /*elided*/ any
                                    | /*elided*/ any
                                    | {
                                        readonly code: "invalid_value";
                                        readonly values: (
                                          | string
                                          | number
                                          | boolean
                                          | null
                                        )[];
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "custom";
                                        readonly params?:
                                          | {
                                              [x: string]: any;
                                            }
                                          | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                  )[];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "invalid_value";
                                  readonly values: (
                                    | string
                                    | number
                                    | boolean
                                    | null
                                  )[];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "custom";
                                  readonly params?:
                                    | {
                                        [x: string]: any;
                                      }
                                    | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                            )[][];
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly discriminator?:
                              | string
                              | undefined
                              | undefined;
                            readonly inclusive?: true | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "invalid_union";
                            readonly errors: [];
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly discriminator?:
                              | string
                              | undefined
                              | undefined;
                            readonly inclusive: false;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | /*elided*/ any
                        | {
                            readonly code: "invalid_element";
                            readonly origin: "map" | "set";
                            readonly key: import("hono/utils/types").JSONValue;
                            readonly issues: (
                              | {
                                  readonly code: "invalid_format";
                                  readonly format:
                                    | z.core.$ZodStringFormats
                                    | (string & {});
                                  readonly pattern?: string | undefined;
                                  readonly input?: string | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "invalid_type";
                                  readonly expected: z.core.$ZodInvalidTypeExpected;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "too_big";
                                  readonly origin:
                                    | "number"
                                    | "int"
                                    | "bigint"
                                    | "date"
                                    | "string"
                                    | "array"
                                    | "set"
                                    | "file"
                                    | (string & {});
                                  readonly maximum: number;
                                  readonly inclusive?: boolean | undefined;
                                  readonly exact?: boolean | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "too_small";
                                  readonly origin:
                                    | "number"
                                    | "int"
                                    | "bigint"
                                    | "date"
                                    | "string"
                                    | "array"
                                    | "set"
                                    | "file"
                                    | (string & {});
                                  readonly minimum: number;
                                  readonly inclusive?: boolean | undefined;
                                  readonly exact?: boolean | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "not_multiple_of";
                                  readonly divisor: number;
                                  readonly input?: number | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "unrecognized_keys";
                                  readonly keys: string[];
                                  readonly input?:
                                    | {
                                        [
                                          x: string
                                        ]: import("hono/utils/types").JSONValue;
                                      }
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "invalid_union";
                                  readonly errors: (
                                    | {
                                        readonly code: "invalid_format";
                                        readonly format:
                                          | z.core.$ZodStringFormats
                                          | (string & {});
                                        readonly pattern?: string | undefined;
                                        readonly input?: string | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "invalid_type";
                                        readonly expected: z.core.$ZodInvalidTypeExpected;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "too_big";
                                        readonly origin:
                                          | "number"
                                          | "int"
                                          | "bigint"
                                          | "date"
                                          | "string"
                                          | "array"
                                          | "set"
                                          | "file"
                                          | (string & {});
                                        readonly maximum: number;
                                        readonly inclusive?:
                                          | boolean
                                          | undefined;
                                        readonly exact?: boolean | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "too_small";
                                        readonly origin:
                                          | "number"
                                          | "int"
                                          | "bigint"
                                          | "date"
                                          | "string"
                                          | "array"
                                          | "set"
                                          | "file"
                                          | (string & {});
                                        readonly minimum: number;
                                        readonly inclusive?:
                                          | boolean
                                          | undefined;
                                        readonly exact?: boolean | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "not_multiple_of";
                                        readonly divisor: number;
                                        readonly input?: number | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "unrecognized_keys";
                                        readonly keys: string[];
                                        readonly input?:
                                          | {
                                              [
                                                x: string
                                              ]: import("hono/utils/types").JSONValue;
                                            }
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | /*elided*/ any
                                    | {
                                        readonly code: "invalid_union";
                                        readonly errors: [];
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly discriminator?:
                                          | string
                                          | undefined
                                          | undefined;
                                        readonly inclusive: false;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | /*elided*/ any
                                    | /*elided*/ any
                                    | {
                                        readonly code: "invalid_value";
                                        readonly values: (
                                          | string
                                          | number
                                          | boolean
                                          | null
                                        )[];
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "custom";
                                        readonly params?:
                                          | {
                                              [x: string]: any;
                                            }
                                          | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                  )[][];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly discriminator?:
                                    | string
                                    | undefined
                                    | undefined;
                                  readonly inclusive?: true | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "invalid_union";
                                  readonly errors: [];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly discriminator?:
                                    | string
                                    | undefined
                                    | undefined;
                                  readonly inclusive: false;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | /*elided*/ any
                              | /*elided*/ any
                              | {
                                  readonly code: "invalid_value";
                                  readonly values: (
                                    | string
                                    | number
                                    | boolean
                                    | null
                                  )[];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "custom";
                                  readonly params?:
                                    | {
                                        [x: string]: any;
                                      }
                                    | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                            )[];
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "invalid_value";
                            readonly values: (
                              | string
                              | number
                              | boolean
                              | null
                            )[];
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "custom";
                            readonly params?:
                              | {
                                  [x: string]: any;
                                }
                              | undefined;
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                      )[];
                      readonly input?:
                        | import("hono/utils/types").JSONValue
                        | undefined;
                      readonly path: (string | number | null)[];
                      readonly message: string;
                    }
                  | {
                      readonly code: "invalid_element";
                      readonly origin: "map" | "set";
                      readonly key: import("hono/utils/types").JSONValue;
                      readonly issues: (
                        | {
                            readonly code: "invalid_format";
                            readonly format:
                              | z.core.$ZodStringFormats
                              | (string & {});
                            readonly pattern?: string | undefined;
                            readonly input?: string | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "invalid_type";
                            readonly expected: z.core.$ZodInvalidTypeExpected;
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "too_big";
                            readonly origin:
                              | "number"
                              | "int"
                              | "bigint"
                              | "date"
                              | "string"
                              | "array"
                              | "set"
                              | "file"
                              | (string & {});
                            readonly maximum: number;
                            readonly inclusive?: boolean | undefined;
                            readonly exact?: boolean | undefined;
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "too_small";
                            readonly origin:
                              | "number"
                              | "int"
                              | "bigint"
                              | "date"
                              | "string"
                              | "array"
                              | "set"
                              | "file"
                              | (string & {});
                            readonly minimum: number;
                            readonly inclusive?: boolean | undefined;
                            readonly exact?: boolean | undefined;
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "not_multiple_of";
                            readonly divisor: number;
                            readonly input?: number | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "unrecognized_keys";
                            readonly keys: string[];
                            readonly input?:
                              | {
                                  [
                                    x: string
                                  ]: import("hono/utils/types").JSONValue;
                                }
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "invalid_union";
                            readonly errors: (
                              | {
                                  readonly code: "invalid_format";
                                  readonly format:
                                    | z.core.$ZodStringFormats
                                    | (string & {});
                                  readonly pattern?: string | undefined;
                                  readonly input?: string | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "invalid_type";
                                  readonly expected: z.core.$ZodInvalidTypeExpected;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "too_big";
                                  readonly origin:
                                    | "number"
                                    | "int"
                                    | "bigint"
                                    | "date"
                                    | "string"
                                    | "array"
                                    | "set"
                                    | "file"
                                    | (string & {});
                                  readonly maximum: number;
                                  readonly inclusive?: boolean | undefined;
                                  readonly exact?: boolean | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "too_small";
                                  readonly origin:
                                    | "number"
                                    | "int"
                                    | "bigint"
                                    | "date"
                                    | "string"
                                    | "array"
                                    | "set"
                                    | "file"
                                    | (string & {});
                                  readonly minimum: number;
                                  readonly inclusive?: boolean | undefined;
                                  readonly exact?: boolean | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "not_multiple_of";
                                  readonly divisor: number;
                                  readonly input?: number | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "unrecognized_keys";
                                  readonly keys: string[];
                                  readonly input?:
                                    | {
                                        [
                                          x: string
                                        ]: import("hono/utils/types").JSONValue;
                                      }
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | /*elided*/ any
                              | {
                                  readonly code: "invalid_union";
                                  readonly errors: [];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly discriminator?:
                                    | string
                                    | undefined
                                    | undefined;
                                  readonly inclusive: false;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "invalid_key";
                                  readonly origin: "map" | "record";
                                  readonly issues: (
                                    | {
                                        readonly code: "invalid_format";
                                        readonly format:
                                          | z.core.$ZodStringFormats
                                          | (string & {});
                                        readonly pattern?: string | undefined;
                                        readonly input?: string | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "invalid_type";
                                        readonly expected: z.core.$ZodInvalidTypeExpected;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "too_big";
                                        readonly origin:
                                          | "number"
                                          | "int"
                                          | "bigint"
                                          | "date"
                                          | "string"
                                          | "array"
                                          | "set"
                                          | "file"
                                          | (string & {});
                                        readonly maximum: number;
                                        readonly inclusive?:
                                          | boolean
                                          | undefined;
                                        readonly exact?: boolean | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "too_small";
                                        readonly origin:
                                          | "number"
                                          | "int"
                                          | "bigint"
                                          | "date"
                                          | "string"
                                          | "array"
                                          | "set"
                                          | "file"
                                          | (string & {});
                                        readonly minimum: number;
                                        readonly inclusive?:
                                          | boolean
                                          | undefined;
                                        readonly exact?: boolean | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "not_multiple_of";
                                        readonly divisor: number;
                                        readonly input?: number | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "unrecognized_keys";
                                        readonly keys: string[];
                                        readonly input?:
                                          | {
                                              [
                                                x: string
                                              ]: import("hono/utils/types").JSONValue;
                                            }
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | /*elided*/ any
                                    | {
                                        readonly code: "invalid_union";
                                        readonly errors: [];
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly discriminator?:
                                          | string
                                          | undefined
                                          | undefined;
                                        readonly inclusive: false;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | /*elided*/ any
                                    | /*elided*/ any
                                    | {
                                        readonly code: "invalid_value";
                                        readonly values: (
                                          | string
                                          | number
                                          | boolean
                                          | null
                                        )[];
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "custom";
                                        readonly params?:
                                          | {
                                              [x: string]: any;
                                            }
                                          | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                  )[];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | /*elided*/ any
                              | {
                                  readonly code: "invalid_value";
                                  readonly values: (
                                    | string
                                    | number
                                    | boolean
                                    | null
                                  )[];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "custom";
                                  readonly params?:
                                    | {
                                        [x: string]: any;
                                      }
                                    | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                            )[][];
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly discriminator?:
                              | string
                              | undefined
                              | undefined;
                            readonly inclusive?: true | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "invalid_union";
                            readonly errors: [];
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly discriminator?:
                              | string
                              | undefined
                              | undefined;
                            readonly inclusive: false;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "invalid_key";
                            readonly origin: "map" | "record";
                            readonly issues: (
                              | {
                                  readonly code: "invalid_format";
                                  readonly format:
                                    | z.core.$ZodStringFormats
                                    | (string & {});
                                  readonly pattern?: string | undefined;
                                  readonly input?: string | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "invalid_type";
                                  readonly expected: z.core.$ZodInvalidTypeExpected;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "too_big";
                                  readonly origin:
                                    | "number"
                                    | "int"
                                    | "bigint"
                                    | "date"
                                    | "string"
                                    | "array"
                                    | "set"
                                    | "file"
                                    | (string & {});
                                  readonly maximum: number;
                                  readonly inclusive?: boolean | undefined;
                                  readonly exact?: boolean | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "too_small";
                                  readonly origin:
                                    | "number"
                                    | "int"
                                    | "bigint"
                                    | "date"
                                    | "string"
                                    | "array"
                                    | "set"
                                    | "file"
                                    | (string & {});
                                  readonly minimum: number;
                                  readonly inclusive?: boolean | undefined;
                                  readonly exact?: boolean | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "not_multiple_of";
                                  readonly divisor: number;
                                  readonly input?: number | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "unrecognized_keys";
                                  readonly keys: string[];
                                  readonly input?:
                                    | {
                                        [
                                          x: string
                                        ]: import("hono/utils/types").JSONValue;
                                      }
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "invalid_union";
                                  readonly errors: (
                                    | {
                                        readonly code: "invalid_format";
                                        readonly format:
                                          | z.core.$ZodStringFormats
                                          | (string & {});
                                        readonly pattern?: string | undefined;
                                        readonly input?: string | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "invalid_type";
                                        readonly expected: z.core.$ZodInvalidTypeExpected;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "too_big";
                                        readonly origin:
                                          | "number"
                                          | "int"
                                          | "bigint"
                                          | "date"
                                          | "string"
                                          | "array"
                                          | "set"
                                          | "file"
                                          | (string & {});
                                        readonly maximum: number;
                                        readonly inclusive?:
                                          | boolean
                                          | undefined;
                                        readonly exact?: boolean | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "too_small";
                                        readonly origin:
                                          | "number"
                                          | "int"
                                          | "bigint"
                                          | "date"
                                          | "string"
                                          | "array"
                                          | "set"
                                          | "file"
                                          | (string & {});
                                        readonly minimum: number;
                                        readonly inclusive?:
                                          | boolean
                                          | undefined;
                                        readonly exact?: boolean | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "not_multiple_of";
                                        readonly divisor: number;
                                        readonly input?: number | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "unrecognized_keys";
                                        readonly keys: string[];
                                        readonly input?:
                                          | {
                                              [
                                                x: string
                                              ]: import("hono/utils/types").JSONValue;
                                            }
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | /*elided*/ any
                                    | {
                                        readonly code: "invalid_union";
                                        readonly errors: [];
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly discriminator?:
                                          | string
                                          | undefined
                                          | undefined;
                                        readonly inclusive: false;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | /*elided*/ any
                                    | /*elided*/ any
                                    | {
                                        readonly code: "invalid_value";
                                        readonly values: (
                                          | string
                                          | number
                                          | boolean
                                          | null
                                        )[];
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                    | {
                                        readonly code: "custom";
                                        readonly params?:
                                          | {
                                              [x: string]: any;
                                            }
                                          | undefined;
                                        readonly input?:
                                          | import("hono/utils/types").JSONValue
                                          | undefined;
                                        readonly path: (
                                          | string
                                          | number
                                          | null
                                        )[];
                                        readonly message: string;
                                      }
                                  )[][];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly discriminator?:
                                    | string
                                    | undefined
                                    | undefined;
                                  readonly inclusive?: true | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "invalid_union";
                                  readonly errors: [];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly discriminator?:
                                    | string
                                    | undefined
                                    | undefined;
                                  readonly inclusive: false;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | /*elided*/ any
                              | /*elided*/ any
                              | {
                                  readonly code: "invalid_value";
                                  readonly values: (
                                    | string
                                    | number
                                    | boolean
                                    | null
                                  )[];
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                              | {
                                  readonly code: "custom";
                                  readonly params?:
                                    | {
                                        [x: string]: any;
                                      }
                                    | undefined;
                                  readonly input?:
                                    | import("hono/utils/types").JSONValue
                                    | undefined;
                                  readonly path: (string | number | null)[];
                                  readonly message: string;
                                }
                            )[];
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | /*elided*/ any
                        | {
                            readonly code: "invalid_value";
                            readonly values: (
                              | string
                              | number
                              | boolean
                              | null
                            )[];
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                        | {
                            readonly code: "custom";
                            readonly params?:
                              | {
                                  [x: string]: any;
                                }
                              | undefined;
                            readonly input?:
                              | import("hono/utils/types").JSONValue
                              | undefined;
                            readonly path: (string | number | null)[];
                            readonly message: string;
                          }
                      )[];
                      readonly input?:
                        | import("hono/utils/types").JSONValue
                        | undefined;
                      readonly path: (string | number | null)[];
                      readonly message: string;
                    }
                  | {
                      readonly code: "invalid_value";
                      readonly values: (string | number | boolean | null)[];
                      readonly input?:
                        | import("hono/utils/types").JSONValue
                        | undefined;
                      readonly path: (string | number | null)[];
                      readonly message: string;
                    }
                  | {
                      readonly code: "custom";
                      readonly params?:
                        | {
                            [x: string]: any;
                          }
                        | undefined;
                      readonly input?:
                        | import("hono/utils/types").JSONValue
                        | undefined;
                      readonly path: (string | number | null)[];
                      readonly message: string;
                    }
                )[];
              };
            };
            outputFormat: "json";
            status: 400;
          }
        | {
            input: {
              param: {
                userId: string;
              };
            };
            output: {
              data: any;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
          }
        | {
            input: {
              param: {
                userId: string;
              };
            };
            output: {
              error: any;
            };
            outputFormat: "json";
            status: 404 | 500;
          };
    };
  } & {
    "/guilds/:userId": {
      $get: {
        input: {
          param: {
            userId: string;
          };
        };
        output: any;
        outputFormat: "json";
        status: import("hono/utils/http-status").ContentfulStatusCode;
      };
    };
  } & {
    "/:userId/discord": {
      $get: {
        input: {
          param: {
            userId: string;
          };
        };
        output: any;
        outputFormat: "json";
        status: import("hono/utils/http-status").ContentfulStatusCode;
      };
    };
  } & {
    "/channels/:channelId/discord": {
      $get: {
        input: {
          param: {
            channelId: string;
          };
        };
        output: any;
        outputFormat: "json";
        status: import("hono/utils/http-status").ContentfulStatusCode;
      };
    };
  },
  "/",
  "/channels/:channelId/discord"
>;
