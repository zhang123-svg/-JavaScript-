前端手写 之 JavaScript语言基础特性

//模拟实现函数的call/apply/bind方法
//原理：核心点是为传进来的对象context添加fn这个函数属性，然后context就可以执行fn这个函数，即改变了this的指向

//call
// Function.prototype.myCall = function(context){
// 	context = context || window
// 	const fn = Symbol('tempprops')
// 	context[fn] = this
// 	let args = [...arguments].slice(1)
// 	let res = context[fn](...args)
// 	delete context[fn]
// 	return res
// }

// //apply
// Function.prototype.myApply = function(context){
// 	context = context || window
// 	context.fn = this
// 	let res
// 	if(arguments[1]){
// 		res = context.fn(...arguments[1])
// 	}else{
// 		res = context.fn()
// 	}
// 	delete context.fn
// 	return res
// }

//bind bind转换后的函数可以作为构造函数使用。
//此时this应该指向构造函数的实例，而不是bind绑定的第一个参数

// Function.prototype.myBind = function(context){
// 	if(typeof this !== 'function'){
// 		throw new TypeError('Error')
// 	}
// 	let _this = this
// 	let args = [...arguments].slice(1)
// 	return function F(){
// 		if(this instanceof F){
// 			return new _this(...args,...arguments)
// 		}
// 		return _this.apply(context,args.concat(...arguments))
// 	}
// }


//防抖
// function debounce(fn,delay){
// 	let timer = null  
// 	//维护一个timer，用来记录当前执行函数状态
// 	return function(){
// 		//通过this和arguments来获得作用域和变量
// 		let context = this
// 		let args = arguments
// 		//清理掉正在执行的函数并重新执行
// 		clearTimeout(timer)
// 		timer = setTimeout(function(){
// 			fn.apply(context,args)
// 		},delay)
// 	}
// }

//节流
// function throttle(fn,delay){
// 	let timer = null
// 	return function(){
// 		let context = this
// 		let args = arguments
// 		if(!timer){
// 			timer = setTimeout(function(){
// 				fn.apply(context,args)
// 				timer = null
// 			},delay)
// 		}
// 	}
// }

// 深拷贝(递归)
// function deepCopy(obj){
// 	let res
// 	if(typeof obj === 'object'){
// 		res = obj.constructor === Array ? [] : {}
// 		for(let k in obj){
// 			res = typeof obj[k] === 'object' ? deepCopy(obj[k]) : obj
// 		}
// 	}else{
// 		res = obj
// 	}
// 	return res
// }

//嵌套数组扁平化（多种方法）
// function flatten(arr){
// 	let res = []
// 	arr.forEach(item => {
// 		if(Array.isArray(item)){
// 			res = res.concat(flatten(item))
// 		}else{
// 			res.push(item)
// 		}
// 	})
// 	return res
// }

// function flatten(arr){
// 	return arr.reduce((pre,item) => {
// 		return pre.concat(Array.isArray(item) ? flatten(item) : item)
// 	},[])
// }

//模拟实现reduce方法
// Array.prototype.myReduce = function(fn,init){
// 	if(typeof fn !== 'function'){
//     	throw new TypeError('error')
//     }
    
//     let initialArr = this   //拿到当前数组
//     let arr = initialArr.concat()  //保证原始数组不被改变
//     let index,newValue
    
//     if(arguments.length === 2){
//     	arr.unshift(init)
//         index = 0
//     }else{
//     	index = 1
//     }
    
//     if(arr.length === 1){
//     	newValue = arr[0]
//     }
    
//     while(arr.length > 1){
//     	newValue = fn.call(null,arr[0],arr[1],index,initialArr)
//         index++
//         arr.splice(0,2,newValue)
    
//     }
//     return newValue
// };

//手写map方法
// Array.prototype.myMap = function(fn){
// 	if(typeof fn !== 'function'){
// 		throw new TypeError('error')
// 	}
	
// 	let newArr = []
// 	for(let i = 0; i < this.length; i++){
// 		newArr.push(fn(this[i],i,this))
// 	}
// 	return newArr
// };

//手写fill，filter
//arr.fill(value,start,end)
//value必需，start可选，end可选
	
// Array.prototype.myFill = function(value,start = 0,end = this.length){
// 	for(let i = start; i < end; i++){
// 		this[i] = value
// 	}
// }


