# Bun SQS SST Template

A serverless bun sqs sst template built with [SST (Serverless Stack)](https://sst.dev/) and AWS SQS for scalable video analytics.

## 🏗️ Architecture

This template demonstrates:
- **SST v3** for infrastructure as code
- **AWS Lambda** for serverless compute
- **Amazon SQS** for message queuing
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
│   └── index.ts          # Lambda function handler
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

### POST `/send`
Send a video URL for tracking.

**Request:**
```json
{
  "videoUrl": "https://example.com/video.mp4",
  "userId": "user123",
  "metadata": {
    "platform": "web",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Video URL sent to queue successfully!"
}
```

## 🏷️ Adding SQS Integration

To complete the SQS integration, update your `sst.config.ts`:

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
    // Create SQS Queue
    const queue = new sst.aws.Queue("ViewTrackingQueue", {
      fifo: false,
    });

    // Create Lambda Function
    const api = new sst.aws.Function("ViewTracker", {
      handler: "src/index.handler",
      link: [queue],
      url: true,
    });

    return {
      api: api.url,
      queue: queue.url,
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
# Test the API endpoint
curl -X POST https://your-api-url/send \
  -H "Content-Type: application/json" \
  -d '{"videoUrl": "https://example.com/video.mp4"}'
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
- SQS queue metrics
- API Gateway metrics

## 🛠️ Customization

### Adding Environment Variables

Update your function configuration in `sst.config.ts`:

```typescript
const api = new sst.aws.Function("ViewTracker", {
  handler: "src/index.handler",
  environment: {
    DATABASE_URL: "your-database-url",
    API_KEY: "your-api-key",
  },
  link: [queue],
});
```

### Adding Dependencies

```bash
bun add package-name
bun add -d @types/package-name  # For TypeScript types
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
- [AWS SQS Documentation](https://docs.aws.amazon.com/sqs/)
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