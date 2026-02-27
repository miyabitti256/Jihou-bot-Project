export declare const minigame: import("hono/hono-base").HonoBase<
  import("hono/types").BlankEnv,
  | import("hono/types").BlankSchema
  | import("hono/types").MergeSchemaPath<
      {
        "/result/:userId": {
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
                status: 500;
              };
        };
      } & {
        "/draw": {
          $post:
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
                    message: string;
                    code: string;
                  };
                };
                outputFormat: "json";
                status: 401;
              }
            | {
                input: {};
                output: {
                  error: any;
                };
                outputFormat: "json";
                status: 400 | 404 | 500;
              };
        };
      },
      "/omikuji"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/play": {
          $post: {
            input: {};
            output: any;
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
          };
        };
      } & {
        "/status/:userId": {
          $get:
            | {
                input: {
                  param: {
                    userId: string;
                  };
                };
                output: {
                  error: {
                    message: string;
                    code: string;
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
                  error: {
                    message: string;
                    code: string;
                  };
                };
                outputFormat: "json";
                status: 500;
              };
        };
      } & {
        "/history/:userId": {
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
      },
      "/coinflip"
    >,
  "/",
  "/"
>;
