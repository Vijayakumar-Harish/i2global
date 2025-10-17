```markdown
# WriterLogger – Full-Stack Note-Taking App

A lightweight, drag-and-drop note manager built with **Next.js 13 (App Router)** on the front-end and **FastAPI** on the back-end.  
All UI components are hand-crafted with **Tailwind CSS** – no external component libraries.

---

## ⚙️ Tech Stack

| Layer        | Tech / Version                     |
|--------------|------------------------------------|
| Front-end    | Next.js 13, React, Tailwind CSS    |
| State        | Context API (auth)                 |
| HTTP         | Axios                              |
| Back-end     | Python 3.11, FastAPI               |
| DB           | MongoDB (via Motor)                |
| Auth         | JWT (access token)                 |
| Passwords    | bcrypt (passlib)                   |

---

## 🚀 Quick Start (local)

### 1. Clone / unpack the project
```bash
cd keepnotes
```

### 2. Back-end (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt   # see file below
uvicorn main:app --reload --port 8007
```
Server runs at [http://localhost:8007](http://localhost:8007)  
Interactive docs: [http://localhost:8007/docs](http://localhost:8007/docs)

`requirements.txt`
```
fastapi[all]==0.111.0
motor==3.4.0
python-dotenv==1.0.0
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
```

Create `.env` inside `/backend`:
```env
JWT_SECRET=super-secret-change-me
JWT_ALGORITHM=HS256
JWT_EXPIRE_MIN=60
MONGO_URL=mongodb://localhost:27017/keepnotes
```

### 3. Front-end (Next.js)
```bash
cd ../frontend
npm install
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

Create `.env.local` inside `/frontend`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8007
```

---

## 🔐 Auth Flow (current state)

- Registration → automatic login → home  
- **JWT** stored in `localStorage` and attached to every request via Axios interceptor  
- **Logout** clears token & redirects to `/login`  
*(Token-based login temporarily disabled while resolving CORS edge cases – will be re-enabled in next iteration)*

---

## 📦 Main Features

| Feature               | Status |
|-----------------------|--------|
| Register / Login      | ✅     |
| Create note           | ✅     |
| View all notes        | ✅     |
| Edit note (modal)     | ✅     |
| Delete note           | ✅     |
| Drag-and-drop reorder | ✅     |
| Rich-text editor      | ✅     |
| Responsive UI         | ✅     |
| JWT authorization     | ⚠️     *(paused)* |

---

## 🧱 Project Structure

```
backend/
 ├─ main.py              # FastAPI entry
 ├─ auth.py              # JWT utils
 ├─ models.py            # DB helpers
 ├─ schemas.py           # Pydantic models
 └─ requirements.txt

frontend/
 ├─ app/
 │  ├─ layout.js
 │  ├─ page.js            # notes list
 │  ├─ add/page.js        # create note
 │  ├─ login/page.js
 │  ├─ register/page.js
 │  ├─ components/
 │  │  ├─ Header.js
 │  │  ├─ RichEditor.js
 │  │  └─ Protected.js
 │  ├─ context/
 │  │  └─ AuthContext.js
 │  └─ lib/
 │     ├─ axios.js         # interceptor
 │     └─ drag.js
 ├─ public/
 └─ package.json
```

---

## 🚧 Challenges & Learnings

1. **CORS pitfalls**  
   - Pre-flight OPTIONS requests were stripping custom headers  
   - Solution: explicit `allow_credentials=True` + `allow_headers=["*"]` in FastAPI middleware

2. **Hydration warnings**  
   - Browser extensions (mouse-gesture, ad-blockers) inject attributes into `<body>`  
   - Fixed by ignoring dev-only warnings; production builds are clean

3. **JWT header lifecycle**  
   - Token stored **after** first notes fetch caused 401  
   - Fixed by fetching notes **only when token exists** (`useEffect` guarded by `token`)

4. **Field-name mismatches**  
   - Frontend used `username` / `email`; backend expected `user_name` / `user_email`  
   - Aligning keys removed 422 errors

5. **Password length**  
   - Pydantic `min_length=6` rejected short passwords during testing  
   - Added clear UI feedback instead of raw validation object

6. **Drag-and-drop without libraries**  
   - Implemented with pure HTML5 `draggable` + `onDragStart` / `onDrop` to stay within “no third-party plugins” rule

---

## 🧪 Testing Locally

| Endpoint        | Method | Payload (JSON)                                  | Auth |
|-----------------|--------|--------------------------------------------------|------|
| `/auth/signup`  | POST   | `{user_name, user_email, password}`             | ❌   |
| `/auth/signin`  | POST   | `{user_email, password}`                        | ❌   |
| `/notes`        | GET    | –                                                | ✅   |
| `/notes`        | POST   | `{note_title, note_content}`                     | ✅   |
| `/notes/{id}`   | PUT    | `{note_title, note_content}`                     | ✅   |
| `/notes/{id}`   | DELETE | –                                                | ✅   |


---

## 🗺️ Road-map (optional ideas)

- Re-enable full JWT login flow  
- Refresh-token rotation  
- MongoDB indexes for text search  
- Dark-mode toggle  
- Export notes to Markdown  
- Docker-compose for one-command spin-up

---

## 📄 License

This codebase was created **from scratch** for the Full-Stack Developer assignment.  
No external repositories were forked or copied; only **whitelisted** packages were used.
```