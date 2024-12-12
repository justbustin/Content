"use client"
import { db, auth } from '../../firebase-config';
import { useState, useEffect } from 'react';
import Chat from '@/components/home/chat';
import ScheduledPost from '@/components/home/post';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocialMediaDraftEditor } from '@/components/social-media-draft-editor';
import { onAuthStateChanged } from 'firebase/auth';
import SocialMediaDashboard from '@/components/social-media-dashboard';
import { addDoc, setDoc, collection, getDocs, query, where, doc } from 'firebase/firestore';


export default function GeneratePage() {
  const [recentlyCreated, setRecentlyCreated] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [brand, setBrand] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState({});

  const [textArea, setTextArea] = useState({});
  const [page, setPage] = useState(0);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        // User is signed out
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      if (!user) {
        return;
      }
      const userRef = collection(db, 'users', user.uid, 'brand');
      const brandDocs = await getDocs(userRef);
      const brandDoc = brandDocs.docs[0];
      setBrand(brandDoc.data());
      console.log(brandDoc.data())
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "context": JSON.stringify(brandDoc.data()) }),
      });
      const data = await response.json();
      console.log('dataa', data)
      const text = data.text.replace(/([""]+)/g, '"');
      const cleanedText = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanedText);
      console.log('parsed', parsed)
      setRecommendations(parsed);

    
      /*
      const q = query(collection(db, 'content'), where('type', 'in', ['post', 'tweet']));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const recentlyCreated = [];
        const drafts = [];
        const completed = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().status === 'published') {
            recentlyCreated.push({ ...doc.data(), id: doc.id });
          } else if (doc.data().status === 'draft') {
            drafts.push({ ...doc.data(), id: doc.id });
          } else if (doc.data().status === 'completed') {
            completed.push({ ...doc.data(), id: doc.id });
          }
        });
        setRecentlyCreated(recentlyCreated);
        setDrafts(drafts);
        setCompleted(completed);
      });*/

      return () => unsubscribe();
    }
    getUserData();
  }, [user]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold mb-8">Content</h1>
      <Tabs defaultValue="generate">
        <TabsList className="flex w-full bg-gray-100 justify-start space-x-4">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="generate">
        <h2 className="text-2xl font-bold mb-4">Generate</h2>

            <div className="flex flex-row w-full">
                <div className="w-2/3 overflow-y-auto" style={{ maxHeight: '500px' }}>
                    { page == 0 ? <Chat recommendations={recommendations} context={JSON.stringify(brand)} setTextArea={setTextArea}/>
                    : <SocialMediaDashboard setTokens={setTokens} />  
                }
                </div>
                <div className="w-1/3">
                    <SocialMediaDraftEditor textArea={textArea} setPage={setPage} page={page} tokens={tokens}/>
                </div>
            </div>
        </TabsContent>
        <TabsContent value="drafts">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Drafts</h2>
            <ul className="space-y-2">
              {drafts.map((post) => (
                <li key={post.id}>
                  <ScheduledPost post={post} />
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Completed</h2>
            <ul className="space-y-2">
              {completed.map((post) => (
                <li key={post.id}>
                  <ScheduledPost post={post} />
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
     
    </div>
  );
}
