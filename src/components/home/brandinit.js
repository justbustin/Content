"use client"

import { useState } from 'react';
import Metric from './metric';
import { db, auth } from '../../firebase-config';

import { addDoc, setDoc, collection, getDocs, query, where, doc } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress'

export default function BrandInit({setHasBrandSet}) {
  const [step, setStep] = useState(1);
  const [link, setLink] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const user = auth.currentUser;

  const handleNext = async () => {
    if (step === 1) {
      try {
        setStep(step + 1);
        const response = await fetch('/api/hello', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "url": link }),
        });
        const data = await response.json();
        const text = data.text.replace(/([""]+)/g, '"');
        console.log('text', text)
        const parsed = JSON.parse(text);
        parsed.images = data.images
        setApiResponse(parsed);
      } catch (error) {
        console.error('Error checking link:', error);
      }
    } else {
      setStep(step + 1);
    }
  };

  const onComplete = async () => {
    try {
      // Use a query to check if the user already has a brand document
      const brandQuery = query(
        collection(db, 'users', user.uid, 'brand'),
        where('uid', '==', user.uid)
      );
  
      const brandDocs = await getDocs(brandQuery);
  
      if (brandDocs.empty) {
        console.log('test')
        // Create a new document in the 'brand' subcollection
        const brandRef = doc(collection(db, 'users', user.uid, 'brand'));
        await setDoc(brandRef, {
          name: apiResponse.name,
          strategy: {brandPromise: apiResponse.strategy.brandPromise},
          brandVoice: {expression: apiResponse.brandVoice.expression, attributes: apiResponse.brandVoice.attributes},
          brandCore: {mission: apiResponse.brandCore.mission, vision: apiResponse.brandCore.vision, values: apiResponse.brandCore.values},
          potentialAudiences: [
            {
                audienceType: apiResponse.potentialAudiences[0].audienceType,
                description: apiResponse.potentialAudiences[0].description,
                value: apiResponse.potentialAudiences[0].value
            },
            {
                audienceType: apiResponse.potentialAudiences[1].audienceType,
                description: apiResponse.potentialAudiences[1].description,
                value: apiResponse.potentialAudiences[1].value
            },
            {
                audienceType: apiResponse.potentialAudiences[2].audienceType,
                description: apiResponse.potentialAudiences[2].description,
                value: apiResponse.potentialAudiences[2].value
            }
          ],
          createdAt: new Date().toISOString(),
        });
      }
  
      setHasBrandSet(true);
      console.log('Brand document added successfully');
    } catch (error) {
      console.error('Error adding brand document:', error);
    }
  };

  const handleInput = (e) => {
    setLink(e.target.value);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold">Let's find your brand first</h2>
            <input
              type="text"
              value={link}
              onChange={handleInput}
              className="bg-gray-300 p-2 rounded-lg w-full mt-4"
            />
            <button
              onClick={handleNext}
              className="bg-blue-200 hover:bg-blue-700 font-bold py-2 px-4 rounded-full mt-4"
            >
              Next
            </button>
          </div>
        );
      case 2:
        if (apiResponse === null) {
          return (
            <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold">Loading...</h2>
              <p>We're checking your link...</p>
              <Progress
                value={Math.min(100, ((new Date()).getTime() - 5000) / 3000 * 100)}
                className="mt-4"
              />
            </div>
          );
        } else {
          onComplete();
          return null;
        }
      case 3:
        onComplete();
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-md p-4">
      <div className="flex flex-col items-center justify-center">
        {renderStep()}
      </div>
    </div>
  );
}
