const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();

const homeController=require('../controllers/home');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', homeController.getSignIn);

router.post('/', homeController.getLogin);

router.get('/demo', homeController.getDemo);

router.post('/signup', homeController.getUser);
router.get('/signup', homeController.getSignUp);
router.post('/login', homeController.getLogin);
router.get('/login', homeController.getSuccess);



module.exports=router;