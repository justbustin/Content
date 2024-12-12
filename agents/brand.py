from uagents import Agent, Context, Model

import google.generativeai as genai
import requests
from bs4 import BeautifulSoup
import time
from dotenv import load_dotenv
import os

load_dotenv()

brand_agent = Agent(name="brand_agent", seed="akjsdjaakajksajsajksd")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


class MessageRequest(Model):
    text: str
    images: list[str]

class MessageResponse(Model):
    """
    A model representing a response to a message request.

    Attributes:
        message (str): The message sent in response to the request.
    """
    message: str

# create a function to call chatgpt api
def call_chatgpt_api(text) -> str:
    """
    Function to call the chatgpt api

    Args:
        prompt (str): The prompt to send to the ChatGPT API

    Returns:
        str: The response from the ChatGPT API
    """
    prompt = """
        Analyze the branding of a website based on the provided text and image descriptions. Evaluate the brand's performance across the following five metrics:

        Awareness: The ability to make the brand known and recognizable.
        Engagement: The extent to which users interact with the products and content.
        Image: The perception and emotional connection users have with the brand.
        Sales: The effectiveness in driving conversions and purchases.
        Story: The clarity, relatability, and resonance of the brand’s narrative.
        Return the evaluation as a JSON object with these properties:

        "improve_metric": The metric that requires the most focus.
        "improve_reason": Why this metric needs attention.
        "best_metric": The metric that performed the best.
        "best_reason": Why this metric is the best.
        Provide clear and concise reasoning for each assessment. Output only the JSON object.
    """ + "text: " + text

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    return response.text

@brand_agent.on_event("startup")
async def introduce_agent(ctx: Context):
    ctx.logger.info(f"Hello, I'm agent {brand_agent.name} and my address is {brand_agent.address}.")

@brand_agent.on_message(model=MessageRequest, replies=MessageResponse)
async def handle_post(ctx: Context, sender: str, _msg: MessageRequest):
    ctx.logger.info("Received message from", sender)
    response = call_chatgpt_api(_msg.text)
    await ctx.send(sender, MessageResponse(message=response))

if __name__ == "__main__":
    brand_agent.run()
 