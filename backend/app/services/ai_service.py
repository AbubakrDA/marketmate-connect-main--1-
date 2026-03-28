from sqlalchemy.orm import Session
from typing import Optional, List
import requests
import os

from app.models.marketing_subscription import Subscription

class AIService:
    @staticmethod
    def _get_api_key():
        # Fallback to dummy key if not set
        return os.getenv("DEEPSEEK_API_KEY", "your-deepseek-api-key")

    @staticmethod
    def _check_feature_access(db: Session, business_id: str, feature: str) -> bool:
        subscription = db.query(Subscription).filter(
            Subscription.business_id == business_id,
            Subscription.status == "active"
        ).first()

        if not subscription:
            return False # No free AI features currently

        if subscription.plan_name == "premium":
            return True
        elif subscription.plan_name == "pro":
            # Pro gets chat and recommendations, but no lead scoring maybe?
            return feature in ["chat", "recommendation"]
        else:
            # Basic only gets chat
            return feature == "chat"

    @staticmethod
    def ai_route(db: Session, business_id: str, feature: str, prompt: str) -> str:
        # 1. Feature-based usage check
        if not AIService._check_feature_access(db, business_id, feature):
            return "Feature not available in your current plan. Please upgrade to Pro or Premium."

        # 2. Limit AI usage (Optional: we could track usage in DB)
        # 3. Call DeepSeek (API)
        try:
            # Placeholder for DeepSeek API call
            # response = requests.post(
            #     "https://api.deepseek.com/v1/chat/completions",
            #     headers={"Authorization": f"Bearer {AIService._get_api_key()}"},
            #     json={"messages": [{"role": "user", "content": prompt}], "model": "deepseek-chat"}
            # )
            # return response.json()["choices"][0]["message"]["content"]
            
            return f"AI Response from DeepSeek model for {feature}: [Simulated Response]"
        except Exception as e:
            # Fallback handling
            return f"AI system temporarily unavailable. Error: {str(e)}"
