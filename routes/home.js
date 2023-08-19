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
router.get('/profile/:userid', homeController.getProfile);
router.get('/profile/userexpences/:id', homeController.getUserExpence);
router.post('/addexpence', homeController.getAddExpence);
router.get('/editexpence/:expenceid', homeController.getEditExpence);
router.delete('/deleteexpence/:expenceid', homeController.getDeleteExpence);
router.put('/updateexpence/:expenceid', homeController.getUpdatedExpence);



module.exports=router;