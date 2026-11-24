# AT.ip website — staffing and lead capture

## Included
- Staffing portfolio card immediately before Industrial & Logistics.
- WhatsApp contact buttons.
- One bilingual “Habla con AT.ip” chat. Staffing requests switch into a structured intake in the same chat; general sales inquiries can also offer contact capture.
- If a visitor explicitly asks to be contacted, the chat asks for their name and work email, saves the request to MongoDB, and replies with a brief confirmation. Staffing requests keep the detailed intake and consent step.
- MongoDB collection: atip.lead_requests.
- Optional email notification to servicioalcliente@atip.com.pe.

## Deploy to Vercel
Set these variables in the project environment and redeploy:
- MONGODB_URI: existing read-only connection used by the RAG chat.
- MONGODB_WRITE_URI: connection for a dedicated MongoDB user with readWrite only on database atip.
- MONGODB_DATABASE=atip
- MONGODB_VECTOR_INDEX=knowledge_base_vector
- GROQ_API_KEY
- GROQ_MODEL=openai/gpt-oss-120b

The new database user should be separate from the RAG user. In Atlas Database Access, grant readWrite on database atip. Save its connection string in Vercel as the sensitive MONGODB_WRITE_URI, then redeploy.

Optional email notification requires ZOHO_SMTP_HOST, ZOHO_SMTP_PORT=465, ZOHO_SMTP_USER=paolo@riverayrivera.net, and ZOHO_SMTP_APP_PASSWORD. If these are absent, the request is still saved in MongoDB, but no email alert is sent.

To review captured leads, open Atlas Data Explorer → database atip → collection lead_requests.
