import { z } from "zod";
export declare const guilds: import("hono/hono-base").HonoBase<
  import("hono/types").BlankEnv,
  (((
    | {
        "/:guildId/discord": {
          $get: {
            input: {
              param: {
                guildId: string;
              };
            };
            output: any;
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
          };
        };
      }
    | (import("hono/types").MergeSchemaPath<
        {
          "/all": {
            $get:
              | {
                  input: {};
                  output: {
                    error: {
                      code: string;
                      message: string;
                    };
                  };
                  outputFormat: "json";
                  status: 401;
                }
              | {
                  input: {};
                  output: any;
                  outputFormat: "json";
                  status: 200;
                }
              | {
                  input: {};
                  output: {
                    error: {
                      code: string;
                      message: string;
                      details: string | null;
                    };
                  };
                  outputFormat: "json";
                  status: 500;
                };
          };
        } & {
          "/:id": {
            $get:
              | {
                  input: {
                    param: {
                      id: string;
                    };
                  };
                  output: any;
                  outputFormat: "json";
                  status: 200;
                }
              | {
                  input: {
                    param: {
                      id: string;
                    };
                  };
                  output: {
                    error: {
                      code: string;
                      message: string;
                    };
                  };
                  outputFormat: "json";
                  status: 401;
                }
              | {
                  input: {
                    param: {
                      id: string;
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
                      id: string;
                    };
                  };
                  output: {
                    error: {
                      code: string;
                      message: string;
                      details: string | null;
                    };
                  };
                  outputFormat: "json";
                  status: 500;
                };
          };
        } & {
          "/details/:id": {
            $get:
              | {
                  input: {
                    param: {
                      id: string;
                    };
                  };
                  output: any;
                  outputFormat: "json";
                  status: 200;
                }
              | {
                  input: {
                    param: {
                      id: string;
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
                      id: string;
                    };
                  };
                  output: {
                    error: {
                      code: string;
                      message: string;
                    };
                  };
                  outputFormat: "json";
                  status: 404;
                }
              | {
                  input: {
                    param: {
                      id: string;
                    };
                  };
                  output: {
                    error: {
                      code: string;
                      message: string;
                      details: string | null;
                    };
                  };
                  outputFormat: "json";
                  status: 500;
                };
          };
        } & {
          "/": {
            $post:
              | {
                  input: {};
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
                  input: {};
                  output: {
                    data: any;
                  };
                  outputFormat: "json";
                  status: 200;
                }
              | {
                  input: {};
                  output: {
                    error: {
                      code: string;
                      message: string;
                    };
                  };
                  outputFormat: "json";
                  status: 400;
                }
              | {
                  input: {};
                  output: {
                    error: {
                      code: string;
                      message: string;
                    };
                  };
                  outputFormat: "json";
                  status: 404;
                }
              | {
                  input: {};
                  output: {
                    error: {
                      code: string;
                      message: string;
                      details: string | null;
                    };
                  };
                  outputFormat: "json";
                  status: 500;
                };
          };
        } & {
          "/": {
            $patch:
              | {
                  input: {};
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
                  input: {};
                  output: {
                    data: any;
                  };
                  outputFormat: "json";
                  status: 200;
                }
              | {
                  input: {};
                  output: {
                    error: {
                      code: string;
                      message: string;
                    };
                  };
                  outputFormat: "json";
                  status: 404;
                }
              | {
                  input: {};
                  output: {
                    error: {
                      code: string;
                      message: string;
                    };
                  };
                  outputFormat: "json";
                  status: 400;
                }
              | {
                  input: {};
                  output: {
                    error: {
                      code: string;
                      message: string;
                      details: string | null;
                    };
                  };
                  outputFormat: "json";
                  status: 500;
                };
          };
        } & {
          "/": {
            $delete:
              | {
                  input: {};
                  output: {
                    error: {
                      code: string;
                      message: string;
                      details: {
                        _errors: string[];
                        id?:
                          | {
                              [x: string]: any;
                              _errors: string[];
                            }
                          | undefined;
                        guildId?:
                          | {
                              [x: string]: any;
                              _errors: string[];
                            }
                          | undefined;
                      };
                    };
                  };
                  outputFormat: "json";
                  status: 400;
                }
              | {
                  input: {};
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
                  input: {};
                  output: {
                    data: {
                      message: string;
                    };
                  };
                  outputFormat: "json";
                  status: 200;
                }
              | {
                  input: {};
                  output: {
                    error: {
                      code: string;
                      message: string;
                    };
                  };
                  outputFormat: "json";
                  status: 404;
                }
              | {
                  input: {};
                  output: {
                    error: {
                      code: string;
                      message: string;
                      details: string | null;
                    };
                  };
                  outputFormat: "json";
                  status: 500;
                };
          };
        },
        "/scheduledmessage"
      > & {
        "/:guildId/discord": {
          $get: {
            input: {
              param: {
                guildId: string;
              };
            };
            output: any;
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
          };
        };
      })
  ) & {
    "/:guildId/channels": {
      $get: {
        input: {
          param: {
            guildId: string;
          };
        };
        output: any;
        outputFormat: "json";
        status: import("hono/utils/http-status").ContentfulStatusCode;
      };
    };
  }) & {
    "/:guildId": {
      $get:
        | {
            input: {
              param: {
                guildId: string;
              };
            };
            output: any;
            outputFormat: "json";
            status: 200;
          }
        | {
            input: {
              param: {
                guildId: string;
              };
            };
            output: {
              error: {
                code: string;
                message: string;
                details: {
                  addIssue: never;
                  addIssues: never;
                  isEmpty: boolean;
                  type: string;
                  issues: (
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
                  _zod: {
                    output: string;
                    def: (
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                  stack?: string | undefined;
                  name: string;
                  message: string;
                  cause?: import("hono/utils/types").JSONValue | undefined;
                };
              };
            };
            outputFormat: "json";
            status: 400;
          }
        | {
            input: {
              param: {
                guildId: string;
              };
            };
            output: {
              error: {
                code: string;
                message: string;
                details: {
                  addIssue: never;
                  addIssues: never;
                  isEmpty: boolean;
                  type: string[] | undefined;
                  issues: (
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
                  _zod: {
                    output: string[] | undefined;
                    def: (
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                  stack?: string | undefined;
                  name: string;
                  message: string;
                  cause?: import("hono/utils/types").JSONValue | undefined;
                };
              };
            };
            outputFormat: "json";
            status: 400;
          }
        | {
            input: {
              param: {
                guildId: string;
              };
            };
            output: {
              error: {
                code: string;
                message: string;
              };
            };
            outputFormat: "json";
            status: 404;
          }
        | {
            input: {
              param: {
                guildId: string;
              };
            };
            output: {
              error: {
                code: string;
                message: string;
                details: string | null;
              };
            };
            outputFormat: "json";
            status: 500;
          };
    };
  }) & {
    "/members/:userId": {
      $get:
        | {
            input: {
              param: {
                userId: string;
              };
            };
            output: any;
            outputFormat: "json";
            status: 200;
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
                details: {
                  addIssue: never;
                  addIssues: never;
                  isEmpty: boolean;
                  type: string;
                  issues: (
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
                  _zod: {
                    output: string;
                    def: (
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly pattern?:
                                              | string
                                              | undefined;
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
                                            readonly exact?:
                                              | boolean
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
                                            readonly exact?:
                                              | boolean
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
                  stack?: string | undefined;
                  name: string;
                  message: string;
                  cause?: import("hono/utils/types").JSONValue | undefined;
                };
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
                details: string | null;
              };
            };
            outputFormat: "json";
            status: 500;
          };
    };
  },
  "/",
  "/members/:userId"
>;
