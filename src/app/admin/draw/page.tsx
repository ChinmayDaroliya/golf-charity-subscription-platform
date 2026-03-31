"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DrawPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runDraw = async () => {
    setLoading(true);
    const res = await fetch("/api/draw/run", { method: "POST" });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Run Monthly Draw</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runDraw} disabled={loading}>
            {loading ? "Running..." : "Run Draw"}
          </Button>
          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Draw Numbers: {result.drawNumbers?.join(", ")}</h3>
              <pre className="mt-4 bg-gray-100 p-4 rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}