export const handler = async (event: any) => {
  // Handle different event structures
  const httpMethod = event.httpMethod || event.requestContext?.http?.method;
  const path =
    event.path || event.rawPath || event.requestContext?.http?.path || "/";
  const queryStringParameters = event.queryStringParameters || {};
  const body = event.body;

  if (httpMethod === "POST" && path === "/send") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Video URL sent to queue successfully!",
      }),
    };
  }

  return {
    statusCode: 404,
    body: JSON.stringify({
      error: "Not found",
      debug: {
        httpMethod,
        path,
        availablePaths: ["/send"],
      },
    }),
  };
};
