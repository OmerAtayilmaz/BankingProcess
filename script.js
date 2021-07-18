'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2020-05-28T21:31:17.178Z',
    '2020-05-23T07:42:02.383Z',
    '2021-06-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-28T14:11:59.604Z',
    '2021-05-27T17:01:17.194Z',
    '2021-05-21T23:36:17.929Z',
    '2021-05-22T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const formatMovementDate=(date,locale)=>{
  const calcDaysPassed=(date1,date2)=>
    Math.round(Math.abs((date2-date1)/(1000*60*60*24)));

  const daysPassed=calcDaysPassed(new Date(),date);
 
  if(daysPassed===0)return 'Today';
  if(daysPassed===1)return 'Yesterday';
  if(daysPassed<=8)return `${daysPassed} days ago`;
  
   /*  //ifler çalışmazsa burası çalışır
    const day=`${date.getDate()}`.padStart(2,0);
    const month=`${date.getMonth()+1}`.padStart(2,0);//0'dan başlıyor.
    const year=date.getFullYear();
    return `${day}/${month}/${year}`;  */
    
    return new Intl.DateTimeFormat(locale).format(date);
}

const formatCurr=(value,locale,currency)=>{
  return new Intl.NumberFormat(locale,{
    style:'currency',
    currency:currency
  }).format(value);
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    
    const date=new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date,acc.locale);


    const formattedMov = formatCurr(mov,acc.locale,acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCurr(acc.balance,acc.locale,acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurr(incomes,acc.locale,acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurr(Math.abs(out),acc.locale,acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurr(interest,acc.locale,acc.currency);;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};


const startLogOutTimer = ()=>{
  const tick  = ()=>{
    const min = String(Math.trunc(time/60)).padStart(2,0);
    const sec=String(time%60).padStart(2,0);
    //In each call, print the remaining time
    labelTimer.textContent=`${min}:${sec}`;
    //when 0 seconds,stop timer and log out user
    if(time<=0){
      clearInterval(timer);
        // Display UI and message
        labelWelcome.textContent = "Log in to get started!";
        containerApp.style.opacity = 0;
    }//Decrease 1s
    time--;
  }
  //Set time to 5 minutes
  let time = 120;
  tick();//ilk sefer için immediately olarak çağırdık. yoksa 1 sn bekleyip sonra başlıyor-2. kullanıma çirkin görüntü oluşuyo
  //call timer every second
  const timer= setInterval(tick ,1000)
  return timer;
}
///////////////////////////////////////
// Event handlers
let currentAccount,timer;

//fake always logged
/* currentAccount=account1;
updateUI(currentAccount);
containerApp.style.opacity=100; */


btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );


  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Date işlemleri
 
    /*   const day=`${now.getDate()}`.padStart(2,0);
  const month=`${now.getMonth()+1}`.padStart(2,0);//0'dan başlıyor.
  const year=now.getFullYear()
  const hour=`${now.getHours()}`.padStart(2,0);
  const min=`${now.getMinutes()}`.padStart(2,0);
  labelDate.textContent=`${day}/${month}/${year}, ${hour}:${min}`;  */
    //Experimenting API
    const now=new Date();
    const options={
      hour:'numeric',
      minute:'numeric',
      day:'numeric',
      month:'long',
      year:'numeric',
      weekday:'long'
    }
    //numeric,long,2-digit,short,narrow gibi birçok parametre alır. API docs'tan daha fazlasını bulabilirsin!

    //localden dynamic dil ayarlama
  // const locale=navigator.language; pc' tarayıcısının dilini alıp tarih formatını belirledik!
    labelDate.textContent=new Intl.DateTimeFormat(currentAccount.locale,options).format(now); //optionstan saat ve dakika aldığımız için sadece onları verir.
    //Ülkeye göre ay-gün-yıl, tarih dili vs.değişir!

    //labelDate.textContent=new Intl.DateTimeFormat('en-GB').format(now); //tarih verir.
    //USA'daki gibi Ay-gün-yıl olarak listeler. tarihleri istediğimiz formata çevirmemizi sağlar.

  // Clear input fields
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();

    //timer
    if(timer)clearInterval(timer);
    timer= startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    //reset timer
    clearInterval(timer);
    timer=startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);



  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    
     setTimeout(function(){  // Add movement
        currentAccount.movements.push(amount);
        //Add loan date
        currentAccount.movementsDates.push(new Date().toISOString());
        // Update UI
        updateUI(currentAccount);
            //reset timer
            clearInterval(timer);
            timer=startLogOutTimer();
      },2500
      );
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
 
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/* console.log(23===23.0); //true döner

//js'de numaralar floattan türer.
//js'de numaralar binary türünde depolanır.


console.log(0.1+0.2);
//.30000000000000004=> sondak 4 olmamalıdı.(fraction:kesir)

console.log(0.1+0.2===0.3);
//false! fakat normal şartlarda true döndürmeliydi.

//2 yöntemle numbera dönüşüm sağlanır!
console.log(Number('23'));
console.log(+'24');//+ işareti sayesinde 24 numaraya dönüştü

//Parsing : numara stringin başında olmalı! 
console.log(Number.parseInt('24px',10));
console.log(Number.parseInt('s24',10));
//eğer int kullansaydık sadece 2'yi alırdı
console.log(Number.parseFloat('2.5rem'));

//global function olduğu için Number yazmaya gerek yok
console.log(parseFloat('  2.5rem'));


//Number.isNaN
console.log(isNaN('20'));
console.log(isNaN(20));
console.log(isNaN(+'25X'));
console.log(Number.isNaN(23/0));


//Numara olup olmadığını sorgular: checing if value is number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(20/0));//sonsuzu da algılıyor


console.log(Number.isInteger(23.0)); */


//////////////////MATH and rounding///////////////////////


/* console.log(Math.sqrt(25)); //kök alma
console.log(25**(1/2)); //kök alma pratik yol
console.log(25**(1/3)); //küp alma


console.log(Math.max(5,6,7,12,'5',25));
console.log(Math.min(-5,6,7,12,'5',25));
console.log(Math.PI);
console.log(Math.trunc(Math.random()*6)+1);
const randomInt=(min,max)=>Math.floor(Math.random()*(max-min)+1)+min;
console.log(randomInt(10,20));

//rounding integers
console.log(Math.trunc(22.42));
console.log(Math.round(23.4));//23
console.log(Math.round(23.6));//24


console.log(Math.ceil(23.9));//yukarı yuvarlar
console.log(Math.ceil(23.4));

//aşağı yuvarlar
console.log(Math.floor(23.9));
console.log(Math.floor(23.4));

//Rounding decimals
console.log((1.7).toFixed(0));//2 yazar
console.log((3.2).toFixed(4));//4 virgüllü kısmı temsil eder
console.log(+(2.342).toFixed(0));

 */


/* //Remainder Operator
console.log(5%2);


const isEven=n=>n%2===0;
labelBalance.addEventListener('click',()=>{
  [...document.querySelectorAll('.movements__row')].forEach(function(row,i){
     if(i%2===0)row.style.backgroundColor="#ccc";
  });
  console.log("çalıştı");
});


//BigInt (accurately:doğru olarak,kesin olarak)
console.log(2**53-1);
//2:0 ve 1
//53 alabileceği max numara! 2**53-1
console.log(Number.MAX_SAFE_INTEGER);

//doğru çalışmaz! - bazen doğru bazen yanlış çalışır! -
console.log(2**53+1);
console.log(2**53+5);

console.log( 9999999999999999999999999999999999999999n); //sonuna n koyarak onu BigInt yaptık
console.log(typeof 9999999999999999999999990000n); //bigint yazar!
console.log(BigInt(18999999999));//büyük sayılarda yukarıdaki yöntemi kullan!
console.log(12000n+12000n);

const huge=214124124n;
const num=25;
console.log(huge+BigInt(num));

console.log(20n==20,5n>2);//true, türlerine bakmadı ve değerler eşit
console.log(20n===20);//false, türlerine de baktı ve gg :)

//math operations don't work with bigint!

//divisions
console.log(10n/3n);//3n-decimal kısmı "cut" kesilir.
console.log(10/3);//3.333... */



//DATES

//Create a date

/* const now = new Date();
console.log(now)//we get current date
console.log(new Date('May 30 2021 17:14:15'));//stringi date' dönüştürüp döndürdü.
console.log(new Date('Dec 12, 2020'));
console.log(new Date([account1.movementsDates[0]]));
console.log(new Date(2024,10,19,15,23,3));

console.log(new Date(0));//1 jan 1970
console.log(new Date(3*24*60*60*1000)); //4 january 1970!!
 */
//working with dates

/* const future=new Date(2037,10,19,15,23,3);
console.log(future);//değişkene atayıp kullanabiliriz.


console.log(future.getFullYear());
console.log(future.getMonth())
console.log(future.getDate())
console.log(future.getDay())
console.log(future.getHours())
console.log(future.getMinutes())
console.log(future.getSeconds())
console.log(future.toISOString())//international date type
console.log(future.getTime());//milisecond tipinde
console.log(new Date(2142246183000));

console.log(Date.now());//1970'ten bugüne geçen süre milisecond tipinde

future.setFullYear(2040);//yıl değişti.
console.log(future);
//set diğerleri için de geçerlidir.
 */

/* 

const future=new Date(2037,10,19,15,23);
console.log(Number(future),+future);//miliseconda çevirir.(2 yöntemle)

const calcDaysPassed=(date1,date2)=>Math.abs((date2-date1)/(1000*60*60*24));

const days1 = calcDaysPassed(new Date(2037,3,14),new Date(2037,3,24))
console.log(days1);


 */


/* const num=252512.22;

const options={
  style:"currency",//unit,percent,currency
  unit:"celsius",//mile-per-hour,celsius,.... mdn'den bakabilirsin.
  currency:"EUR",
  useGrouping:false//virgül veya nokta ile ayırmaları kaldırır.-doğal haliyle yazdırır-d
}
console.log('TR:',new Intl.NumberFormat("tr-TR",options).format(num));//en=>252,512.22 tr=>252.512,22
console.log('US:',new Intl.NumberFormat("en-US",options).format(num));
console.log('GR:',new Intl.NumberFormat("de-DE",options).format(num));
console.log('Syria:',new Intl.NumberFormat("ar-SY",options).format(num));
console.log(navigator.language,new Intl.NumberFormat(navigator.language,options).format(num));
 */


//////////TİMERS:SETTIMEOUT AND SETINTERVAL///////////////////////////

//setTimeout:callback functions only executed once! - 1 kere çalışır!-
const ingredients=['olives','spinach','Sausage'];

const pizzaTimer = setTimeout((arg1,arg2,arg3)=>
console.log(`here is your pizza🍕 with ${arg1},${arg2} and ${arg3}!`)
,2000,...ingredients);

console.log("waiting....");

 if(ingredients.includes('spinach'))clearTimeout(pizzaTimer);
 

//setInterval
setInterval(function(){
  // console.log(new Date()); 
},1000);
















