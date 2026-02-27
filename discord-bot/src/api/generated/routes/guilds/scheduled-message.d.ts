export declare const message: import("hono/hono-base").HonoBase<
  import("hono/types").BlankEnv,
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
  "/",
  "/"
>;