//手写filter
// Array.prototype.myFilter = function(fn,context){
// 	let temp = []
// 	for(let i = 0; i < this.length; i++){
// 		let res = fn.call(context,this[i],i,this)
// 		if(res) temp.push(this[i])
// 	}
// 	return temp
// }

//手写find
// Array.prototype.myFind = function(fn){
// 	let arr = this
// 	for(let i = 0; i < arr.length; i++){
// 		let res = fn.call(this,arr[i],i,this)
// 		if(res) return arr[i]
// 	}
// }

//手写findIndex
// Array.prototype.myFindIndex = function(fn){
// 	for(let i = 0; i < this.length; i++){
//     	let res = fn.call(this,this[i],i,this)
//         if(res) return i
//     }
//     return -1
// }


//模拟实现Promise


// const PENDING = 'PENDING'
// const FULFILLED = 'FULFILLED'
// const REJECTED = 'REJECTED'

// class Promise{
// 	constructor(executor){
// 		//默认状态为PENDING
// 		this.status = PENDING
// 		//存放成功状态的值，默认为undefined
// 		this.value = undefined
// 		//存放失败状态的值，默认为undefined
// 		this.reason = undefined

// 		//存放成功的回调
// 		this.onResolvedCallbacks = []
// 		//存放失败的回调
// 		this.onRejectedCallbacks = []


// 		//调用此方法就是成功
// 		let resolve = (value) => {
// 			if(this.status === PENDING){
// 				this.status = FULFILLED;
// 				this.value = value;
// 				//依次将对应的函数执行
// 				this.onResolvedCallbacks.forEach(fn=>fn())
// 			}
// 		}

// 		let reject = (reason) => {
// 			if(this.status === PENDING){
// 				this.status = REJECTED;
// 				this.reason = reason;
// 				//依次将对应的函数执行
// 				this.onRejectedCallbacks.forEach(fn=>fn())
// 			}
// 		}

// 		try {
// 			executor(resolve,reject)
// 		} catch(error){
// 			reject(error)
// 		}
// 	}

// 	then(onFullfilled,onRejected){
// 		if(this.status === FULFILLED){
// 			onFullfilled(this.value)
// 		}

// 		if(this.status === REJECTED){
// 			onRejected(this.reason)
// 		}

// 		if(this.status === PENDING){
// 			//如果Promise的状态是pending，需要将onFulfilled 和 onRejected 函数存放起来
// 			//等待状态确定后，再依次将对应的函数执行
// 			this.onResolvedCallbacks.push(()=>{
// 				onFullfilled(this.value)
// 			});

// 			this.onRejectedCallbacks.push(()=>{
// 				onRejected(this.reason)
// 			})
// 		}
// 	}
// }



// const Promise = new Promise((resolve,reject) => {
// 	resolve('成功')
// }).then(
// 	(data) => {
// 		console.log('success',data)
// 	},
// 	(err) => {
// 		console.log('failed',err)
// 	}
// )


// class Person {
// 	constructor(name,age){
// 		this.name = name
// 		this.age = age
		
// 	}

// 	sayName(){
// 		console.log('我叫' + this.name)
// 	}
// }


// let p = new Person('zm',18)



// let fs = require('fs')

// function read(filename){
// 	return new Promise((resolve,reject) => {
// 		fs.readFile(filename,'utf8',(err,data) => {
// 			if(err) reject(err)
// 			resolve(data)
// 		})
// 	})
// }

// read('./name.txt').then()


// let sayName = (name) => {
// 	console.log('我叫' + name)
// };


// let sayAge = (age) => {
// 	console.log('我今年25')
// };

// function say(fn1,fn2){
// 	sayName('zhangmeng')
// };


//发布订阅
// class EventEmitter {
// 	constructor(){
// 		//事件对象，存放订阅的名字和事件
// 		this.events = {}
// 	}
// 	//订阅事件的方法
// 	on(eventName,callback){
// 		if()
// 	}
// }

// let obj = {}

// obj['name'] = [1]
// obj['name'].push(2)
// //console.log(obj['name'])



