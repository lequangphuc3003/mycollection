var totalOrders = 0;
var totalSpent = 0;
var pulling = true;
var page = 1;
let th = new Array(13); for (let i=0; i<13; ++i) th[i] = 0;
let th2020 = new Array(13); for (let i=0; i<13; ++i) th2020[i] = 0;
let th2019 = new Array(13); for (let i=0; i<13; ++i) th2019[i] = 0;
let th2018 = new Array(13); for (let i=0; i<13; ++i) th2018[i] = 0;
let name = new Array();
var tong = 0;
function getStatistics() {
	var orders = [];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			orders = JSON.parse(this.responseText)['data'];
			pulling = orders.length >= 10;
			orders = orders.filter(order => order['status'] == 'hoan_thanh');
			totalOrders += orders.length;
			orders.forEach(order => {
				tong = tong +1;
				let tpa = order["grand_total"];
				let t9 = order["created_at"];			
				var d = new Date(t9 * 1000);
				totalSpent += tpa;	
				var month = d.getMonth();
				var year = d.getYear();
				//console.log('Tháng: ' + month + " Năm " + year );
				let n1 = order["description"];
				name[tong] = n1;
				if(year == 121)
				{
					th[month] = th[month] + tpa;
					//console.log('debug: ' + th[month] );
				}
				else if(year == 120)
				{
					th2020[month] = th2020[month] + tpa;	
				}
				else if (year == 119)
				{
					th2019[month] = th2019[month] + tpa;
				}
				else if (year == 118)
				{
					th2018[month] = th2018[month] + tpa;
				}				
			});
			page += 1;
			console.log('Đã lấy được: ' + totalOrders + ' đơn hàng');
			if(pulling) {
				console.log('Đang kéo thêm...');
				getStatistics();
			}
			else {
				console.log("%cTổng đơn hàng đã giao: "+"%c"+moneyFormat(totalOrders), "font-size: 30px;","font-size: 30px; color:red");
				console.log("%cTổng chi tiêu: "+"%c"+moneyFormat(totalSpent)+"đ", "font-size: 30px;","font-size: 30px; color:red");
				xemthongketheothang();
			}
		}
	};
	xhttp.open("GET", "https://tiki.vn/api/v2/me/orders?page=" + page + "&limit=10", true);
	xhttp.send();
}

function moneyFormat(number, fixed=0) {
	if(isNaN(number)) return 0;
	number = number.toFixed(fixed);
	let delimeter = ',';
	number += '';
	let rgx = /(\d+)(\d{3})/;
	while (rgx.test(number)) {
		number = number.replace(rgx, '$1' + delimeter + '$2');
	}
	return number;
}
getStatistics();
function xemthongketheothang(){
	console.log("%c=============THỐNG KÊ TIỀN THEO TỪNG THÁNG==============","font-size: 24px; color:#0000FF");
	console.log("%c=======================NĂM 2021=========================","font-size: 24px; color:#0000FF");
	for(let i = 0; i < 12; i++){
	  //console.log('Tong tien thang ' +i+ ' là: ' + moneyFormat(th[i]));
	  console.log("%cTổng tiền tháng "+ (i+1) + " là: " +"%c"+moneyFormat(th[i])+" vnđ", "font-size: 20px;","font-size: 20px; color:#f07bbb");
	}
	console.log("%c=======================NĂM 2020=========================","font-size: 24px; color:#0000FF");
	for(let i = 0; i < 12; i++){
	  //console.log('Tong tien thang ' +i+ ' là: ' + moneyFormat(th[i]));
	  console.log("%cTổng tiền tháng "+ (i+1) + " là: " +"%c"+moneyFormat(th2020[i])+" vnđ", "font-size: 20px;","font-size: 20px; color:#f07bbb");
	}
	console.log("%c=======================NĂM 2019=========================","font-size: 24px; color:#0000FF");
	for(let i = 0; i < 12; i++){
	  //console.log('Tong tien thang ' +i+ ' là: ' + moneyFormat(th[i]));
	  console.log("%cTổng tiền tháng "+ (i+1) + " là: " +"%c"+moneyFormat(th2019[i])+" vnđ", "font-size: 20px;","font-size: 20px; color:#f07bbb");
	}
	console.log("%c=======================NĂM 2018=========================","font-size: 24px; color:#0000FF");
	for(let i = 0; i < 12; i++){
	  //console.log('Tong tien thang ' +i+ ' là: ' + moneyFormat(th[i]));
	  console.log("%cTổng tiền tháng "+ (i+1) + " là: " +"%c"+moneyFormat(th2018[i])+" vnđ", "font-size: 20px;","font-size: 20px; color:#f07bbb");
	}
}
function xemdanhsachsanpham(){
	
	for(let i = 0; i < name.length; i++){
	  console.log('%cThông tin đơn hàng ' + i +' :',"font-size: 18px; color:blue" );
	  console.log('Tên sản phẩm: ' + name[i]);
	} 
}