# Bun SST Template

A serverless bun sst template built with [SST (Serverless Stack)](https://sst.dev/) and tRPC for type-safe API development.

## 🏗️ Architecture

This template demonstrates:
- **SST v3** for infrastructure as code
- **AWS Lambda** for serverless compute
- **tRPC** for type-safe API development
- **TypeScript** for type safety
- **Bun** for fast package management and runtime

## 📋 Prerequisites

- [Bun](https://bun.sh/) >= 1.1.0
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials
- [SST CLI](https://sst.dev/) >= 3.0.0

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Start Development

```bash
bun run dev
```

This will:
- Deploy your stack to AWS in development mode
- Start the SST Live Lambda Development environment
- Watch for changes and hot-reload your functions

### 3. Deploy to Production

```bash
bun run deploy --stage production
```

### 4. Clean Up

```bash
bun run remove
```

## 📁 Project Structure

```
bun-sqs-sst-template/
├── src/
│   ├── index.ts          # tRPC server handler
│   └── client.ts         # tRPC client example
├── sst.config.ts         # SST configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## 🔧 Configuration

### SST Configuration (`sst.config.ts`)

The SST configuration defines:
- App name and removal policies
- Stage-specific protections
- AWS as the cloud provider

### Environment Variables

Create a `.env` file for local development:

```env
# AWS Configuration (if not using AWS CLI)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# Application Configuration
STAGE=dev
```

## 📊 API Endpoints

### tRPC Procedures

#### `greet`
Greets a user with their name.

**Input:**
```typescript
{
  name: string
}
```

**Response:**
```typescript
string // "Hello {name}!"
```

**Example usage:**
```typescript
const result = await client.greet.query({ name: "John" });
// Returns: "Hello John!"
```

## 🏷️ tRPC Integration

The template includes a complete tRPC setup with type-safe API development:

```typescript
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "bun-sqs-sst-template",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    // Create tRPC Server
    const trpc = new sst.aws.Function("Trpc", {
      url: true,
      handler: "src/index.handler",
    });

    // Create tRPC Client Example
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
```

## 🔨 Development Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development with SST Live |
| `bun run deploy` | Deploy to AWS |
| `bun run deploy --stage prod` | Deploy to production |
| `bun run remove` | Remove all AWS resources |

## 🧪 Testing

### Local Testing

```bash
# Test the handler locally
bun test

# Or use SST's built-in testing
sst shell
```

### API Testing

```bash
# Test the tRPC endpoint
curl -X POST https://your-api-url/greet \
  -H "Content-Type: application/json" \
  -d '{"name": "World"}'

# Or use the client function URL directly
curl https://your-client-url
```

## 📦 Deployment Stages

### Development
- Resources are removed when stack is destroyed
- No protection against accidental deletion
- Ideal for testing and development

### Production
- Resources are retained when stack is destroyed
- Protected against accidental deletion
- Requires explicit confirmation for destructive operations

## 🔍 Monitoring

### CloudWatch Logs
View logs in AWS CloudWatch:
```bash
sst console
```

### Metrics
Monitor your service with:
- Lambda function metrics
- tRPC request/response metrics
- API Gateway metrics

## 🛠️ Customization

### Adding Environment Variables

Update your function configuration in `sst.config.ts`:

```typescript
const trpc = new sst.aws.Function("Trpc", {
  handler: "src/index.handler",
  environment: {
    DATABASE_URL: "your-database-url",
    API_KEY: "your-api-key",
  },
  url: true,
});
```

### Adding Dependencies

```bash
bun add package-name
bun add -d @types/package-name  # For TypeScript types

# tRPC is already included:
# @trpc/client @trpc/server zod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `bun test`
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [SST Documentation](https://sst.dev/docs/)
- [tRPC Documentation](https://trpc.io/docs)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Bun Documentation](https://bun.sh/docs)

## 🐛 Troubleshooting

### Common Issues

**SST not found:**
```bash
npm install -g sst@latest
# or
bun add -g sst@latest
```

**AWS credentials not configured:**
```bash
aws configure
```

**TypeScript errors:**
```bash
bun add -d typescript@latest
```

For more help, check the [SST Discord](https://discord.gg/sst) community.