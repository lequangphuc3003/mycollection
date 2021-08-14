var tongDonHang = 0;
var tongTienDuocGiamMggShopee=0;
var tongTienDuocGiamMggShopeeShop=0;
var tongTienChiTieu = 0;
var tongTienTietKiem=0;
var tongTienHang = 0;
var tongTienVanChuyenChuaGiam = 0;
var tongTienVanChuyenDuocGiam = 0;
var tongSanPhamDaMua = 0;
var trangThaiDonHangConKhong = true;
var offset = 0;
var si = 8;
var offset1 = 0;
var si1 = 1;
var tongTienVanChuyenPhaiTra=0;
var thoigianThanhToan=0
let th = new Array(13); for (let i=0; i<13; ++i) th[i] = 0;
let th2020 = new Array(13); for (let i=0; i<13; ++i) th2020[i] = 0;
let th2019 = new Array(13); for (let i=0; i<13; ++i) th2019[i] = 0;
var checked = false;
function xemBaoCaoThongKe() {
	checked = true;
	var orders = [];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			orders = JSON.parse(this.responseText)['orders'];
			tongDonHang += orders.length;
			trangThaiDonHangConKhong = orders.length >= si;
			orders.forEach(order => {
                let t3 = order["shipping_discount_subtotal"] / 100000;
                tongTienVanChuyenDuocGiam += t3;
                let t31 = order["shipping_subtotal_before_discount"] / 100000;
                tongTienVanChuyenChuaGiam += t31;
                let t4=order["merchandise_subtotal"] / 100000;
				tongTienHang+=t4;
				let t41=order["actual_price"] / 100000;
				//console.log("%c DON: "+"%c" +pxgPrice(offset)+" - " +t41+" vnđ", "font-size: 20px;","font-size: 20px; color:#fc0000");				
				tongTienChiTieu+=t41;
				let t2 = order["shipping_fee"] / 100000;
                tongTienVanChuyenPhaiTra += t2;
                order["items"].forEach(item => {
                    let t5 = item["amount"];
                    tongSanPhamDaMua += t5;
                });
				let t10=order["items"]["name"];
                //    let n1 = names["name"];                 
                //});
                let t6=(order["payment_info"]["voucher_info"]["discount_by_shop_voucher"]||0)/100000;
                tongTienDuocGiamMggShopeeShop += t6;
                let t61=(order["payment_info"]["promotion_info"]["used_price"]||0)/100000;
                tongTienDuocGiamMggShopeeShop += t61;

                let t7=(order["payment_info"]["voucher_info"]["discount_by_shopee_voucher"]||0)/100000;
                tongTienDuocGiamMggShopee += t7;
				let t9=(order["pay_time"]);				
				var d = new Date(t9 * 1000);
				//console.log('Thời gian thanh toán: ' + d );
				//let font = "X\u1ed1p ch\u1eb7n c\u1eeda, ch\u00e8n c\u1eeda, si\u00eau d\u00e0y v\u00e0 h\u1eefu \u00edch, giao m\u1ea7u ng\u1eabu nhi\u00ean";
				//console.log('font', font);
				var month = d.getMonth();
				var year = d.getYear();
				//console.log('Tháng: ' + month + " Năm " + year );
				if(year == 121)
				{
					th[month] = th[month] + t41;
					//console.log('debug: ' + th[month] );
				}
				else if(year == 120)
				{
					th2020[month] = th2020[month] + t41;	
				}
				else if (year == 119)
				{
					th2019[month] = th2019[month] + t41;
				}
			});
			offset += si;
			console.log('Đã thống kê được: ' + tongDonHang + ' đơn hàng');
			if(trangThaiDonHangConKhong) {
				//console.log('Đợi chút tui đang xử lý...');
				xemBaoCaoThongKe();
			}
			else {
				menu();
			}
		}
	};
	xhttp.open("GET", "https://shopee.vn/api/v1/orders/?order_type=3&offset="+offset+"&limit="+si, true);
	xhttp.send();
}
function PXGCert(pri){
  if(pri<=10000000){
  	return "Mình mua sắm cũng THƯỜNG ha";
  }else if(pri>10000000 &&pri<=50000000){
  	return "Mình mua sắm cũng TÀM TẠM ha";
  }else if(pri>50000000 &&pri<80000000){
  	return "Mình mua sắm hơi bị KINH ĐÓ hơ";
  }else{
  	return "Mình là bậc thầy mua sắm, là THÁNH SHOPEE kaka";
  }
}
function pxgPrice(number, fixed=0) {
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
function xemtongchitieu(){
	tongTienHang=tongTienHang-(tongTienDuocGiamMggShopeeShop+tongTienDuocGiamMggShopee);
	tongTienTietKiem=tongTienDuocGiamMggShopee+tongTienDuocGiamMggShopeeShop+tongTienVanChuyenDuocGiam;
	var tongTienChiTieuX=pxgPrice(tongTienChiTieu);
	console.log("================================");
	console.log("%c"+PXGCert(tongTienChiTieu), "font-size:26px;");
	console.log("%cHết có: "+"%c"+tongTienChiTieuX+" vnđ%c chứ nhiêu hì hì", "font-size: 20px;","font-size: 26px; color:red;font-weigth:700", "font-size: 20px;");
	console.log("================================");
	console.log("%cTổng đơn hàng đã giao: "+"%c"+pxgPrice(tongDonHang)+" đơn hàng", "font-size: 26px;","font-size: 26px; color:green");
	console.log("%cTổng sản phẩm đã đặt: " + "%c" + pxgPrice(tongSanPhamDaMua)+" sản phẩm", "font-size: 20px;","font-size: 20px; color:#fc0000");
	console.log("%cTổng tiền hàng: "+"%c"+pxgPrice(tongTienHang)+" vnđ", "font-size: 20px;","font-size: 20px; color:#fc0000");
	console.log("%cTổng tiền vận chuyển đã trả: "+"%c"+pxgPrice(tongTienVanChuyenPhaiTra)+" vnđ", "font-size: 20px;","font-size: 20px; color:#fc0000");
	console.log("%cTổng tiền hàng + tiền ship: "+"%c"+tongTienChiTieuX+" vnđ", "font-size: 26px;","font-size: 26px; color:#fc0000");
	console.log("================================");
	console.log("%cTổng tiền thực tế PHẢI trả nếu không dùng các loại MggShopee: "+"%c"+pxgPrice(tongTienChiTieu+tongTienTietKiem)+" vnđ", "font-size: 18px;","font-size: 18px; color:#fc0000");
	console.log("%cTổng tiền vận chuyển nếu không dùng mã freeship shopee: "+"%c"+pxgPrice(tongTienVanChuyenChuaGiam)+" vnđ", "font-size: 18px;","font-size: 18px; color:#fc0000");
	console.log("%cTổng tiền vận chuyển tiết kiệm được khi dùng mã freeship shopee: "+"%c"+pxgPrice(tongTienVanChuyenDuocGiam)+" vnđ", "font-size: 18px;","font-size: 18px; color:green");
	console.log("%cTổng tiền tiết kiệm được khi dùng MggShopee: "+"%c"+pxgPrice(tongTienDuocGiamMggShopee)+" vnđ", "font-size: 18px;","font-size: 18px; color:green");
	console.log("%cTổng tiền tiết kiệm được khi dùng MggShopee của Shop: "+"%c"+pxgPrice(tongTienDuocGiamMggShopeeShop)+" vnđ", "font-size: 18px;","font-size: 18px; color:green");
	console.log("%cTổng tiền tiết kiệm được: "+"%c"+pxgPrice(tongTienTietKiem)+" vnđ", "font-size: 18px;","font-size: 18px; color:green");
	console.log("================================");
	menu();	
}
var offset1 = 0;
var si1 = 1;
var trangThai = true;
var tong =0;
function xemthongketheothang(){
	if(checked==true){
		console.log("%c=============THỐNG KÊ TIỀN THEO TỪNG THÁNG==============","font-size: 24px; color:#0000FF");
		console.log("%c=======================NĂM 2021=========================","font-size: 24px; color:#0000FF");
		for(let i = 0; i < 12; i++){
		  //console.log('Tong tien thang ' +i+ ' là: ' + pxgPrice(th[i]));
		  console.log("%cTổng tiền tháng "+ (i+1) + " là: " +"%c"+pxgPrice(th[i])+" vnđ", "font-size: 20px;","font-size: 20px; color:#f07bbb");
		}
		console.log("%c=======================NĂM 2020=========================","font-size: 24px; color:#0000FF");
		for(let i = 0; i < 12; i++){
		  //console.log('Tong tien thang ' +i+ ' là: ' + pxgPrice(th[i]));
		  console.log("%cTổng tiền tháng "+ (i+1) + " là: " +"%c"+pxgPrice(th2020[i])+" vnđ", "font-size: 20px;","font-size: 20px; color:#f07bbb");
		}
		console.log("%c=======================NĂM 2019=========================","font-size: 24px; color:#0000FF");
		for(let i = 0; i < 12; i++){
		  //console.log('Tong tien thang ' +i+ ' là: ' + pxgPrice(th[i]));
		  console.log("%cTổng tiền tháng "+ (i+1) + " là: " +"%c"+pxgPrice(th2019[i])+" vnđ", "font-size: 20px;","font-size: 20px; color:#f07bbb");
		}
		menu();
	}
	else
	{
		console.log("%cVui lòng xem báo cáo thống kê trước 👇👇👇", "font-size: 24px; color:#f07bbb");
		menu();
	}
	
}
function xemdanhsachsanpham() {
	var orders = [];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			orders = JSON.parse(this.responseText)['orders'];
			tong += orders.length;
			trangThai = orders.length >= si1;
			orders.forEach(order => {          
				console.log('%cThông tin đơn hàng ' + tong +' :',"font-size: 18px; color:blue" );
				let n9=(order["pay_time"]);				
				var d1 = new Date(n9 * 1000);
				console.log('Thời gian thanh toán: ' + d1 );
				//console.log('Tháng: ' + month + " Năm " + year );
                order["items"].forEach(item => {
                    let t5 = item["amount"];
					let n5 = item["name"];
					let n51 = item["model_name"];
                   
					console.log('Tên sp: ' +  n5);
					console.log('Phân loại: ' + n51);
                });
				
			});	
			offset1 += si1;
			if(trangThai) {
				//console.log('Đợi chút tui đang xử lý...');
				xemdanhsachsanpham();
			}
			else
			{
				menu();
			}
		}
	};
	xhttp.open("GET", "https://shopee.vn/api/v1/orders/?order_type=3&offset="+offset1+"&limit="+si1, true);
	xhttp.send();
}
function menu(){
	console.log("%cHƯỚNG DẪN SỬ DỤNG", "font-size: 20px; color:red");
	console.log("%cXem báo cáo thống kê:		Nhập xemtongchitieu(); ", "font-size: 18px; color:black");
	console.log("%cXem thống kê theo tháng:	Nhập xemthongketheothang(); ", "font-size: 18px; color:black");
	console.log("%cXem danh sách sản phẩm:		Nhập xemdanhsachsanpham(); ", "font-size: 18px; color:black");
}
xemBaoCaoThongKe();