// class EventEmitter {
// 	constructor(){
// 		this.events = {}
// 	}
// 	//订阅事件的方法
// 	on(eventName,callback){
// 		if(this.events[eventName]){
// 			this.events[eventName].push(callback)
// 		}else{
// 			this.events[eventName] = [callback]
// 		}
// 	}
// 	//触发事件的方法
// 	emit(eventName){
// 		this.events[eventName] && this.events[eventName].forEach(cb => cb())
// 	}
// 	//移除订阅事件
// 	removeListener(eventName,callback){
// 		if(this.events[eventName]){
// 			this.events[eventName] = this.events[eventName].filter(cb => cb !== callback)
// 		}
// 	}
// 	//只执行一次订阅的事件，然后移除
// 	once(eventName,callback){
// 		let fn = () => {
// 			callback()
// 			this.removeListener(eventName,fn)
// 		}
// 		this.on(eventName,fn)
// 	}
// }

//测试发布订阅
// let em = new EventEmitter();
// let workday = 0;
// em.on("work", function() {
//     workday++;
//     console.log("work everyday");
// });

// em.once("love", function() {
//     console.log("just love you");
// });

// function makeMoney() {
//     console.log("make one million money");
// }
// em.on("money",makeMoney);

// let time = setInterval(() => {
//     em.emit("work");
//     em.removeListener("money",makeMoney);
//     em.emit("money");
//     em.emit("love");
//     if (workday === 5) {
//         console.log("have a rest")
//         clearInterval(time);
//     }
// }, 1);






// const Login = (function(){
// 	function Login(state){
// 		this.state = state
// 	}

// 	Login.prototype.stateNow = function(){
// 		console.log(state)
// 	}

// 	let instance = null
// 	return function single(...args){
// 		if(!instance){
// 			instance = new Login(...args)
// 		}
// 		return instance
// 	}
// })()


// const Login = (function(){
// 	class Login {
//     	constructor(state){
//         	this.state = state
//         }
        
//         show(){
//     		console.log(state)
//     	}
//     }
	
//     let instance = null
//     return function Single(...args){
//     	if(!instance){
//         	instance = new Login(...args)
//         }
//         return instance
//     }
// })()


// let ii = new Login('登录')
// let oo = new Login('登出')
// console.log(ii)


//类的形式
// const Login = (function(){
// 	class Login{
// 		constructor(state){
// 			this.state = state
// 		}

// 		show(){
// 			console.log(this.state)
// 		}
// 	}

// 	let instance = null
// 	return function Sington(...args){
// 		if(!instance){
// 			instance = new Login(...args)
// 		}
// 		return instance
// 	}

// })()


// let ii = new Login('登录')
// let oo = new Login('登出')
// console.log(ii)
// ii.show()
// oo.show()



// const p1 = new Promise((resolve,reject) => {
// 	console.log('创建一个Promise')
// 	resolve('成功了')   
//     //这里假设操作成功，
//     //resolve中的参数将作为.then的参数（成功的回调）
// })

// 	console.log('after new Promise')

// const p2 = p1.then(
// 	(data) => {
//     	console.log(data)
//     	throw new Error('失败了')
//     }     //因为前面写的resolve，所以这里没写（err）=> {}
// )

// const p3 = p2.then(
// 	(data) => {
//     	console.log('success',data)
//     },
//     (err) => {
//     	console.log('failed',err)   //因为上一步抛出了错误，所以这里打印Error的信息
//     }
// )




// class myPromise {
// 	constructor(executor){
// 		this.state = 'pedding'
// 		this.value = undefined
// 		this.reason = undefined

// 		this.onFullfilledList = []
// 		this.onRejectedList = []

// 		let resolve = (value) => {
// 		if(this.state === 'pedding'){
// 			this.state = 'success'
// 			this.value = value

// 			this.onFullfilledList.forEach(fn => fn())
// 			}
// 		}

// 		let reject = (reason) => {
// 			if(this.state === 'pedding'){
// 				this.state = 'failed'
// 				this.reason = reason

// 				this.onRejectedList.forEach(fn => fn())

// 			}
// 		}

// 		try {
// 			executor(resolve,reject)
// 		}catch(error) {
// 			reject(error)
// 			}

// 		}

	


// 	then(onFullfilled,onRejected){
// 		if(this.state === 'success'){
// 			onFullfilled(this.value)
// 		}

