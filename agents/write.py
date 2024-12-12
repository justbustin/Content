from uagents import Agent, Context, Model
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

write_agent = Agent(name="write_agent", seed="asdasdasdasdasdasdads")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class PostRequest(Model):
    text: str

class PostResponse(Model):
    text: str

@write_agent.on_event("startup")
async def introduce_agent(ctx: Context):
    ctx.logger.info(f"Hello, I'm agent {write_agent.name} and my address is {write_agent.address}.")

@write_agent.on_rest_post("/rest/write", PostRequest, PostResponse)
async def handle_post(ctx: Context, req: PostRequest) -> PostResponse:
    ctx.logger.info("Received POST request")
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    prompt = """Create an engaging social media post about the prompt given below in the style of the
    context of the brand. Write each post about the prompt in unique ways to engage and resonate with the audience
    based on four different social media platforms: Facebook, Twitter, Instagram, and LinkedIn.

    Only output a response in JSON format as seen:

    {
       Bot: "short string about the intuition behind the post",
       Facebook: "string of facebook post",
       Twitter: "string of twitter post",
       Instagram: "string of instagram post",
       LinkedIn: "string of linkedin post"
    }

    Below is the prompt and context of the brand:
    """ + req.text


    response = model.generate_content(prompt)
    return PostResponse(text=response.text)

__all__ = ['write_agent']