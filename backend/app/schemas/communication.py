from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class MessageBase(BaseModel):
    text: Optional[str] = None

class MessageCreate(MessageBase):
    id: str
    conversation_id: str
    sender_id: str
    text: str

class MessageInDBBase(MessageBase):
    id: str
    conversation_id: str
    sender_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Message(MessageInDBBase):
    pass

class ConversationBase(BaseModel):
    request_id: Optional[str] = None
    offer_id: Optional[str] = None

class ConversationCreate(ConversationBase):
    id: str
    participants: List[str]

class ConversationInDBBase(ConversationBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Conversation(ConversationInDBBase):
    participants: List[str]