// 		if(this.state === 'failed'){
// 			onRejected(this.reason)
// 		}

// 		if(this.state === 'pedding'){
// 			this.onFullfilledList.push(() => {
// 				onFullfilled(this.value)
// 			})

// 			this.onRejectedList.push(() => {
// 				onRejected(this.reason)})
// 			}
// 		}

// }



// const p3 = p2.then(
// 	(data) => {
//     	console.log('success',data)
//     },
//     (err) => {
//     	console.log('failed',err)   //因为上一步抛出了错误，所以这里打印Error的信息
//     })




// class myPromise {
// 	constructor(executor){
// 		this.state = 'pedding'
// 		this.value = undefined
// 		this.reason = undefined

// 		this.onFullfilledList = []
// 		this.onRejectedList = []


// 		let resolve = (value) => {
// 			if(this.state === 'pedding'){
// 				this.state = 'success'
// 				this.value = value

// 				this.onFullfilledList.forEach(fn => fn())
// 			}
// 		}

// 		let reject = (reason) => {
// 			if(this.state === 'pedding'){
// 				this.state = 'failed'
// 				this.reason = reason

// 				this.onRejectedList.forEach(fn => fn())
// 			}
// 		}

// 		try {
// 			executor(resolve,reject)
// 		}catch(error){
// 			reject(error)
// 		}
// 	}

// 	then(onFullfilled,onRejected){
// 		if(this.state === 'success'){
// 			onFullfilled(this.value)
// 		}

// 		if(this.state === 'failed'){
// 			onFullfilled(this.reason)
// 		}

// 		if(this.state === 'pedding'){
// 			this.onFullfilledList.push(() => onFullfilled(this.value))
// 		}

// 		if(this.state === 'pedding'){
// 			this.onRejectedList.push(() => onRejected(this.value))
// 		}
// 	}

// }



// const p1 = new myPromise((resolve,reject) => {
// 	console.log('创建一个Promise')
// 	setTimeout(()=>{
// 		resolve('成功了')
// 	},2000)
	   
//     //这里假设操作成功，
//     //resolve中的参数将作为.then的参数（成功的回调）
// })

// 	console.log('after new Promise')

// const p2 = p1.then(
// 	(data) => {
//     	console.log(data)
//         //throw new Error('失败了')
//     },     //因为前面写的resolve，所以这里没写（err）=> {}
//     () => {

//     }
// )




// const resolvePromise = (promise2, x, resolve, reject) => {
//   // 自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise  Promise/A+ 2.3.1
//   if (promise2 === x) { 
//     return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
//   }
//   // Promise/A+ 2.3.3.3.3 只能调用一次
//   let called;
//   // 后续的条件要严格判断 保证代码能和别的库一起使用
//   if ((typeof x === 'object' && x != null) || typeof x === 'function') { 
//     try {
//       // 为了判断 resolve 过的就不用再 reject 了（比如 reject 和 resolve 同时调用的时候）  Promise/A+ 2.3.3.1
//       let then = x.then;
//       if (typeof then === 'function') { 
//         // 不要写成 x.then，直接 then.call 就可以了 因为 x.then 会再次取值，Object.defineProperty  Promise/A+ 2.3.3.3
//         then.call(x, y => { // 根据 promise 的状态决定是成功还是失败
//           if (called) return;
//           called = true;
//           // 递归解析的过程（因为可能 promise 中还有 promise） Promise/A+ 2.3.3.3.1
//           resolvePromise(promise2, y, resolve, reject); 
//         }, r => {
//           // 只要失败就失败 Promise/A+ 2.3.3.3.2
//           if (called) return;
//           called = true;
//           reject(r);
//         });
//       } else {
//         // 如果 x.then 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.3.4
//         resolve(x);
//       }
//     } catch (e) {
//       // Promise/A+ 2.3.3.2
//       if (called) return;
//       called = true;
//       reject(e)
//     }
//   } else {
//     // 如果 x 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.4  
//     resolve(x)
//   }
// }



// class myPromise {
// 	constructor(executor){
// 		this.state = 'pedding'
// 		this.value = undefined
// 		this.reason = undefined

// 		this.onFullfilledList = []
// 		this.onRejectedList = []


// 		let resolve = (value) => {
// 			if(this.state === 'pedding'){
// 				this.state = 'success'
// 				this.value = value

