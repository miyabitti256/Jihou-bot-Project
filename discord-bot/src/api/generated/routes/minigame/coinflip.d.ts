export declare const coinflip: import("hono/hono-base").HonoBase<
  import("hono/types").BlankEnv,
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
  "/",
  "/history/:userId"
>;
