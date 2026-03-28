from typing import Optional, List
from .base import CamelBaseModel
from datetime import datetime

class MessageBase(CamelBaseModel):
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
    
    pass

class Message(MessageInDBBase):
    pass

class ConversationBase(CamelBaseModel):
    request_id: Optional[str] = None
    offer_id: Optional[str] = None

class ConversationCreate(ConversationBase):
    id: str
    participants: List[str]

class ConversationInDBBase(ConversationBase):
    id: str
    created_at: datetime
    
    pass

class Conversation(ConversationInDBBase):
    participants: List[str]