// 				this.onFullfilledList.forEach(fn => fn())
// 			}
// 		}

// 		let reject = (reason) => {
// 			if(this.state === 'pedding'){
// 				this.state = 'failed'
// 				this.reason = reason

// 				this.onRejectedList.forEach(fn => fn())
// 			}
// 		}

// 		try {
// 			executor(resolve,reject)
// 		}catch(error){
// 			reject(error)
// 		}
// 	}


// 	then(onFullfilled,onRejected) {
// 		onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : v => v
// 		onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err}

// 		let promise2 = new Promise((resolve,reject) => {
// 			if(this.state === 'success'){
// 				setTimeout(()=>{
// 					try {
// 						let x = onFullfilled(this.value)

// 						resolvePromise(promise2,x,resolve,reject)
// 					}catch(err){
// 						reject(err)
// 					}
// 				},0)
// 			}

// 			if(this.state === 'failed'){
// 				setTimeout(()=>{
// 					try{
// 						let x = onRejected(this.reason)

// 						resolvePromise(promise2,x,resolve,reject)
// 					}catch(err){
// 						reject(err)
// 					}
// 				},0)
// 			}

// 				if(this.state === 'pedding'){
// 					this.onFullfilledList.push(()=>{
// 						setTimeout(()=>{
// 							try {
// 								let x = onFullfilled(this.value)

// 								resolvePromise(promise2,x,resolve,reject)
// 							}catch(err){
// 								reject(err)
// 							}
// 						},0)
// 					})

// 					this.onRejectedList.push(()=>{
// 					setTimeout(()=>{
// 						try{
// 							let x = onRejected(this.reason)

// 							resolvePromise(promise2,x,resolve,reject)
// 						}catch(err){
// 							reject(err)
// 						}
// 					},0)
// 				})
// 			}

// 			})
// 		return promise2
// 	}	
// }



// const mypromise = new Promise((resolve, reject) => {
//   reject('失败');
// }).then().then().then(data=>{
//   console.log(data);
// },err=>{
//   console.log('err',err);
// })




// const resolvePromise = (promise2,x,resolve,reject) => {
// 	//自己等待自己完成，x可能是个promise
// 	if(promise2 === x){
// 		return reject(new TypeError('Chaining cycle detected for promise'))
// 		let called;

// 		if((typeof x === 'object' && x !== null) || typeof x === 'function'){
// 			try{
// 				let then = x.then;
// 				if(typeof then === 'function'){
// 					then.call(x,y => {
// 						if(called) return;
// 						called = true

// 						resolvePromise(promise2,y,resolve,reject)
// 					},r => {
// 						if(called) return
// 							called = true;
// 						reject(r)
// 					})
// 				}else {
// 					resolve(x)
// 				}
// 			}catch(err){
// 				if(called) return;
// 				called = true
// 				reject(e)
// 			}
// 		}else{
// 			resolve(x)
// 		}
// 	}
// }




//Promise.all
// static all(values) {
// 	if(!Array.isArray(values)){
// 		const type = typeof List
// 		return new TypeError('传入数组')
// 	}

// 	return Promise((resolve,reject) => {
// 		let resultArr = []
// 		let orderIndex = 0
// 		const processResultByKey = (value,index) => {
// 			resultArr[index] = value //把各个promise的结果拿到并存在一个数组里
// 			if(++orderIndex === values.length){
// 				resolve(resultArr)  //当拿到所有结果时执行resolve
// 			}
// 		}
// 		for (let i = 0; i < values.length; i++) {
//       let value = values[i];
//       if (value && typeof value.then === 'function') {
//         value.then((value) => {
//           processResultByKey(value, i);
//         }, reject);
//       } else {
//         processResultByKey(value, i);  //如果输入的不是promise对象,value没有.then方法，那么直接把value填入数组
//       }
//     }
// 	})
// }



// function myAll(arr){
// 	return newPromise((resolve,reject) => {
// 		let ret = []
// 		let count = 0
// 		let done = (i,data) => {
// 			ret[i] = data
// 		}

// 		for(let i = 0; i < arr.length; i++){
// 			arr[i].then(data => done(i,data),reject)
// 		}



// 	})
// }



