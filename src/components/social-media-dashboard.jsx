'use client';
import { useState, useEffect } from 'react'
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { useSearchParams } from 'next/navigation';
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export default function SocialMediaDashboard({ setTokens }) {
  const searchParams = useSearchParams();
  const [platforms, setPlatforms] = useState([
    { name: 'Facebook', icon: <Facebook className="h-6 w-6" />, isAuthenticated: false, isEnabled: false },
    { name: 'Twitter', icon: <Twitter className="h-6 w-6" />, isAuthenticated: false, isEnabled: false },
    { name: 'LinkedIn', icon: <Linkedin className="h-6 w-6" />, isAuthenticated: false, isEnabled: false },
    { name: 'Instagram', icon: <Instagram className="h-6 w-6" />, isAuthenticated: false, isEnabled: false },
  ])

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setPlatforms(prevPlatforms => 
        prevPlatforms.map((platform) => 
          platform.name === 'LinkedIn' ? { ...platform, isAuthenticated: true } : platform))
      
      setTokens(prevTokens => ({ ...prevTokens, linkedin: token }))
    }
  }, [searchParams])

  const handleToggle = (index) => {
    setPlatforms(prevPlatforms => 
      prevPlatforms.map((platform, i) => 
        i === index ? { ...platform, isEnabled: !platform.isEnabled } : platform))
  }

  const handleAuthenticate = async (index) => {
    if (platforms[index].name === 'LinkedIn') {
      // window.location.href = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86a1rd3ebng0r2&redirect_uri=http://localhost:3000/generate&state=foobaasdasdr&scope=w_member_social'
      window.location.href = '/api/linkedin/auth';
    }
  }

  return (
    (<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Where to post</h2>
      {platforms.map((platform, index) => (
        <div
          key={platform.name}
          className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-md">
          <div className="flex items-center space-x-4">
            {platform.icon}
            <span className="font-medium">{platform.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            {platform.isAuthenticated ? (
              <Switch checked={platform.isEnabled} onCheckedChange={() => handleToggle(index)} />
            ) : (
              <Button variant="outline" size="sm" onClick={() => handleAuthenticate(index)}>
                Authenticate
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>)
  );
}

