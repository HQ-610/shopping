var express = require('express');
var router = express.Router();
var User = require("./../models/user");
require("./../util/util")
/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('hello users');
});

router.get("/checkLog", function(req, res, next) {
	if(req.cookies.userId) {
		res.json({
			status: '0',
			msg: '',
			result: {
				userName: req.cookies.userName
			}
		})
	}
});
router.post("/login", function(req, res, next) {
	var param = {
		userName: req.body.userName,
		userPwd: req.body.userPwd
	}
	User.findOne(param, function(err, doc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message
			});
		} else {
			if(doc) {
				//session用req.session存
				res.cookie("userId", doc.userId, {
					path: '/',
					maxAge: 1000 * 60 * 60,
				});
				res.cookie("userName", doc.userName, {
					path: '/',
					maxAge: 1000 * 60 * 60,
				});
				//				res.session.user = doc
				res.json({
					status: "0",
					msg: '',
					result: {
						userName: doc.userName
					}
				});
			} else {
				res.json({
					status: "1",
					msg: '用户名或密码错误'
				});
			}
		}
	});
});
router.post("/logout", function(req, res, next) {
	res.cookie("userId", "", {
		path: "/",
		maxAge: -1
	});
	res.json({
		status: 0,
		msg: ""
	})
});
router.get("/cartList", function(req, res, next) {
	var userId = req.cookies.userId;
	User.findOne({
		userId: userId
	}, function(err, doc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message
			});
		} else {
			if(doc) {
				res.json({
					status: '0',
					msg: '',
					result: {
						cartList: doc.cartList
					}
				})
			} else {
				res.json({
					status: '1',
					msg: '',
					result: ''
				})
			}
		}
	});
});
router.post("/cartDel", function(req, res, next) {
	var productId = req.body.productId;
	var userId = req.cookies.userId;
	User.update({
		'userId': userId
	}, {
		'$pull': {
			'cartList': {
				'productId': productId
			}
		}
	}, function(err, doc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		} else {
			res.json({
				status: '0',
				msg: '删除成功',
				result: ''
			});
		}
	});
});
router.post("/cartEdit", function(req, res, next) {
	var userId = req.cookies.userId;
	var productId = req.body.productId;
	var productNum = req.body.productNum;
	var checked = req.body.checked;
	User.update({
		"userId": userId,
		"cartList.productId": productId
	}, {
		"cartList.$.productNum": productNum,
		"cartList.$.checked": checked
	}, function(err, doc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message
			});
		} else {
			res.json({
				status: '0',
				msg: '',
				result: ''
			})
		}
	})
});
router.post("/checkAll", function(req, res, next) {
	var checkAllFlag = req.body.checkAllFlag ? 1 : 0;
	var userId = req.cookies.userId;
	User.findOne({
		userId: userId
	}, function(err, user) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message
			});
		} else {
			user.cartList.forEach((item) => {
				item.checked = checkAllFlag;
				user.save(function(err1, doc) {
					if(err) {
						res.json({
							status: '1',
							msg: err1.message
						});
					} else {
						res.json({
							status: '0',
							msg: '',
							result: ''
						})
					}
				})
			})
		}
	})
});
router.get("/address", function(req, res, next) {
	var userId = req.cookies.userId;

	User.findOne({
		userId: userId
	}, function(err, doc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message
			})
		} else {
			if(doc) {
				res.json({
					status: '0',
					msg: '',
					result: doc.addressList
				})
			} else {
				res.json({
					status: '1',
					msg: '',
					result: ''
				})
			}
		}
	})
});
router.post("/setDefault", function(req, res, next) {
	var userId = req.cookies.userId;
	var addressId = req.body.addressId;
	User.findOne({
		userId: userId
	}, function(err, doc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message
			})
		} else {
			if(doc) {
				doc.addressList.forEach(function(item) {
					if(item.addressId == addressId) {
						item.isDefault = true;
					} else {
						item.isDefault = false;
					}
				})
				doc.save(function(err1, doc) {
					if(err1) {
						res.json({
							status: '1',
							msg: err.message
						})
					} else {
						res.json({
							status: '0',
							msg: ''
						})
					}
				})
			}
		}
	})
});
router.post("/delAddress", function(req, res, next) {
	var addressId = req.body.addressId;
	var userId = req.cookies.userId;
	User.update({
		'userId': userId
	}, {
		'$pull': {
			'addressList': {
				'addressId': addressId
			}
		}
	}, function(err, doc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		} else {
			res.json({
				status: '0',
				msg: '删除成功',
				result: ''
			});
		}
	});
});
router.post("/payMent", function(req, res, next) {
	var userId = req.cookies.userId;
	var addressId = req.body.addressId;
	var orderTotal = req.body.orderTotal;
	User.findOne({
		userId: userId
	}, function(err, doc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		} else {
			var goodsList = [];
			var address = '';
			doc.cartList.forEach((item) => {
				if(item.checked == '1') {
					goodsList.push(item)
				}
			})

			doc.addressList.forEach((item) => {
				if(item.addressId == addressId) {
					address= item
				}
			})
			
			var platform = '622';
			var r1 = Math.floor(Math.random()*10);
			var r2 = Math.floor(Math.random()*10);
			
			var sysDate = new Date().Format('yyyyMMddhhmmss');
			var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
			var orderId = platform + r1 + sysDate + r2;
			var order ={
				orderId:orderId,
				orderTotal:orderTotal,
				addressInfo:address,
				goodsList:goodsList,
				orderStatus:'1',
				createDate:createDate
			}

			doc.orderList.push(order);
			doc.save((err1, doc1) => {
				if(err1) {
					res.json({
						status: '1',
						msg: err.message,
						result: ''
					});
				}else{
					res.json({
						status: '0',
						msg: '',
						result: {
							orderId:order.orderId,
							orderTotal:order.orderTotal
						}
					});
				}
			})
		}
	})
})
module.exports = router;