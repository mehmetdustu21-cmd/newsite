# N8N Integration Guide for EasyChat

## 🔗 N8N ile EasyChat Entegrasyonu

### 1. Environment Variables Kurulumu

Proje kök dizininde `.env.local` dosyası oluşturun:

```bash
# N8N Webhook URLs
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/lead-capture
N8N_CHAT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chat-ai
```

### 2. N8N Workflow Kurulumu

#### A) Lead Capture Workflow

1. N8N'de yeni workflow oluşturun
2. **Webhook Trigger** ekleyin:
   - HTTP Method: `POST`
   - Path: `/webhook/lead-capture`
   - Response Mode: `Respond immediately`

3. **Webhook Response** örneği:
```json
{
  "name": "string",
  "phone": "string", 
  "email": "string",
  "source": "easychat_demo_form",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "user_agent": "string",
  "ip": "string"
}
```

4. **Workflow Adımları** (örnekler):
   - ✅ **CRM'e kaydet** (HubSpot, Salesforce, Airtable)
   - ✅ **Email gönder** (Gmail, SendGrid, Outlook)
   - ✅ **Slack bildirimi** (Slack)
   - ✅ **WhatsApp mesaj** (WhatsApp Business)
   - ✅ **Google Sheets'e ekle** (Google Sheets)

#### B) AI Chat Workflow

1. İkinci workflow oluşturun
2. **Webhook Trigger** ekleyin:
   - HTTP Method: `POST`
   - Path: `/webhook/chat-ai`

3. **Webhook Response** örneği:
```json
{
  "message": "string",
  "sessionId": "string",
  "source": "easychat_website", 
  "timestamp": "2024-01-01T00:00:00.000Z",
  "user_agent": "string"
}
```

4. **AI Integration** seçenekleri:
   - 🤖 **OpenAI ChatGPT** (GPT-4/3.5)
   - 🧠 **Claude AI** (Anthropic)
   - 🔥 **Google Gemini** 
   - 💡 **Custom AI** (Local LLM)

5. **Response Format**:
```json
{
  "response": "AI yanıtı buraya",
  "confidence": 0.95,
  "intent": "product_info"
}
```

### 3. N8N Workflow Örnekleri

#### Lead Capture Workflow
```
Webhook Trigger 
    ↓
Validate Data (IF node)
    ↓
├─ Valid: Continue
│   ↓
│   CRM Integration (HubSpot)
│   ↓
│   Send Welcome Email (Gmail)
│   ↓
│   Slack Notification
│   ↓ 
│   Return Success
│
└─ Invalid: Return Error
```

#### AI Chat Workflow
```
Webhook Trigger
    ↓
Extract Message Content
    ↓
Check Intent (IF node)
    ├─ Pricing → Return pricing info
    ├─ Demo → Return demo link
    ├─ Features → Return feature list
    └─ General → Send to OpenAI
            ↓
        Format Response
            ↓
        Return to Chat
```

### 4. EasyChat'te Kullanım

Kodda webhook URL'leri otomatik kullanılıyor:

#### Demo Form Integration
- `app/api/lead/route.ts` → N8N'e form verisi gönderir
- Form doldurulduğunda → N8N workflow tetiklenir

#### Chatbot Integration  
- `app/api/chatbot/route.ts` → N8N'e chat mesajı gönderir
- Chat mesajı geldiğinde → N8N AI workflow tetiklenir

### 5. Test Etme

#### Local Test:
```bash
# Demo form test
curl -X POST http://localhost:3000/api/lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"123","email":"test@test.com"}'

# Chatbot test  
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message":"Merhaba","sessionId":"test123"}'
```

#### N8N Test:
1. N8N workflow'unu aktifleştirin
2. Webhook URL'ini kopyalayın
3. `.env.local` dosyasına ekleyin
4. EasyChat'i yeniden başlatın

### 6. Production Setup

#### Vercel Deployment:
1. Vercel Dashboard → Environment Variables
2. `N8N_WEBHOOK_URL` ve `N8N_CHAT_WEBHOOK_URL` ekleyin
3. Deploy

#### N8N Cloud/Self-hosted:
1. HTTPS URL kullanın
2. Authentication (opsiyonel)
3. Rate limiting ayarlayın

### 7. Advanced Features

#### Session Management:
- Chat session'ları N8N'de takip edin
- User context saklayın
- Conversation history

#### Analytics:
- N8N'de lead metrics
- Chat analytics  
- Conversion tracking

#### Integrations:
- 📧 **Email Marketing** (Mailchimp, SendGrid)
- 📱 **CRM Systems** (HubSpot, Pipedrive)
- 💬 **Chat Platforms** (WhatsApp, Telegram)
- 📊 **Analytics** (Google Analytics, Mixpanel)

### 8. Troubleshooting

#### Common Issues:
- ❌ 404 Error → Check webhook URL
- ❌ Timeout → Check N8N response time
- ❌ CORS → Add domain to N8N settings

#### Debug:
```bash
# Check logs
npm run dev
# Console'da N8N response'ları göreceksiniz
```

### 9. Security

#### Best Practices:
- 🔒 HTTPS kullanın
- 🎫 Webhook authentication
- 🛡️ Rate limiting
- 🔐 API key protection

Bu rehber ile N8N'i EasyChat'e tamamen entegre edebilirsiniz! 🚀
