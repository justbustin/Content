from uagents import Agent, Context, Model
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

import requests
import time

class PostRequest(Model):
    text: str

class PostResponse(Model):
    text: str

draft_recommender = Agent(name="draft_recommender", seed="asdasdasdads")
genai.configure(api_key=os.getenv("GEMINI_API"))

@draft_recommender.on_event("startup")
async def introduce_agent(ctx: Context):
    ctx.logger.info(f"Hello, I'm agent {draft_recommender.name} and my address is {draft_recommender.address}.")


@draft_recommender.on_rest_post("/rest/recommend", PostRequest, PostResponse)
async def handle_post(ctx: Context, req: PostRequest) -> PostResponse:
    ctx.logger.info("Received POST request")

    prompt = """Provide four, super short one sentence social media post ideas for this brand below. Only output JSON in the format
    as seen:

    {
        "ideas": [
            "string of idea 1",
            "string of idea 2",
            "string of idea 3"
        ]
    }

    Below is the brand for context:
    """ + req.text

    ctx.logger.info(prompt)

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    ctx.logger.info(response.text)

    ctx.logger.info(response)
    return PostResponse(text=response.text)


# Add this line at the end of the file, after all the existing code
__all__ = ['draft_recommender']

if __name__ == "__main__":
    draft_recommender.run()

