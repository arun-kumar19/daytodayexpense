const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();

const homeController=require('../controllers/home');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', homeController.getSignInPage);

router.post('/', homeController.getLogin);

router.get('/demo', homeController.getDemo);
router.get('/export/:token', homeController.getExport);
router.post('/signup', homeController.getUser);
router.get('/signup', homeController.getSignUp);
router.post('/login', homeController.getLogin);
router.get('/login', homeController.getSuccess);
router.get('/profile', homeController.getProfile);
router.get('/profile/userexpences', homeController.getSingleUserExpences);
router.get('/profile/userexpences/:id', homeController.getUserExpence);
router.post('/addexpence', homeController.getAddExpence);
router.get('/editexpence/:expenceid', homeController.getEditExpence);
router.delete('/deleteexpence/:expenceid', homeController.getDeleteExpence);
router.put('/updateexpence/:expenceid', homeController.getUpdatedExpence);
router.get('/buypremium', homeController.getPremiumPayment);
router.post('/updatetransactionstatus', homeController.getUpdateTransactionStatus);
router.get('/profile/userstatus', homeController.getUserStatus);
router.get('/profile/leaderboard', homeController.getLeaderBoard);
router.get('/forgetpassword', homeController.getForgetPasswordUser);
router.get('/password/forgetpassword/:emailid', homeController.getForgetPassword);
router.get('/password/resetpassword/:forgotpasswordrequestid', homeController.getChangePassword);
router.put('/changepassword/:userid', homeController.getChangePasswordUser);
router.get('/profile/monthlysummary', homeController.getMonthlyReport);
router.get('/profile/yearlysummary', homeController.getYearlyReport);
router.get('/profile/download', homeController.Authenticate,homeController.getDownload);
router.get('/profile/urllist', homeController.Authenticate,homeController.getUrlList);
router.get('/profile/items', homeController.Authenticate,homeController.getItems);

module.exports=router;