// const p = new Promise((resolve,reject)=>{
// 	resolve(123)
// })

// const p2 = p.then(
// 	(value)=>{
// 		console.log('value:' + value)
// 	},
// 	(reason)=>{
// 		console.log('reason:' + reason)
// 	}
// )


// p2.then(
// 	(value)=>{
// 		console.log('value2:' + value)
// 	},
// 	(reason)=>{
// 		console.log('reason2:' + reason)
// 	}
// )


//bolanbiaodashi






// Promise.all = function(arr){
// 	if(!Array.isArray(arr)){
// 		return new TypeError(`TypeError: is not iterable`)
// 	}


// 	return new Promise((resolve,reject)=>{
// 		let resArr = []
// 		let count = 0
// 		const processRes = (value,index) => {
// 			resArr[index] = value
// 			if(++count === arr.length){
// 				resolve(resArr)
// 			}
// 		}

// 		for(let i = 0; i < arr.length; i++){
// 			if(arr[i] && typeof arr[i].then === 'function'){
// 				arr[i].then((value) => {
// 					processRes(value,i)
// 				},reject)
// 			}else{
// 				processRes(arr[i],i)
// 			}
// 		}
// 	})
// }



// Promise.myAll = function(values) {
//   if (!Array.isArray(values)) {
//     const type = typeof values;
//     return new TypeError(`TypeError: ${type} ${values} is not iterable`)
//   }
//   return new Promise((resolve, reject) => {
//     let resultArr = [];
//     let orderIndex = 0;
//     const processResultByKey = (value, index) => {
//       resultArr[index] = value;
//       if (++orderIndex === values.length) {
//           resolve(resultArr)
//       }
//     }
//     for (let i = 0; i < values.length; i++) {
//       let value = values[i];
//       if (value && typeof value.then === 'function') {
//         value.then((value) => {
//           processResultByKey(value, i);
//         }, reject);
//       } else {
//         processResultByKey(value, i);
//       }
//     }
//   });
// }



// let p1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('ok1');
//   }, 1000);
// })

// let p2 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('ok2');
//   }, 1000);
// })

// Promise.all([1,2,3,p1,p2]).then(data => {
//   console.log('resolve', data);
// }, err => {
//   console.log('reject', err);
// })


// const p1 = new Promise((resolve,reject)=>{
// 	resolve(345)
// })

// // const p = Promise.resolve(p1)

// p1.then(
// 	(data)=>{
// 		console.log('data:' + data)
// 	},
// 	(err)=>{
// 		console.log('err:' + err)
// 	}
// )






// Promise.all1 = function(arr){
// 	if(!Array.isArray(arr)){
// 		return new TypeError('err')
// 	}


// 	return new Promise((resolve,reject)=>{
// 		let resArr = []
// 		let count = 0
// 		const processRes = (value,index) => {
// 			resArr[index] = value
// 			if(++count === arr.length){
// 				resolve(resArr)
// 			}
// 		}

// 		for(let i = 0; i < arr.length; i++){
// 			if(arr[i] && typeof arr[i].then === 'function'){
// 				arr[i].then((value)=>{
// 					processRes(value,i)
// 				},reject)
// 			}else{
// 				processRes(arr[i],i)
// 			}
// 		}
// 	})

// }





// let p1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('ok1');
//   }, 1000);
// })

// let p2 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('ok2');
//   }, 1000);
// })

// Promise.all1([1,2,3,p1,p2]).then(data => {
//   console.log('resolve', data);
// }, err => {
//   console.log('reject', err);
// })




// Promise.race = function(arr){
// 	return new Promise((resolve,reject)=>{
// 		for(let i = 0; i < arr.length; i++){
// 			if(arr[i] && typeof arr[i].then === 'function'){
// 				arr[i].then(resolve,reject)
// 			}else{
// 				resolve(arr[i])
// 			}
// 		}
// 	})
// }


// Promise.race = function(arr){
// 	return new Promise((resolve,reject)=>{
// 		for(let i = 0; i < arr.length; i++){
// 			if(arr[i] && typeof arr[i].then === 'function'){
// 				arr[i].then((value)=>{
// 					resolve(value)
// 				})
// 			}else{
// 				resolve(arr[i])
// 			}
// 		}
// 	})
// }



