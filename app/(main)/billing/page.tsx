"use client";

import React from "react";
import { 
  Check, 
  Info, 
  Zap, 
  Crown, 
  Rocket, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DAILY_CREDIT_LIMIT } from "@/lib/constants";

/**
 * Minimal Billing Page
 * Clean, monochrome-first design with subtle accents.
 */
export default function BillingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for testing the creative waters.",
      features: [
        `${DAILY_CREDIT_LIMIT} imaginations per day`,
        "Standard generation priority",
        "Community support"
      ],
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
      icon: <Zap className="size-5" />,
      current: true
    },
    {
      name: "Pro",
      price: "$19",
      description: "For creators who need more power.",
      features: [
        "50 imaginations per day",
        "Priority processing",
        "Early access to new models",
        "Private generations"
      ],
      buttonText: "Coming Soon",
      buttonVariant: "secondary" as const,
      icon: <Rocket className="size-5" />,
      popular: true
    },
    {
      name: "Ultra",
      price: "$49",
      description: "Maximum throughput for professionals.",
      features: [
        "150 imaginations per day",
        "Max processing speed",
        "Dedicated VIP support",
        "Commercial usage rights"
      ],
      buttonText: "Coming Soon",
      buttonVariant: "secondary" as const,
      icon: <Crown className="size-5" />
    }
  ];

  return (
    <div className="flex flex-1 flex-col bg-background overflow-y-auto scrollbar-hide">
      <main className="flex-1 p-6 md:p-8 lg:p-12">
        <div className="mx-auto max-w-5xl w-full">
          {/* Page Heading */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Billing & Plans</h1>
            <p className="text-muted-foreground text-sm max-w-xl">
              Straightforward pricing for creators of all levels. Upgrade to unlock higher caps.
            </p>
          </div>

          {/* MINIMAL SERVICE NOTICE */}
          <div className="mb-16 py-4 border-y border-border/50 flex items-center justify-between text-muted-foreground/80 italic text-xs">
            <span className="flex items-center gap-2">
               <Info className="size-3" />
               The billing service is currently in maintenance and unavailable.
            </span>
            <span className="text-[10px] font-bold opacity-40">Offline</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={cn(
                  "relative flex flex-col border bg-card transition-all duration-300",
                  plan.current ? "border-foreground/20 ring-1 ring-foreground/20" : "border-border/50",
                  "hover:border-foreground/30"
                )}
              >

                <CardHeader className="pb-8">
                  <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                        {plan.popular && (
                           <Badge className="bg-foreground/10 text-foreground border-none px-1.5 py-0 text-[8px] font-bold h-4">
                              Popular
                           </Badge>
                        )}
                     </div>
                     <div className="text-muted-foreground opacity-50">{plan.icon}</div>
                  </div>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-xs">/mo</span>
                  </div>
                  <CardDescription className="pt-2 text-[11px] leading-relaxed min-h-[40px]">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 pb-8">
                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 text-[11px] text-muted-foreground">
                        <Check className="size-3 text-foreground/40 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-0 px-6 pb-6 mt-auto">
                  <Button 
                    className={cn(
                      "w-full h-10 rounded-lg text-xs font-bold transition-all",
                      plan.current && "bg-muted text-muted-foreground hover:bg-muted cursor-default"
                    )}
                    variant={plan.buttonVariant}
                    disabled={plan.current || plan.buttonText === "Coming Soon"}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Footer Assistance */}
          <div className="mt-24 pt-8 border-t border-border/30">
             <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-muted-foreground/50 font-medium">
                  Enterprise enquiries available via support
                </p>
                <div className="flex items-center gap-6">
                   <button className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">Legal</button>
                   <button className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">Terms</button>
                   <button className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">Support</button>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
