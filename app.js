require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');

// Routes
const authRoutes = require('./routes/authRoutes');
const indexRoutes = require('./routes/indexRoutes');
const homeRoutes = require('./routes/homeRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const eventRoutes = require('./routes/eventRoutes');
const eventregRoutes = require('./routes/eventregRoutes');
const eventcreRoutes = require('./routes/eventcreRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy if in production (for secure cookies behind reverse proxy)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session Store setup
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: "Session",
  checkExpirationInterval: 15 * 60 * 1000, // Clean expired sessions every 15 minutes
  expiration: 24 * 60 * 60 * 1000, // 1 day
});

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecretKey',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000, // 1 hour
    secure: process.env.NODE_ENV === 'production',
    sameSite: true,
  },
}));

// Make session available in templates
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Route mounting
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/', homeRoutes);
app.use('/', aboutRoutes);
app.use('/admin', adminRoutes);
app.use('/events', eventRoutes);
app.use('/eventreg', eventregRoutes);
app.use('/eventcre', eventcreRoutes);
app.use('/contact', contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).send('404: Page not found');
});

// Sync session store and DB, then start server
sessionStore.sync()
  .then(() => sequelize.sync({ alter: true })) // Use { force: true } only in development when you want to reset tables
  .then(() => {
    console.log('✅ Database & session store synchronized');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to sync database or session store:', err);
  });
