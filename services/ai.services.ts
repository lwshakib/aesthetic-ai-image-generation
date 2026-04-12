export interface GenerateImageParams {
  prompt: string;
  model: string;
  num_steps?: number;
  width?: number;
  height?: number;
  guidance?: number;
  format?: string; // requested format
  images?: string[]; // base64 strings or URLs
}

export interface AIChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIImageResult {
  buffer: Buffer;
  format: string; // actual detected format
}

class AIService {
  private endpoint: string;
  private apiKey: string;

  constructor() {
    this.endpoint = process.env.CLOUDFLARE_AI_GATEWAY_ENDPOINT || "";
    this.apiKey = process.env.CLOUDFLARE_AI_GATEWAY_API_KEY || "";
  }

  /**
   * Generate an image using Cloudflare AI Gateway
   */
  async generateImage(params: GenerateImageParams): Promise<AIImageResult> {
    if (!this.endpoint || !this.apiKey) {
      throw new Error("Cloudflare AI Gateway configuration is missing.");
    }

    console.log(`[AIService] Generating image with model: ${params.model}`);
    
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: params.model,
        prompt: params.prompt,
        steps: params.num_steps || 4,
        width: params.width || 1024,
        height: params.height || 1024,
        guidance: params.guidance || 7.5,
        // Optional images for image-to-image or multi-reference
        images: params.images,
        image: params.images?.[0], // Fallback for models expecting a single image
        // Some providers might support this convention:
        response_format: params.format === "jpeg" ? "jpeg" : "png" 
      }),
    });

    const contentType = response.headers.get("content-type") || "";
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI generation failed: ${response.statusText} - ${errorText}`);
    }

    let buffer: Buffer;

    if (contentType.includes("application/json")) {
      const data = await response.json();
      const base64 = data.image || data.result?.image;
      if (!base64) {
        throw new Error("Received JSON but no image data found.");
      }
      buffer = Buffer.from(base64, "base64");
    } else {
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    // Auto-detect format from magic numbers
    let actualFormat = "png";
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
      actualFormat = "jpeg";
    } else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      actualFormat = "png";
    } else if (buffer.toString("utf8", 8, 12) === "WEBP") {
      actualFormat = "webp";
    }
    
    console.log(`[AIService] Image generated. Detected format: ${actualFormat}. Size: ${(buffer.length/1024).toFixed(2)} KB`);

    return { buffer, format: actualFormat };
  }

  /**
   * Generate text using GLM-4.7-Flash via Cloudflare AI Gateway
   */
  async generateText(messages: AIChatMessage[]): Promise<string> {
    if (!this.endpoint || !this.apiKey) {
      throw new Error("Cloudflare AI Gateway configuration is missing.");
    }

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "glm-4.7-flash",
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI text generation failed: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }

  /**
   * Generate a structured object using GLM-4.7-Flash via Cloudflare AI Gateway
   */
  async generateObject<T>(messages: AIChatMessage[], schema: Record<string, unknown>): Promise<T> {
    if (!this.endpoint || !this.apiKey) {
      throw new Error("Cloudflare AI Gateway configuration is missing.");
    }

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "glm-4.7-flash",
        messages,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "structured_response",
            strict: true,
            schema,
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI object generation failed: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";
    
    try {
      // The AI should return valid JSON string in message.content
      return JSON.parse(content) as T;
    } catch {
      console.error("Failed to parse structured output:", content);
      throw new Error("Failed to parse AI response as valid JSON.");
    }
  }
}

export const aiService = new AIService();
