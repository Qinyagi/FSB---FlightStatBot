@echo off
echo Deploying FlightStat Full-Stack App...
echo 🔧 Building Next.js with API routes...
npm run build
echo 🚀 Deploying to Vercel...
vercel --prod
echo.
echo ✅ Deployment complete!
echo 🌐 Full-Stack URL: https://flightstat-main.vercel.app
echo 🔗 API Endpoint: https://flightstat-main.vercel.app/api/flights
echo 📦 Backend consolidated into Next.js
echo.
pause