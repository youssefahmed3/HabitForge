import express from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth";
import cors from "cors";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import habitsRoutes from './routes/habits.routes';
import habitsCategoriesRoutes from './routes/habitCategory.routes';
import habitEntriesRoutes from './routes/habitEntry.routes';
import statsRoutes from './routes/stats.routes';

const app = express();

// CORS configuration

app.use(
    cors({
        origin: "http://localhost:3000", // Next.js/React.js URL Origin
        credentials: true,               // Needed to allow cookies to be sent
    })
);

app.use(cookieParser());

// Logs in 'dev' format (method, URL, status, response time)
app.use(morgan('dev'));

// Auth endpoints
app.all('/api/auth/{*any}', toNodeHandler(auth));

// Making Sure That the endpoints only accepts JSON Format
app.use(express.json());

// Routes Endpoint
app.use("/habits", habitsRoutes);
app.use("/habit-categories", habitsCategoriesRoutes);
app.use("/habit-entries", habitEntriesRoutes);
app.use("/stats", statsRoutes);




export default app; 