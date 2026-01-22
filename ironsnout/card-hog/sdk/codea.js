const bienfunctionIN = function () {

    if (typeof android !== 'undefined') {
        android.hienquangcaongan();
    }
}
var xem_qc_ok;
var xem_qc_no_ok;
var bienfunction = function (e) {
    xem_qc_ok = function () {
        e(true);
    }
    xem_qc_no_ok = function () {
        e(false);
    }
    if (typeof android !== 'undefined') {
        android.hienquangcaolaytien("xem_qc_ok();");
    } else {
        e(true);
    }
}
//////////////////
var adsRewardedDmvF = function (e) {
    bienfunction(e);
}
var laudau =false;
var adsCommercialDmvF = function (e) {
    var keys_check= "ssss";
    var so_phut_hien_1_quang_cao = 1;
    var x = localStorage.getItem(keys_check);
    var tt = -10;
    const d = new Date();
    let a = d.getMinutes();
    if (x !== null) {
        tt = parseInt(x);
    }
    if (Math.abs(a - tt) >= so_phut_hien_1_quang_cao && laudau) {
        bienfunctionIN();
        localStorage.setItem(keys_check, a + "");
    }
    laudau = true;
    e();
}