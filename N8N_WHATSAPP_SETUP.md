# N8N WhatsApp Bot Control Setup

## 🚀 EasyChat Sitesi Üzerinden WhatsApp Bot Kontrolü

Bu rehber ile N8N WhatsApp chatbot'unuzu EasyChat sitesi üzerinden tamamen yönetebileceksiniz.

## 📱 **Özellikler**

- ✅ **WhatsApp Contacts Listesi**: Aktif sohbetleri görüntüle
- ✅ **Mesaj Geçmişi**: Tüm konuşmaları takip et
- ✅ **Manuel Mesaj Gönderme**: Site üzerinden WhatsApp mesajı gönder
- ✅ **Bot Status Kontrolü**: Online/Offline/Busy durumu
- ✅ **Real-time Updates**: Canlı mesaj güncellemeleri
- ✅ **N8N Integration**: Tam webhook entegrasyonu

---

## 🔧 **1. Environment Variables**

`.env.local` dosyasına ekleyin:

```bash
# N8N WhatsApp Webhook URLs
N8N_WHATSAPP_CONTACTS_URL=https://your-n8n.com/webhook/whatsapp-contacts
N8N_WHATSAPP_MESSAGES_URL=https://your-n8n.com/webhook/whatsapp-messages
N8N_WHATSAPP_SEND_URL=https://your-n8n.com/webhook/whatsapp-send
N8N_WHATSAPP_STATUS_URL=https://your-n8n.com/webhook/whatsapp-status

# N8N API Key (opsiyonel)
N8N_API_KEY=your-n8n-api-key
```

---

## 🛠️ **2. N8N Workflow Kurulumu**

### **A) WhatsApp Contacts Workflow**

```
Webhook Trigger (GET)
    ↓
WhatsApp Business API
    ↓
Get Active Conversations
    ↓
Format Response
    ↓
Return JSON
```

**Response Format:**
```json
{
  "contacts": [
    {
      "phone": "+905001234567",
      "name": "Ahmet Yılmaz", 
      "lastMessage": "Merhaba!",
      "unreadCount": 2,
      "lastSeen": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### **B) WhatsApp Messages Workflow**

```
Webhook Trigger (GET + phone param)
    ↓
WhatsApp Business API
    ↓
Get Conversation History
    ↓
Format Messages
    ↓
Return JSON
```

**Response Format:**
```json
{
  "messages": [
    {
      "id": "msg_123",
      "from": "+905001234567",
      "message": "Merhaba",
      "timestamp": "2024-01-01T10:00:00Z",
      "status": "read",
      "direction": "incoming"
    }
  ]
}
```

### **C) WhatsApp Send Workflow**

```
Webhook Trigger (POST)
    ↓
Validate Input
    ↓
WhatsApp Business API
    ↓
Send Message
    ↓
Log to Database
    ↓
Return Success
```

**Request Format:**
```json
{
  "to": "+905001234567",
  "message": "Merhaba!",
  "type": "manual",
  "source": "easychat_website"
}
```

### **D) Bot Status Workflow**

```
Webhook Trigger (POST/GET)
    ↓
Update/Get Bot Status
    ↓
Store in Database
    ↓
Return Status
```

**Status Options:**
- `online`: Bot aktif
- `offline`: Bot kapalı  
- `busy`: Bot meşgul

---

## 📋 **3. WhatsApp Business API Setup**

### **Requirements:**
- WhatsApp Business Account
- Facebook Developer Account
- Verified Business
- Phone Number

### **API Endpoints:**
```javascript
// N8N'de WhatsApp Business API kullanımı

// 1. Get Conversations
GET https://graph.facebook.com/v18.0/{phone-number-id}/conversations

// 2. Get Messages  
GET https://graph.facebook.com/v18.0/{conversation-id}/messages

