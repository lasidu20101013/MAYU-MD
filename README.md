# MAYU MD

Fast multi-device WhatsApp bot by **MAYU MD**, with a web pairing site, a per-user settings panel and an owner dashboard. Everything is stored in MongoDB.

## Setup

1. Create a free MongoDB Atlas database and copy the connection string.
2. Set these environment variables on your host (Render / Heroku / Kurox / VPS):

| Variable | Required | Example |
|---|---|---|
| `MONGODB_URI` | yes | `mongodb+srv://user:pass@cluster0.xxx.mongodb.net/mayumd` |
| `OWNER_NUMBER` | yes | `94743519654` (you - gets the main-owner commands) |
| `PUBLIC_URL` | recommended | `https://your-app.onrender.com` (Render sets this automatically) |
| `OWNER_PANEL_PASSWORD` | recommended | password for `/owner` (12+ characters) |
| `OWNER_NAME` | no | `MAYU MD` |
| `BOT_NAME` | no | `MAYU MD` |
| `GROQ_API_KEY` | no | for the AI commands (console.groq.com) |
| `SUPPORT_CHANNEL`, `CHANNEL_JID` | no | your own channel (empty = off) |

Node.js **22** is used (set in `package.json`).

3. Start: `npm start`.
4. Open your website (`PUBLIC_URL`), enter a WhatsApp number and type the pairing code in
   **WhatsApp → Linked devices → Link with phone number instead**.

## Pages

- `/` - pairing site (anyone can connect their own number)
- `/setting` - settings panel for each connected user (password is sent to their WhatsApp)
- `/owner` - owner dashboard (`OWNER_PANEL_PASSWORD`, or "Forgot password" sends one to your WhatsApp)

## Permission levels

- **Main owner** (`OWNER_NUMBER`): server-wide commands - `.restart`, `.shutdown`, `.broadcast`, `.sessions`, `.delsession`, `.ban`, `.addpremium`, `ow*` commands...
- **Session owner** (a user who paired their number): settings for *their own* bot only - `.setmode`, `.setprefix`, `.panel`, `.block`...
- Everyone else: normal commands.