// let p1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('ok1');
//   }, 2000);
// })

// let p2 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('ok2');
//   }, 3000);
// })


// Promise.race([p2,p1]).then(data => {
//   console.log('resolve', data);
// }, err => {
//   console.log('reject', err);
// })


//手写ajax请求

// var xhr = new XHMHttpRequest() //创建XMLHttpRequest
// var url = 'https://zju.com'
// xhr.onreadystatechange = function(){
// 	if(xhr.readyState === 4){
// 		if(xhr.status === 200){
// 			console.log(xhr.responseText)
// 		}else{
// 			console.error(xhr.statusText)
// 		}
// 	}
// }

// xhr.open('GET',url,true)
// xhr.send()


// 创建XMLHttpRequest
// readyState 0-4
// onreadystatechange
// status

// responseText



// var xhr = new XMLHttpRequest()
// var url = 'https://baidu.com'
// xhr.onreadystatechange = function(){
// 	if(xhr.readyState ===){
// 		if(xhr.status === 200){
// 			console.log(xhr.responseText)
// 		}else{
// 			console.error(xhr.statusText)
// 		}
// 	}
// }

// xhr.open('GET',url,true)
// xhr.send()



// var xhr = new XMLHttpRequest()
// var url = 'https://sdf.com'

// xhr.onreadystatechange = function(){
// 	if(xhr.readyState === 4){
// 		if(xhr.status === 200){
// 			console.log(xhr.responseText)
// 		}else{
// 			console.error(xhr.statusText)
// 		}
// 	}
// }

// xhr.open('GET',url,true)
// xhr.send(null)

//模拟实现new的过程
// function myNew(constructor,params){
// 	var args = [].slice.call(arguments)

// }


// let a = [1,2,3,4]
// let b = a.slice(1)
// console.log(b)



// function myCall(context){
// 	context = context || window
// 	let fn = Symbol()
// 	context[fn] = function(){

// 	}
// 	context[fn]
// }




// let a = Symbol(1)
// let b = Symbol(2)
// console.log(a)




// Function.prototype.myCall(context){
// 	context = context || window
// 	context.fn = this
// 	let args = [...arguments].slice(1)
// 	let res = context.fn(...args)
// 	context.fn(args)
// 	delete context.fn
// 	return res
// }


// Function.prototype.myCall(context){
// 	context = context || window
// 	let args = [...arguments].slice(1)
// 	let fn = Symbol('tempprops')
// 	context[fn] = this
// 	let res = context[fn](...args)
// 	delete context[fn]
// 	return res
// }




// let xhr = new XMLHttpRequest();
// let url = 'https://baidu.com'
// xhr.onreadystatechange = function(){
// 	if(xhr.readyState === 4){
// 		if(xhr.status === 200){
// 			console.log(xhr.responseText)
// 		}else{
// 			console.error(xhr.statusText)
// 		}
// 	}
// }

// xhr.open('GET',url,true)
// xhr.send(null)



//模拟实现构造函数new的过程
// function myNew(constructor,params){
// 	//var args = [].slice.call(arguments)
// 	var args = [].slice.call(arguments)
// 	var constructor = args.shift()
// 	var obj = new Object()

// 	obj.__proto__ = constructor.prototype;
//   	var res = constructor.apply(obj,args);
//   	return (typeof res === 'object' && typeof res !== null) ? res : obj;
// }



// function myNew(constructor,params){
// 	let args = [...arguments]
// 	constructor = args.shift()
// 	let obj = new Object()
// 	obj.__proto__ = constructor.prototype
// 	let res = constructor.apply(obj,args)
// 	return (typeof res === 'object' && typeof res !== null) ? res : obj
// }







// function Person(name,age){
// 	this.name = name
//     this.age = age
//     //console.log(this)  //Person {name:'zm',age:'12'}
//     //return this  //默认隐藏
// }

// let p1 = new Person('zm',12)
// console.log(p1)
// let p2 = myNew(Person,'zm1',13)
// console.log(p2)

// let p3 = new Object()
// p3.sex = 'nan'
// console.log(p3)

// let p4 = myNew(Object)
// console.log(p4)


// function add(a,b,c){
// 	//let args = [].slice.call(arguments)
// 	let args = [...arguments]
// 	console.log(args.shift())
// }

