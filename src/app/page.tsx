import { Footer } from "@/components/footer";
import { LandingNavbar } from "@/components/landing-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import data from "@/data/data.json";
import { protocol } from "@/lib/utils";
import { PricingTable } from "@clerk/nextjs";
import { ArrowRight, Code, Download, Palette, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full relative min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="px-4 text-center flex flex-col items-center justify-center min-h-[80vh] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by Advanced AI
          </Badge>

          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6 leading-tight">
            AI Art Generator
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Unleash your creativity! Instantly generate stunning artwork using
            the power of artificial intelligence. Enter a prompt and watch your
            imagination come to life.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <Button size="lg" className="px-8 py-3 text-lg font-semibold">
              <a
                href={`${protocol}://app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
              >
                Get Started
              </a>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              <Code className="w-5 h-5 mr-2" />
              Developer API
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">
                Images Generated
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">5K+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">99%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-16" />

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything you need to create
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and features to bring your artistic vision to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  Instant Art Generation
                </CardTitle>
                <CardDescription className="text-base">
                  Generate beautiful artwork in seconds using advanced AI
                  models.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Simply enter your prompt and let the AI do the magic. No
                  artistic skills required!
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  High-Resolution Output
                </CardTitle>
                <CardDescription className="text-base">
                  Download your creations in stunning high resolution, perfect
                  for sharing or printing.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Export your images in multiple formats and sizes to suit your
                  needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Developer API</CardTitle>
                <CardDescription className="text-base">
                  Integrate AI art generation into your own apps with our
                  easy-to-use API.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Access powerful endpoints and extensive documentation for
                  seamless integration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-16" />

      {/* Gallery Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Gallery
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              See what's possible
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore stunning AI-generated artwork created by our community
            </p>
          </div>

          <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
            {data.slice(0, 12).map((item, index) => (
              <div key={index} className="mb-4 break-inside-avoid group">
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <img
                    src={item.imageUrl}
                    alt={item.altText}
                    width={item.width}
                    height={item.height}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="my-16" />

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose your plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock premium features and take your creativity to the next level
            </p>
          </div>
          <PricingTable />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
