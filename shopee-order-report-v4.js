var charged_amount=0;
var final_total=0
var total_order=0;
var total_raw_wo_voucher=0;
var saving_amount=0;
var total_saving=0;
var offset = 0;
var si = 5; 
var trangThaiDonHangConKhong = true;
// Month
let th = new Array(13); for (let i=0; i<13; ++i) th[i] = 0;
// Condition
var checked = false;

function xemBaoCaoThongKe() {
    var xhttp = new XMLHttpRequest();
    // Mark as this func has run
    checked = true;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                if (handleResponse(this.responseText) == 1) {
                    console.log('END script.!!!!!');
                    return;
                }
                offset += si;
                // console.log('Next offset: ' + offset);
                console.log('Đã thống kê được: ' + total_order + ' đơn hàng');
                if(trangThaiDonHangConKhong) {
                    console.log('Đợi chút tui đang xử lý...');
                    xemBaoCaoThongKe();
                }
                else {
                    menu();
                    return;
                    // console.log('Hien thi menu');
                }
            } else {
                console.error('Error: ' + this.status);
            }
        }
    };

    xhttp.onerror = function() {
        console.error('Network error occurred');
    };
    // console.log('Current offset: ' + offset);
    xhttp.open("GET", "https://shopee.vn/api/v4/order/get_order_list?list_type=3&offset="+offset+"&limit="+si, true);
    xhttp.send();
}

function handleResponse(responseText) {
    var data1 = JSON.parse(responseText);
    var orders = data1.data.details_list;
    
    if (!Array.isArray(orders)) {
        console.error('Orders array: ', responseText);
        console.error('Orders array is missing or not an array');
        // Check the type of orders and print it out
        console.log('Type of orders:', typeof orders);
        // Check the length of orders and print it out
        return 1;
    }
    
    if (orders.length === 0) {
        console.log('No orders found in the response');
        return;
    }
    // console.log('Length of orders:', orders.length);
    trangThaiDonHangConKhong = orders.length >= si;

    orders.forEach(order => {
        total_order += orders.length;
        // Perform calculations and data processing here
        // console.log('Order ID:', order["info_card"]["order_id"]);
        var total_amount_at_shop=0;
        var charged_amount_order=0;

        order["info_card"]["order_list_cards"].forEach(shops => {
            // console.log('Shop Name:',shops["shop_info"]["shop_name"]);
            //Tong so shop trong 1 order
            shops["product_info"]['item_groups'].forEach(item_group => {
                //Tong so mon hang trong 1 shop
                item_group["items"].forEach(item => {
                    var amount = item["order_price"]/100000;
                    // console.log('Amount:', pxgPrice(amount));
                    if(amount>0)
                        total_amount_at_shop = total_amount_at_shop + amount;
                });
            });
            // console.log('Total amount at shop:', pxgPrice(total_amount_at_shop));
        });
        // console.log('Total Amount:', pxgPrice(order["info_card"]['subtotal']/100000));
        total_raw_wo_voucher += total_amount_at_shop;
        charged_amount_order = order["info_card"]['final_total']/100000;
        final_total = final_total + charged_amount_order;
        // console.log(' Total:', total_amount_at_shop,", Paid: ",charged_amount_order);
        if (total_amount_at_shop > charged_amount_order) {
            saving_amount = total_amount_at_shop - charged_amount_order;
            total_saving =  total_saving + saving_amount;
            // console.log('Saving at shop: ',pxgPrice(saving_amount));
        } else {
            // console.log('=========> Missmatch <======');
        }

        // sort the amount among months
        var shipping_time = order["shipping"]["tracking_info"]["ctime"];
        var d = new Date(shipping_time * 1000);
        var month = d.getMonth();
        var year = d.getYear();
        // console.log('Tháng: ' + month + " Năm " + year );
        if(year == 124)
        {
            th[month] = th[month] + charged_amount_order;
            //console.log('debug: ' + th[month] );
        }

    });
    
}