// add(1,2,3)




// function Person(name,age){
// 	this.name = name
//     this.age = age
//     //console.log(this)  //Person {name:'zm',age:'12'}
//     //return this  //默认隐藏
// }

// Person.prototype.say = function(){
// 	console.log('HI')
// }

// //Object.create()

// function object(o){
// 	function F(){}
// 	F.prototype = o
// 	return new F()
// }


// let res = object(Person)

// console.log(res.prototype)
// res.prototype.say()


// function myExtends(Supertype,SubType){

// }


// function object(o){
//   function F(){}
//   F.prototype = o;
//   return new F();
// }

// var person = {
//     name: "Nicholas",
//     friends: ["Shelby", "Court", "Van"]
// };



// var anotherPerson = object(person);
// console.log(anotherPerson)

// anotherPerson.name = "Greg";
// console.log(person)

// anotherPerson.friends.push("Rob");
// console.log(person)


// var yetAnotherPerson = object(person);
// yetAnotherPerson.name = "Linda";
// yetAnotherPerson.friends.push("Barbie");
//alert(person.friends);   //"Shelby,Court,Van,Rob,Barbie"


// function myExtends(SuperType,SubType){
// 	var prototype = Object.create(SuperType.prototype)
// 	prototype.constructor = SubType
// 	SubType.prototype = prototype
// }


// function Super1(name){
// 	this.name = name
// }

// Super1.prototype.say = function(){
// 	console.log('hi')
// }


// function Sub1(name,age){


// 	Supertype.call(this,name)
// 	this.age = age
// }

// myExtends(Super1,Sub1)

// Sub1.prototype.say()






// function B(name){
//   this.name = name;
// };
// function A(name,age){
//   //1.将A的原型指向B
//   _extends(A,B);
//   //2.用A的实例作为this调用B,得到继承B之后的实例，这一步相当于调用super
//   //Object.getPrototypeOf(A).call(this, name)
//   //console.log(Object.getPrototypeOf(A))
//   B.call(this, name)

//   //3.将A原有的属性添加到新实例上
//   this.age = age; 
//   //4.返回新实例对象
//   return this;
// };
// function _extends(A,B){
//    //A.prototype.__proto__= B.prototype;
//    Object.setPrototypeOf(A.prototype,B.prototype);
//    A.prototype.constructor = A;
//    //Object.setPrototypeOf(A,B);
//    A.__proto__ = B
// };
// var a = new A('wxp',18);
// console.log(a)  //{name:'wxp',age: 18}


// let obj1 = {a:1};
// let obj2 = {b:2,c:3};
// Object.setPrototypeOf(obj1,obj2);
// console.log(obj1)
// console.log(Object.getPrototypeOf(obj1));
// console.log(Object.getPrototypeOf(obj2));

// function myNew(constructor,params){
// 	var args = [...arguments]
//     var constructor = args.shift()
//     var obj = new Object()
// 	obj.__proto__ = constructor.prototype
//     var res = constructor.apply(obj,args)
//     return typeof res === 'object' ? res : obj
// }


// function pr(name){
// 	this.name = name
// }


// let p = myNew(pr,'zm')


// console.log(p)


//实现Object.create()

// function object(o){
// 	function F(){}
// 	F.prototype = o
// 	return new F()
// }


// //模拟实现instanceof
// function instanceofObj(a,b){
// 	//模拟 a instanceof b
// 	let prototypeB = b.prototype
// 	let protoA = a.__proto__
// 	let state = false
// 	while(true){
// 		if(protoA === null){ //可能是undefinded
// 			state = false
// 			break
// 		}
// 		if(prototypeB === protoA){
// 			state = true
// 			break
// 		}
// 		protoA = protoA.__proto__
// 	}
// 	return state
// }


// console.log(instanceofObj([],Array))




//用setTimeout实现setInterval




// function mysetInterval(fn,time){
// 	function interval(){

// 		setTimeout(interval,time)
// 		fn()
// 	}

// 	setTimeout(interval,time)
// }


// mysetInterval(function(){
// 	console.log(0)
// },1000)


//实现jsonp
// var newscript = document.createElement('script')
// newscript.src = 'https://sdfg'
// document.body.appendChild(newscript)
// function foo(data){
// 	console.log(data)
// }
