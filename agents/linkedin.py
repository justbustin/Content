from uagents import Agent, Context, Model
import google.generativeai as genai

import requests
import time
from dotenv import load_dotenv
import os

load_dotenv()

class LinkedinRequest(Model):
    text: str
    token: str

class LinkedinResponse(Model):
    text: str

linkedin_poster = Agent(name="linkedin_poster", seed="asdasdasdads")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

@linkedin_poster.on_event("startup")
async def introduce_agent(ctx: Context):
    ctx.logger.info(f"Hello, I'm agent {linkedin_poster.name} and my address is {linkedin_poster.address}.")


@linkedin_poster.on_rest_post("/rest/linkedin", LinkedinRequest, LinkedinResponse)
async def handle_post(ctx: Context, req: LinkedinRequest) -> LinkedinResponse:
    ctx.logger.info("Received POST request")

    user = requests.get("https://api.linkedin.com/v2/userinfo", headers={
        "Authorization": "Bearer " + req.token
    })
    ctx.logger.info('user test')
    ctx.logger.info(user.json()['sub'])

    data = requests.post("https://api.linkedin.com/v2/ugcPosts", json={ 
        "author": "urn:li:person:" + user.json()['sub'],
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {
                    "text": req.text
                },
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
        }
    }, headers={
        "Authorization": "Bearer " + req.token
    })

    ctx.logger.info('data test')
    ctx.logger.info(data)

    return LinkedinResponse(text="compelted!")


# Add this line at the end of the file, after all the existing code
__all__ = ['linkedin_poster']

if __name__ == "__main__":
    linkedin_poster.run()