function xemthongketheothang(){
	if(checked==true){
		console.log("%c=============THỐNG KÊ TIỀN THEO TỪNG THÁNG==============","font-size: 24px; color:#0000FF");
		console.log("%c=======================NĂM 2024=========================","font-size: 24px; color:#0000FF");
		for(let i = 0; i < 12; i++){
		  //console.log('Tong tien thang ' +i+ ' là: ' + pxgPrice(th[i]));
		  console.log("%cTổng tiền tháng "+ (i+1) + " là: " +"%c"+pxgPrice(th[i])+" vnđ", "font-size: 20px;","font-size: 20px; color:#f07bbb");
		}
		menu();
	}
	else
	{
		console.log("%cVui lòng xem báo cáo thống kê trước 👇👇👇", "font-size: 24px; color:#f07bbb");
		menu();
	}
	
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
	// tongTienHang=tongTienHang-(tongTienDuocGiamMggShopeeShop+tongTienDuocGiamMggShopee);
	// tongTienTietKiem=tongTienDuocGiamMggShopee+tongTienDuocGiamMggShopeeShop+tongTienVanChuyenDuocGiam;
	var tongTienChiTieuX=pxgPrice(final_total);
	console.log("================================");
	console.log("%c"+PXGCert(final_total), "font-size:26px;");
	console.log("%cHết có: "+"%c"+tongTienChiTieuX+" vnđ%c chứ nhiêu hì hì", "font-size: 20px;","font-size: 26px; color:red;font-weigth:700", "font-size: 20px;");
	console.log("================================");
	console.log("%cTổng đơn hàng đã giao: "+"%c"+pxgPrice(total_order)+" đơn hàng", "font-size: 26px;","font-size: 26px; color:green");
	// console.log("%cTổng sản phẩm đã đặt: " + "%c" + pxgPrice(tongSanPhamDaMua)+" sản phẩm", "font-size: 20px;","font-size: 20px; color:#fc0000");
	console.log("%cTổng tiền hàng trước voucher: "+"%c"+pxgPrice(total_raw_wo_voucher)+" vnđ", "font-size: 20px;","font-size: 20px; color:#fc0000");
	// console.log("%cTổng tiền vận chuyển đã trả: "+"%c"+pxgPrice(tongTienVanChuyenPhaiTra)+" vnđ", "font-size: 20px;","font-size: 20px; color:#fc0000");
	console.log("%cTổng tiền hàng sau voucher: "+"%c"+pxgPrice(final_total)+" vnđ", "font-size: 26px;","font-size: 26px; color:#fc0000");
	console.log("================================");
	// console.log("%cTổng tiền thực tế PHẢI trả nếu không dùng các loại MggShopee: "+"%c"+pxgPrice(tongTienChiTieu+tongTienTietKiem)+" vnđ", "font-size: 18px;","font-size: 18px; color:#fc0000");
	// console.log("%cTổng tiền vận chuyển nếu không dùng mã freeship shopee: "+"%c"+pxgPrice(tongTienVanChuyenChuaGiam)+" vnđ", "font-size: 18px;","font-size: 18px; color:#fc0000");
	// console.log("%cTổng tiền vận chuyển tiết kiệm được khi dùng mã freeship shopee: "+"%c"+pxgPrice(tongTienVanChuyenDuocGiam)+" vnđ", "font-size: 18px;","font-size: 18px; color:green");
	// console.log("%cTổng tiền tiết kiệm được khi dùng MggShopee: "+"%c"+pxgPrice(tongTienDuocGiamMggShopee)+" vnđ", "font-size: 18px;","font-size: 18px; color:green");
	// console.log("%cTổng tiền tiết kiệm được khi dùng MggShopee của Shop: "+"%c"+pxgPrice(tongTienDuocGiamMggShopeeShop)+" vnđ", "font-size: 18px;","font-size: 18px; color:green");
	console.log("%cTổng tiền tiết kiệm được: "+"%c"+pxgPrice(total_saving)+" vnđ", "font-size: 18px;","font-size: 18px; color:green");
	console.log("================================");

}

function menu(){
	console.log("%cHƯỚNG DẪN SỬ DỤNG", "font-size: 20px; color:red");
	console.log("%cXem báo cáo thống kê:		Nhập xemtongchitieu(); ", "font-size: 18px; color:black");
	console.log("%cXem thống kê theo tháng:	Nhập xemthongketheothang(); ", "font-size: 18px; color:black");
	// console.log("%cXem danh sách sản phẩm:		Nhập xemdanhsachsanpham(); ", "font-size: 18px; color:black");
}

xemBaoCaoThongKe();
