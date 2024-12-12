import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from 'lucide-react'




export function SocialMediaCard({ title, subtitle, bodyContent, className, onRegenerate }) {
  return (
    <Card className={`w-full ${className} group`}>
    <CardHeader className="relative bg-gray-100">
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <CardDescription className="text-sm text-muted-foreground">{subtitle}</CardDescription>
      <Button 
        variant="outline" 
        size="sm" 
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-green-500 hover:text-white"
        onClick={onRegenerate}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Regenerate
      </Button>
    </CardHeader>
    {bodyContent.map((content, index) => (
      <CardContent key={index} className="pt-4">
        {content}
      </CardContent>
    ))}
  </Card>
  )
}

