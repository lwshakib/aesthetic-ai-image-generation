<div align="left">
  <img src="public/logo.svg" alt="Aesthetic AI Logo" width="80" height="80" />
</div>

# Aesthetic AI - Advanced Image Generation

A professional-grade AI image generation platform built with **Next.js 16**, **React 19**, and **Cloudflare AI Gateway**. Create stunning, high-fidelity imagery with advanced aesthetic controls, multi-reference image-to-image synthesis, and real-time streaming results.

![App Demo](public/app-demo.png)

## ✨ Features

- **🎨 Advanced workstation**: Precise control over aspect ratios (1:1, 2:3, 16:9, or custom), inference steps, and curated artistic styles.
- **🖼️ Image-to-image synthesis**: Use up to 2 reference images to guide your generations with structure and composition.
- **⚡ Real-time streaming**: Watch your images come to life with NDJSON streaming responses directly from the AI engine.
- **🤖 Prompt intelligence**: Automatically expand simple ideas into detailed, high-quality prompts using **GLM-4.7-Flash**.
- **🖌️ Style adherence**: Integrated aesthetic keywords ensure generated prompts match your chosen workstation style (Cinematic, Vibrant, etc).
- **🔐 Minimalist dashboard**: A jargon-free settings and billing interface for clean account management.
- **📦 Reliable storage**: Persistent image hosting on **Cloudflare R2** with prompt and metadata history.

## 🤖 Supported Models

Aesthetic AI leverages a diverse lineup of professional-grade models:
- **FLUX.1 [schnell]**: Recommended for lightning-fast preview generations.
- **FLUX.2 [dev]**: High-fidelity synthesis with full image-to-image and multi-reference support.
- **FLUX.2 [klein] (4B/9B)**: Optimized distilled models for speed-to-quality balance.
- **Leonardo Phoenix**: Superior prompt adherence for complex textual descriptions.

## 💳 Credits & Usage

To ensure fair access and sustainable generation, the platform uses a daily credit system:
- **Daily limit**: Every user receives 4 credits per day.
- **Cost**: 1 credit per individual image generated.
- **Batching**: If you generate a batch of 4 images, it will consume your full daily quota.
- **Reset**: Credits are reset automatically every 24 hours.

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **AI Infrastructure**: [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- **Models**: [FLUX.1-schnell](https://blackforestlabs.ai/), [GLM-4.7-Flash](https://github.com/THUDM/GLM-4)
- **Runtime**: [Bun](https://bun.sh/)

## 📐 System Architecture

```mermaid
graph TD
    User([User]) <--> Frontend[Next.js App Router]
    Frontend <--> API[API Routes /api/ai/generate]
    API <--> AI[Cloudflare AI Gateway]
    AI <--> FLUX[FLUX.1 Image Gen]
    AI <--> GLM[GLM-4 Prompt Expand]
    API <--> S3[Cloudflare R2 Storage]
    API <--> DB[(PostgreSQL / Prisma)]
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed locally.
- A PostgreSQL database instance.
- Cloudflare AI Gateway & R2 Bucket credentials.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/aesthetic-ai-image-generation.git
   cd aesthetic-ai-image-generation
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/aesthetic_ai"
   BETTER_AUTH_SECRET="your_secret"
   CLOUDFLARE_AI_GATEWAY_ENDPOINT="https://gateway.ai.cloudflare.com/v1/..."
   CLOUDFLARE_AI_GATEWAY_API_KEY="your_api_key"
   S3_ENDPOINT="your_r2_endpoint"
   S3_ACCESS_KEY_ID="your_access_key"
   S3_SECRET_ACCESS_KEY="your_secret_key"
   S3_BUCKET_NAME="your_bucket_name"
   ```

4. **Initialize Database**:
   ```bash
   bun x prisma db push
   bun x prisma generate
   ```

5. **Run the Development Server**:
   ```bash
   bun run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to start generating.

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
