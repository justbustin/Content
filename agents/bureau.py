from uagents import Bureau
from uagents import Agent, Context, Model
import google.generativeai as genai

from scrape import scrape_agent
from recommend import draft_recommender
from write import write_agent
from linkedin import linkedin_poster

bureau = Bureau(port=8000, endpoint="http://localhost:8000")

bureau.add(scrape_agent)
bureau.add(draft_recommender)
bureau.add(write_agent)
bureau.add(linkedin_poster)

if __name__ == "__main__":
    bureau.run()