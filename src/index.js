const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');
const followRoutes = require('./routes/followRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use(express.static('.')); // Serve static files from the current directory

app.use('/api/auth', authRoutes);  // Auth routes
app.use('/api/posts', postRoutes); // Post routes
app.use('/api/likes', likeRoutes); // Like routes
app.use('/api/posts', commentRoutes); // Add comment routes to the API
app.use('/api/follow', followRoutes); // Follow routes


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

module.exports = app;