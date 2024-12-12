from uagents import Agent, Context, Model
import google.generativeai as genai
from dotenv import load_dotenv
import os

import requests
from bs4 import BeautifulSoup
import time

load_dotenv()

scrape_agent = Agent(name="scrape_agent", seed="akjsdjaakajksajsajksd")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract text content
    content = soup.get_text()
    
    # Extract image URLs
    images = [url + img['src'] if img['src'].startswith('/') else img['src'] for img in soup.find_all('img') if 'src' in img.attrs]
    
    return content, images

def call_chatgpt_api(text) -> str:
    """
    Function to call the chatgpt api

    Args:
        prompt (str): The prompt to send to the ChatGPT API

    Returns:
        str: The response from the ChatGPT API
    """
    prompt = """
        Analyze and evaluate a brand's identity based on unordered and raw content provided from a website. 
        Your goal is to distill and organize the content into a structured JSON format to help the user 
        cultivate and identify the personal brand.

        The JSON output should evaluate the brand across specific metrics as explained below:

        Strategy: How and who we communicate with
        Brand Voice: How you express your brand 
        Brand Core: How your brand is built and defined
        Audience: What kind of people are interested in your brand
        
        The purpose is to give the user a clear, actionable understanding of their brand's identity and 
        help them refine and a direct analysis from the provided content.

        Return the evaluation as a JSON object as such:

        {
            "name": "string of the brands name",
            "strategy": {
                "brandPromise":  "string"
            },
            "brandVoice": {
                "expression": "string",
                "attributes": [
                "array of length 8 one word strings that capture the message of the brand"
                ]
            },
            "brandCore": {
                "mission": "string",
                "vision": "string",
                "values": "string"
            },
            "potentialAudiences": [
                {
                "audienceType": "string",
                "description": "string",
                "value": "string"
                },
                {
                "audienceType": "string",
                "description": "string",
                "value": "string"
                },
                {
                "audienceType": "string",
                "description": "string",
                "value": "string"
                }
            ]
            }


        Provide a clear and concise evaluation for each assessment. Output only the JSON object in one line, no newlines.
    """ + "text: " + text

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    return response.text

class PostRequest(Model):
    url: str

class PostResponse(Model):

    text: str
    images: list[str]

@scrape_agent.on_event("startup")
async def introduce_agent(ctx: Context):
    ctx.logger.info(f"Hello, I'm agent {scrape_agent.name} and my address is {scrape_agent.address}.")

@scrape_agent.on_rest_post("/rest/scrape", PostRequest, PostResponse)
async def handle_post(ctx: Context, req: PostRequest) -> PostResponse:
    ctx.logger.info("Received POST request", req.url)
    content, images = scrape_website(req.url)
    response = call_chatgpt_api(content)
    return PostResponse(text=response, images=images)

# Add this line at the end of the file, after all the existing code
__all__ = ['scrape_agent']

if __name__ == "__main__":
    scrape_agent.run()

