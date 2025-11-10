import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './src/config/index.js';
import storyRoutes from './src/routes/storyRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from storage
app.use('/storage', express.static(path.join(__dirname, 'storage')));

// Routes
app.use('/api', storyRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Magic Storyteller Agent! 🧚‍♀️',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            generateStory: '/api/generate-story',
            getAudio: '/api/story-audio/:storyId',
            getImage: '/api/story-image/:storyId/:sceneNum'
        }
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize and start server
const startServer = async () => {
    try {
        // Initialize storage
        await config.initializeStorage();
        
        const PORT = config.port;
        app.listen(PORT, () => {
            console.log(`🧚‍♀️ Magic Storyteller Agent running on port ${PORT}`);
            console.log(`📚 API Documentation: http://localhost:${PORT}`);
            console.log(`🔊 Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;