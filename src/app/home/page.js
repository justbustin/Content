'use client'
import { db } from '../../firebase-config';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import Chat from "../../components/home/chat";
import ScheduledPost from '../../components/home/post';
import { auth } from '../../firebase-config';
import { collection, query, getDocs, where, doc, getDoc } from 'firebase/firestore';
import { Router } from 'next/router';
import BrandInit from '../../components/home/brandinit';
import Metric from '../../components/home/metric';
import { SocialMediaCard } from '@/components/social-media-card';
import { Badge } from "@/components/ui/badge"



export default function HomeChat() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasBrandSet, setHasBrandSet] = useState(false);
  const [brand, setBrand] = useState(null);

  const hasBrand = async (currentUser) => {
    try {
      const userRef = collection(db, 'users', currentUser.uid, 'brand');
      const brandDocs = await getDocs(userRef);
      return brandDocs.docs.length > 0;
    } catch (error) {
      console.error("Error checking for brand:", error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const brandExists = await hasBrand(currentUser);
        setHasBrandSet(brandExists);
        if (brandExists) {
          const userRef = collection(db, 'users', currentUser.uid, 'brand');
          const brandDocs = await getDocs(userRef);
          const brandDoc = brandDocs.docs[0];
          setBrand(brandDoc.data());
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>You must be logged in to view this page</div>;
  }

  return (
      hasBrandSet && brand ? (
        <div className="container mx-auto p-4">
        <h3 className="text-2xl font-bold">{brand.name}</h3>
        <p className="text-lg font-semibold text-gray-600 ">Your brand as a whole - analyze and revamp your brand</p>
        
        
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-start grid-auto-rows-min">
        <SocialMediaCard
            title="Brand Strategy 💡"
            subtitle="Our brand promise"
            bodyContent={[
              <div key="strategy" className="space-y-2">
                <h3 className="text-lg font-semibold">Brand Promise</h3>
                <p>{brand.strategy.brandPromise}</p>
              </div>
            ]}
            onRegenerate={() => {}}
          />
        <SocialMediaCard
          title="Brand Core 🌟"
          subtitle="Our vision, mission, and values"
          bodyContent={[
            <div key="core" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Vision</h3>
                <p>{brand.brandCore.vision}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Mission</h3>
                <p>{brand.brandCore.mission}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Values</h3>
                <p>{brand.brandCore.values}</p>
              </div>
            </div>
          ]}
          onRegenerate={() => {}}
        />

        <SocialMediaCard
          title="Brand Voice 💬"
          subtitle="Our expression and key attributes"
          bodyContent={[
            <div key="voice" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Expression</h3>
                <p>{brand.brandVoice.expression}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Key Attributes</h3>
                <ul className="list-disc list-inside">
                  {brand.brandVoice.attributes.map((attribute, index) => (
                    <Badge className="mr-2 mb-2" key={index}>{attribute}</Badge>
                  ))}
                </ul>
              </div>
            </div>
          ]}
          onRegenerate={() => {}}
        />

        <SocialMediaCard
          title="Target Audiences 👥"
          subtitle="Our primary and secondary target audiences"
          bodyContent={[
            <div key="audiences" className="space-y-4">
              {brand.potentialAudiences.map((audience, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold">{audience.audienceType}</h3>
                  <p>{audience.description}</p>
                  <p className="text-sm text-muted-foreground">{audience.value}</p>
                </div>
              ))}
            </div>
          ]}
          onRegenerate={() => {}}
        />

        
      </div>
    </div>


      ) : (
        <div className="h-screen w-screen flex flex-row justify-center items-center">
          <BrandInit setHasBrandSet={setHasBrandSet} />
      </div>
      )
    );
}
