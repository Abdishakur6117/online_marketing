# 🚀 ONL NMARKETING - Full-Stack Project  

A complete **React + Node.js** application with frontend and backend integration.  

---

## **📂 Project Structure**  
ONL NMARKETING/
├── frontend/ # React (Vite) Frontend
│ ├── src/ # React components & pages
│ ├── public/ # Static assets (images, favicon)
│ ├── package.json # Frontend dependencies
│ └── vite.config.js # Vite configuration
└── server/ # Node.js Backend
├── routes/ # API endpoints
├── controllers/ # Business logic
├── models/ # Database models
├── index.js # Server entry point
└── package.json # Backend dependencies


---

## **⚡ Quick Setup**  

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/your-username/ONL-NMARKETING.git
cd ONL-NMARKETING

cd frontend && npm install
cd ../server && npm install
VITE_API_BASE_URL=http://localhost:3000
PORT=3000
MONGO_URI=mongodb://localhost:27017/onl_nmarketing
JWT_SECRET=your_secret_key_here
IMAGEKIT_PUBLIC_KEY=your_public_key_here
IMAGEKIT_PRIVATE_KEY=your_private_key_here
IMAGEKIT_URL_ENDPOINT=your_url_here
cd server && npm start
cd ../frontend && npm run dev
