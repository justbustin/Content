## Conti

Conti is your personal social media manager! Built using fetch.ai agents, it's able to analyze your brands website, and gives a clear, improved picture of what you want to convey as a brand. It is able to generate and automate scheduling posts for four different platforms: Facebook, X, Linkedin, and Instagram. Currently, only posting on LinkedIn is available.

<img width="1489" alt="image" src="https://github.com/user-attachments/assets/165814ec-50c6-4214-a538-24052e889b33" />
<img width="1488" alt="image" src="https://github.com/user-attachments/assets/71137c9d-1415-4d81-853b-cd20a4824157" />
<img width="1488" alt="image" src="https://github.com/user-attachments/assets/0a4029fd-a0d4-4031-9dba-de0d64ebc7f3" />
<img width="1488" alt="image" src="https://github.com/user-attachments/assets/767cbb92-b91f-4449-89a9-d580aa2a1884" />

## Getting Started

Be sure to place all of the appropriate environment variables in a .env file as so:
```
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=YOUR_API
LINKEDIN_CLIENT_SECRET=YOUR_API
GEMINI_API=YOUR_API
```

Replace the firebaseConfig.json with your info:
```
{
  "apiKey": "",
  "authDomain": "",
  "projectId": "",
  "storageBucket": "",
  "messagingSenderId": "",
  "appId": "",
  "measurementId": ""
}
```

Install all agent dependencies.

From root:
```
cd agents
```
```
poetry init -n && poetry shell
```
```
pip install uagents
pip install google-generativeai
```

Install all node modules:
```
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
