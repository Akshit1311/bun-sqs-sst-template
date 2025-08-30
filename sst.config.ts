/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "bun-sst-template",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const trpc = new sst.aws.Function("Trpc", {
      url: true,
      handler: "src/index.handler",
    });

    const client = new sst.aws.Function("Client", {
      url: true,
      link: [trpc],
      handler: "src/client.handler",
    });

    return {
      api: trpc.url,
      client: client.url,
    };
  },
});
