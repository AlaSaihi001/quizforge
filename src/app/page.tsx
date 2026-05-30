import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-800 ">
      <h1 className="text-4xl font-bold">shadcn/ui fonctionne !</h1>

      <div className="flex gap-3">
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <div className="flex gap-3">
        <Badge>Free</Badge>
        <Badge variant="secondary">Pro</Badge>
        <Badge variant="destructive">Expired</Badge>
      </div>

      <Card className="w-80">
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Contenu de la carte</p>
        </CardContent>
      </Card>
    </main>
  );
}
