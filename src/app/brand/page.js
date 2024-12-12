import { SocialMediaCard } from "@/components/social-media-card"

export default function BrandingPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold mb-8">Branding</h1>
      
      <div className="flex flex-row space-x-8">
        <SocialMediaCard
          title="Brand Voice"
          subtitle="Defining your brand's personality and tone"
          bodyContent={[
            <div key="voice" className="space-y-2">
              <p>Your brand voice is: <strong>Friendly, Professional, Innovative</strong></p>
              <p>Key characteristics:</p>
              <ul className="list-disc list-inside">
                <li>Use a conversational tone</li>
                <li>Highlight expertise without being overly technical</li>
                <li>Emphasize forward-thinking ideas and solutions</li>
              </ul>
            </div>
          ]}
          className="max-w-2xl mx-auto"
        />

        <SocialMediaCard
          title="Visual Identity"
          subtitle="Consistent visual elements across platforms"
          bodyContent={[
            <div key="colors" className="space-y-2">
              <h3 className="text-lg font-semibold">Color Palette</h3>
              <div className="flex space-x-2">
                <div className="w-12 h-12 bg-blue-500 rounded"></div>
                <div className="w-12 h-12 bg-green-400 rounded"></div>
                <div className="w-12 h-12 bg-yellow-300 rounded"></div>
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
              </div>
            </div>,
            <div key="typography" className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Typography</h3>
              <p className="font-sans">Primary Font: Sans-serif (for body text)</p>
              <p className="font-serif">Secondary Font: Serif (for headings)</p>
            </div>
          ]}
          className="max-w-2xl mx-auto"
        />

        <SocialMediaCard
          title="Content Pillars"
          subtitle="Core themes for your social media content"
          bodyContent={[
            <div key="pillars" className="space-y-2">
              <ul className="list-disc list-inside">
                <li>Industry Insights</li>
                <li>Product Showcases</li>
                <li>Customer Success Stories</li>
                <li>Behind-the-Scenes</li>
                <li>Educational Content</li>
              </ul>
            </div>,
            <div key="ratio" className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Content Ratio</h3>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-3/12"></div>
              </div>
              <p className="text-sm mt-1">Aim for 80% value-add content, 20% promotional</p>
            </div>
          ]}
          className="max-w-2xl mx-auto"
        />
      </div>
    </div>
  )
}

