// offerRoutes.js
// Place in: backend/routes/offerRoutes.js

const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const Offer   = require('../models/Offer');
