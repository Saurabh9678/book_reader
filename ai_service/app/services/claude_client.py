import os
from openai import AzureOpenAI

_client = AzureOpenAI(
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2024-02-01"),
)
DEPLOYMENT = os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"]


def ask(system_prompt: str, user_message: str, max_tokens: int = 1024) -> str:
    response = _client.chat.completions.create(
        model=DEPLOYMENT,
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
    )
    return response.choices[0].message.content or ""
