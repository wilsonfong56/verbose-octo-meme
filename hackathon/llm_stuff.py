from dotenv import load_dotenv
from openai import OpenAI
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import json

load_dotenv()

api_key = os.getenv("OPENAPI_API_KEY")

uri = os.getenv("MONGODB_URI")
client = MongoClient(uri, server_api=ServerApi('1'))
try:
    db = client["test"]
    notes_collection = db["notes"]
except Exception as e:
    print(e)

client = OpenAI(
    api_key=api_key,
)

system_prompt = """
                You are a notes summarizer that combines multiple students' notes on a topic into a single, logically ordered summary. 
                Correct any mistakes and ensure clarity. Do not include any concluding statements or summaries at the end. 
                Focus on just the facts and concepts. Group similar notes together into subtopics.
                
                Return your answer in the following format:
                
                {
                  "Notebooks": [
                    {
                      "topic": "Search and Sorting Algorithms",
                      "notes": [
                        "Binary search requires a sorted array and efficiently narrows down possibilities, resulting in a time complexity of O(log n)",
                        "Merge sort is a divide-and-conquer algorithm with a time complexity of O(n log n), making it efficient for large datasets."
                      ]
                    },
                    {
                      "topic": "Graph Traversal",
                      "notes": [
                        "Depth-First Search (DFS) employs a stack to explore as far down a branch as possible before backtracking.",
                        "Breadth-First Search (BFS) utilizes a queue for level-order exploration of nodes."
                      ]
                    }
                  ]
                }
            """

notes = notes_collection.find_one({"lecture": "CS510", "date": "2025-02-20"})
# print(notes['class_notes'])

response = client.responses.create(
    model="gpt-4o",
    instructions=system_prompt,
    input=f"{notes['class_notes']}"
)

result_string = response.output_text
print(result_string)
# cleaned = response.strip().strip('"').replace("```json", "").replace("```", "").strip()
# print(cleaned)
# data = json.loads(cleaned)
