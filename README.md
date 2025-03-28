# mini-inspection-frontend

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/georgiusricky/mini-inspection-frontend.git
   cd mini-inspection-frontend
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```

### Running the Development Server
Start the development server with:
```sh
npm run dev  # or yarn dev
```
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 📂 Project Structure
```
├── public/         # Static assets (images, icons, etc.)
├── app/            # Next.js App Router
│   ├── components/ # Reusable UI components
├── .env.local      # Environment variables
├── next.config.js  # Next.js configuration
├── package.json    # Project dependencies and scripts
└── README.md       # Documentation
```

## 📦 Building and Deployment
### Build for Production
```sh
npm run build  # or yarn build
```
### Start in Production Mode
```sh
npm start  # or yarn start
```

## 🔧 Environment Variables
Create a `.env.local` file and add your environment variables:
```
NEXT_PUBLIC_API_URL=https://api.com
```

## 📜 License
This project is licensed under [MIT License](LICENSE).