// 3. Send Message
POST https://graph.facebook.com/v18.0/{phone-number-id}/messages
{
  "messaging_product": "whatsapp",
  "to": "+905001234567", 
  "text": { "body": "Merhaba!" }
}
```

---

## 🎯 **4. EasyChat Dashboard Kullanımı**

### **Sol Alt Köşe - WhatsApp Manager**

1. **Yeşil WhatsApp butonu** tıkla
2. **Contacts listesi** görüntüle
3. **Contact seç** → mesaj geçmişi açılır
4. **Mesaj yaz ve gönder**
5. **Bot status değiştir** (yeşil/sarı/kırmızı)

### **Dashboard Özellikleri:**

- 📞 **Contact List**: Aktif sohbetler
- 💬 **Chat Interface**: Mesaj görüntüleme/gönderme
- 🟢 **Status Control**: Bot durumu yönetimi
- 🔄 **Real-time**: Otomatik güncelleme
- 📱 **Responsive**: Mobil uyumlu

---

## 🔄 **5. Workflow Logic Örnekleri**

### **A) Incoming Message Handler**

```
WhatsApp Webhook → N8N
    ↓
IF message contains "fiyat"
    → Send pricing info
    
ELSE IF message contains "demo" 
    → Send demo link
    
ELSE IF message contains "destek"
    → Forward to human agent
    
ELSE
    → Send to OpenAI → Smart response
```

### **B) Bot Status Logic**

```
Status = "online"
    → Auto-respond enabled
    
Status = "busy" 
    → Send "Busy message"
    
Status = "offline"
    → Store messages, don't respond
```

### **C) Manual Override**

```
Manual message from dashboard
    ↓
Disable auto-response for 5 minutes
    ↓
Send manual message
    ↓
Re-enable auto-response
```

---

## 📊 **6. Database Schema (N8N)**

### **Contacts Table**
```sql
CREATE TABLE whatsapp_contacts (
  phone VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100),
  last_message TEXT,
  unread_count INT DEFAULT 0,
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Messages Table**
```sql
CREATE TABLE whatsapp_messages (
  id VARCHAR(50) PRIMARY KEY,
  from_phone VARCHAR(20),
  to_phone VARCHAR(20), 
  message TEXT,
  direction ENUM('incoming', 'outgoing'),
  status ENUM('sent', 'delivered', 'read'),
  timestamp TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Bot Status Table**
```sql
CREATE TABLE bot_status (
  id INT PRIMARY KEY AUTO_INCREMENT,
  status ENUM('online', 'offline', 'busy'),
  updated_by VARCHAR(50),
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 **7. Advanced Features**

### **A) Auto-Response Rules**

```javascript
// N8N'de IF node kullanarak

if (message.includes("fiyat")) {
  return "EasyChat Business: 1499₺/ay - 14 gün ücretsiz deneme!";
}

if (message.includes("demo")) {
  return "Demo için: https://easychat.com/demo";
}

if (message.includes("destek")) {
  // Forward to human
  return "Bir temsilcimiz yakında sizinle iletişime geçecek.";
}
```

### **B) Scheduled Messages**

```
Cron Trigger (Daily 9 AM)
    ↓
Get New Leads (Last 24h)
    ↓
Send Welcome WhatsApp
    ↓
Update Contact Status
```

### **C) Analytics Integration**

```
Every WhatsApp Interaction
    ↓
Log to Google Analytics
    ↓
Update CRM (HubSpot)
    ↓
Slack Notification
```

---

## 🔧 **8. Troubleshooting**

### **Common Issues:**

❌ **"Contacts not loading"**
- Check N8N webhook URL
- Verify WhatsApp API connection
- Check API rate limits

❌ **"Messages not sending"**  
- Verify WhatsApp Business API
- Check phone number format
- Confirm API permissions

❌ **"Bot status not updating"**
- Check N8N status webhook
- Verify database connection
- Check API authentication

### **Debug Commands:**

```bash
# Test webhooks
curl -X GET "http://localhost:3000/api/whatsapp/contacts"
curl -X GET "http://localhost:3000/api/whatsapp/messages?phone=+905001234567"
curl -X POST "http://localhost:3000/api/whatsapp/send" \
  -H "Content-Type: application/json" \
  -d '{"to":"+905001234567","message":"Test"}'
```

---

## 🎯 **9. Production Checklist**

- ✅ WhatsApp Business verified
- ✅ N8N workflows active
- ✅ Environment variables set
- ✅ Database configured
- ✅ Webhooks tested
- ✅ Error handling implemented
- ✅ Rate limiting configured
- ✅ Monitoring setup

Bu setup ile WhatsApp chatbot'unuzu EasyChat sitesi üzerinden tamamen kontrol edebilirsiniz! 🚀
