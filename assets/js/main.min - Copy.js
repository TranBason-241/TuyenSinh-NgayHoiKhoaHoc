var _w = $(window).width();
var _h = $(window).height();
_heightBody = $('body').height();
var _clicked = 0,
    _data = {},
    _info = {};
var ggAPI = 'https://script.google.com/macros/s/AKfycbw6vOZgfeM8xAe66fLTDoKodi4qAkDKFKaOWWF-TzAYS4BbMKTUaGVUnGxKhNUxMEvX/exec';
var _linkSheet = 'https://docs.google.com/spreadsheets/d/1FdIJTsqet20nYGTyWeyKN1Igzh4JPzME3j5mKooG0M0/edit#gid=0';
var orig_aid = ''
var fosp_aid = ''


$(document).ready(function () {

    if(getCookie('orig_aid') === undefined || getCookie('orig_aid')==''){
        orig_aid = ''
    }else{
        orig_aid = getCookie('orig_aid')
    }

    if(getCookie('fosp_aid') === undefined || getCookie('fosp_aid')==''){
        fosp_aid = ''
    }else{
        fosp_aid = getCookie('fosp_aid')
    }
    _data['orig_aid'] = orig_aid;
    _data['fosp_aid'] = fosp_aid;

    var _isMobile = (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera);

    var _hash = window.location.hash;
    var uri_dec = decodeURIComponent(_hash);
    var _valHash = uri_dec.replace('#ans=','');
    var _valAarry = _valHash.split('&');
    var tmp =$('input[name="qes4"]');

    for (let i = 1; i <= tmp.length; i++) {
        if(_valAarry.includes(i.toString())){
            $('#qes4-'+i).trigger('click');
        }
    }
    
    if(_isMobile){
        $('html').addClass('mobile');
    }else{
        $('html').addClass('pc');
        if(_heightBody<_h){
            $('html').addClass('bodyS');
        }
    }

    $('body').imagesStatus({
        allImgFinished:function(container) {
            AOS.init();
        }
    });

    $(".f-number").keypress(function(e){
        if(8!=e.which&&0!=e.which&&(e.which<48||57<e.which)){
            return!1
        }
    });

    $('.disable-paste').on("cut copy paste",function(e) {
        e.preventDefault();
    });

    $('body').click(function(e){
        if (!$(e.target).is('.opt-custom , .opt-custom *')) {
            $('.opt-custom__list').removeClass('show');
        }
    });

    $('[data-toggle="dropdown"]').click(function(){
        var check = $(this).next().hasClass('show');
        $('.opt-custom__list').removeClass('show');
        $(this).next().toggleClass('show');

        if(check){
            $(this).next().removeClass('show');
        }
    })


    //select option custom
    $('.opt-custom__list li').click(function(){
        var _tmp_data = '';
        var _c = $(this).attr('class');
        var _p = $(this).parents('.item');
        $('#qes2__other').val('');
        $('#qes2').prop('checked', false);
            
        if(_c===undefined){

            var _v = $(this).text();
            var _g = $(this).parents('.opt-custom');
            _g.find('.opt-custom__value p').text(_v);
            _g.find('.opt-custom__value p').addClass('done');
            $('[data-toggle="dropdown"]').click();
            _tmp_data = _v;
            _data[_p.attr('id')] = _tmp_data;
            _g.find('.ipt-slt').val('');
            $('.opt-custom__list').removeClass('show');

            if(_data[_p.attr('id')] != ''){
                $('div[id="'+_p.attr('id')+'"]').addClass('as-done')
                //$('#'+_p.attr('id')).addClass('as-done')
            }else{
                $('div[id="'+_p.attr('id')+'"]').removeClass('as-done')
                //$('#'+_p.attr('id')).removeClass('as-done')
            }
        }     
    });


    // other keyup+ blur prop checked and check Required
    $('.ip-other__value').keyup(function(){
        if($(this).val()){
            $(this).parents('.ip-custom').find($('input')).prop('checked',true);
            $(this).parents('.ip-custom').find($('input:not([type="text"])')).attr('value',$(this).val());
        }else{
            $(this).parents('.ip-custom').find($('input')).prop('checked',false);
            $(this).parents('.ip-custom').find($('input:not([type="text"])')).attr('value','');
        }
    })

    $('.ip-other__value').blur(function(){
        var _n = $(this).attr('name');
        var _p = $(this).parents('.item');

        if($(this).val()){
            $(this).parents('.ip-custom').find($('input')).prop('checked',true);
        }else{
            $(this).parents('.ip-custom').find($('input')).prop('checked',false);
        }
    })

    $('.form-control').on('keyup',function(){
        if($(this).val()){
            $(this).next().addClass('d-none');
        }else{
            $(this).next().removeClass('d-none');
        }
    })

    // send
    $('.btn-send').on('click', function() {
        var _current = parseInt($('.survey-inner__buttons').attr('data-current'));
            
        var _item = $('#listQuestion-'+_current+' .item:not(.hide)').length;
        var _req = $('#listQuestion-'+_current+' .as-done:not(.hide)').length;

        $.each($('.survey-inner__content .as-done'),function(index){
            $(this).find('.required').removeClass('show');
        });

        if(_item==_req){
            if (_clicked == 0) {
                var emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;

                if (!emailRegex.test(_data['Email'])) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Email không đúng định dạng',
                        confirmButtonText: 'Đóng'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $('#qes12').focus();
                        }
                    });
                    return false;
                }

                _clicked = 1;
                _data = $.extend({}, _data);
                sendForm(_data);
            }
        }else{
            $.each($('#listQuestion-'+_current+' .item:not(.as-done)'),function(index,ele){
                if(index==0){
                    var _textQuestion = $(ele).data('question');

                    Swal.fire({
                        icon: 'error',
                        text: _textQuestion,
                    }).then((result) => {
                        $(ele).find('.required').addClass('show');
                        var r = $("html, body");
                        r.animate({
                            scrollTop: $(ele).offset().top - 55
                        },'slow');
                    })
                }
            });  
        }
    });

    
});

function handleChangeInputv2(e){
    var _tmp_data = '';
    var _n = $(e).attr('name');
    var _p = $(e).parents('.item');

    var _v = $('input[name='+_n+']:checked').val();
    if(_data[_p.attr('id')]===undefined){
        _tmp_data = _v;
        _data[_p.attr('id')] = _tmp_data;
    }else{
        let _txt = _data[_p.attr('id')];
            
        if(_v=='CÓ NGHE NHƯNG KHÔNG NẮM RÕ'){
            _txt = _txt.replace('ĐÃ NẮM RÕ', _v);
        }else{
            _txt = _txt.replace('CÓ NGHE NHƯNG KHÔNG NẮM RÕ', _v);
        }
        _data[_p.attr('id')] = _txt
    }

    if(_data[_p.attr('id')] != ''){
        $('div[id="'+_p.attr('id')+'"]').addClass('as-done')
        $('div[id="'+_p.attr('id')+'"]').parents('.card').addClass('as-done')
        //$('#'+_p.attr('id')).addClass('as-done')
    }else{
        if(!$('div[id="'+_p.attr('id')+'"]').hasClass('done')){
            $('div[id="'+_p.attr('id')+'"]').removeClass('as-done')
            $('div[id="'+_p.attr('id')+'"]').parents('.card').removeClass('as-done')
        }
        //$('#'+_p.attr('id')).removeClass('as-done')
    }
}


function handleChangeInput(e){
    var _tmp_data = '';
    var _t = $(e).attr('type');
    var _n = $(e).attr('name');
    var _p = $(e).parents('.item');
        
    if(_t=="radio"){
        var _v = $('input[name='+_n+']:checked').val();
        checkDone(_v,_p);
            
        _tmp_data = _v;
    }else if(_t=="text"){
        var _other = $(e).hasClass('other');
        if(_other){

             $.each($('input[name='+_n+']:checked'),function(index){
                var _v = $(this).val();
                _v = _v.replace(/\s{2,}/g,' ');
                _v = '- '+ _v;
                if (index == 0) {
                    _tmp_data += _v;
                } else {
                    _tmp_data += "\n" + _v;
                }
            });
        }else{
            var _v = $(e).val();
            _tmp_data = _v.trim();
        }
    }else if(_t=='checkbox'){
        $.each($('input[name='+_n+']:checked'),function(index){
            var _v = $(this).val();
            if(_v){
                _v = _v.replace(/\s{2,}/g,' ');
                _v = '- '+ _v;
            }
            
            if (index == 0) {
                _tmp_data += _v;
            } else {
                _tmp_data += "\n" + _v;
            }
        });
    }else{
        var _other = $(e).hasClass('other');
        if(_other){
             $.each($('input[name='+_n+']:checked'),function(index){
                var _v = $(this).val();
                _v = _v.replace(/\s{2,}/g,' ');
                _v = '- '+ _v;
                if (index == 0) {
                    _tmp_data += _v;
                } else {
                    _tmp_data += "\n" + _v;
                }
            });
        }else{
            var _v = $(e).val();
            _tmp_data = _v.trim();
        }
    }

    _data[_p.attr('id')] = _tmp_data;
    console.log(_data);
        
        
    if(_data[_p.attr('id')] != ''){
        $('div[id="'+_p.attr('id')+'"]').addClass('as-done')
        $('div[id="'+_p.attr('id')+'"]').parents('.card').addClass('as-done')
        //$('#'+_p.attr('id')).addClass('as-done')
    }else{
        if(!$('div[id="'+_p.attr('id')+'"]').hasClass('done')){
            $('div[id="'+_p.attr('id')+'"]').removeClass('as-done')
            $('div[id="'+_p.attr('id')+'"]').parents('.card').removeClass('as-done')
        }
        //$('#'+_p.attr('id')).removeClass('as-done')
    }
}

function checkDone(_v,_p){
    if(_v){
        _p.addClass('as-done');
    }else{
        _p.removeClass('as-done');
    }
}

// start change text select option of input text
function handleChangeDrop(e){
    var _tmp_data = '';
    var _n = $(e).attr('name');
    var _p = $(e).parents('.item');

    var _v = $(e).val();
    _tmp_data = _v.trim();

    _data[_p.attr('id')] = _tmp_data;
}

function changeText(e){
    var _v = $(e).val();
    var _p = $(e).parents('.item');
    var _g = $(e).parents('.opt-custom');
    _g.find('.opt-custom__value p').text(_v);
    checkDone(_v,_p)
}
// end change text select option of input text

function emptySelectCountry(){
    $('.opt-custom__value p').text('');
}   

function sendForm(_data) {
    $('.btn-send .loader').addClass('show');
    var name = _data['Họ và tên người đại diện'];
    var phone = _data['Số điện thoại'];
    var email = _data['Email'];

    $.ajax({
        url: ggAPI,
        type: "post",
        data: $.param(_data),
        success: function (data) {
            if (data.result == 'success') {
                $('.btn-send .loader').removeClass('show');
                trackingFormBanner(name,phone,email);
                window.dataLayer = window.dataLayer || [];
                dataLayer.push({
                    "event": "voteEvent",
                    "vote_category": "survey_usaid_20220608",
                    "vote_action": "survey_usaid_20220608"
                })
                Swal.fire({
                    icon: 'success',
                    title: 'Cảm ơn bạn đã tham gia khảo sát!',
                    html: 'Khoá học Nâng cao năng lực quản lý của các cơ sở dịch vụ ăn uống vừa và nhỏ ở Việt Nam nhằm trang bị cho các chủ và quản lý kỹ năng tối ưu hóa nhân sự, giảm chi phí lao động dư thừa, giảm thiểu lãng phí trong chi phí nguyên liệu đầu vào… Chương trình đào tạo online diễn ra một lần một tuần, kéo dài trong 6 tuần. Học viên sẽ được cấp chứng chỉ tham gia khóa học từ Đại học Duke và Đại học Kinh tế Quốc dân.',
                    confirmButtonText: 'Quay lại VnExpress'
                }).then((result) => {
                    if (result.isConfirmed) {
                        document.getElementById('survey-form').reset();
                        window.location.href = "https://vnexpress.net/";
                    }
                })
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Gửi không thành công!',
                    text: 'Vui lòng trả lời đầy đủ câu hỏi!',
                })
            }
        }
    });
}

function trackingFormBanner(name,phone,email) {
    
    var logForm = window._logForm || (window._logForm = []);
    logForm.push({
        "campaign_name": "survey_usaid_20220608",//name của ca
        "engagement_type": "1003",
        "source_name":"Vnexpress",// Hệ thống tự push vào
        "source_type": "internal",
        "index_brand": "survey_usaid_20220608",
        "index_industrial": "",
        "index_category":"",
        "index_topic":"",
         
        //Nhập thông tin của audience
        "name": name,// nhập tên audience (option)
        "phone":phone,
        "gender":"",
        "age":"",
        "birth_day":"",
        "age_range":"",// (Optional): 18-24/ 25-34/ 35-44/ 45-54/ 55-64/ 65+. VD: 25-34
        "email":email
    })
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function onNext(e){
    var _current = parseInt($(e).parent().attr('data-current'));
    var _prevID = _current - 1;
    var _nextID = _current + 1;
    var r = $("html, body");

    checkRequired(_current);

    $.each($('#listQuestion-'+_current+' .as-done'),function(index){
        $(this).find('.required').removeClass('show');
    });

    if(_data['question_5']=="Mất việc"){
        $('.no').removeClass('show');
        $('.yes').addClass('show');
    }

    if(_data['question_5']=="Đang có việc làm"){
        $('.yes').removeClass('show');
        $('.no').addClass('show');
    }


    if(_current==1){
        var _item = $('#listQuestion-'+_current+' .item:not(.hide)').length;
        var _req = $('#listQuestion-'+_current+' .as-done:not(.hide)').length;
    }else{
        var _item = $('#listQuestion-'+_current+' .show .item:not(.hide)').length;
        var _req = $('#listQuestion-'+_current+' .show .as-done:not(.hide)').length;
    }

    if(_item==_req){
        var emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;

        if (!emailRegex.test(_data['question_5a-6']) && $('.yes').hasClass('show') && _current==2) {
            Swal.fire({
                icon: 'error',
                title: 'Email không đúng định dạng',
                confirmButtonText: 'Đóng'
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#qes5-6').focus();
                }
            });
            return false;
        }else if(!emailRegex.test(_data['question_5b-4']) && $('.no').hasClass('show') && _current==2){
            Swal.fire({
                icon: 'error',
                title: 'Email không đúng định dạng',
                confirmButtonText: 'Đóng'
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#qes5b-4').focus();
                }
            });
        }else{
            r.animate({
                scrollTop: 0,
            },'slow');

            setTimeout(function(){
                $(e).parent().attr('data-current',_nextID); 
                $('.section-step').removeClass('show');
                $('#listQuestion-'+_nextID).addClass('show');
                $('.tt-btn--prev').addClass('show');
                if($('.tt-btn--next').hasClass('plus')){
                    
                    if(_current==3){
                        $('.tt-btn--next').removeClass('show');
                        $('.btn-send').addClass('show');
                    }
                }else{
                    if(_current==2){
                        $('.tt-btn--next').removeClass('show');
                        $('.btn-send').addClass('show');
                    }
                }
            },500)
        }
    }else{
        if(_current==1){
            $.each($('#listQuestion-'+_current+' .item:not(.as-done)'),function(index,ele){
                if(index==0){
                    var _textQuestion = $(ele).data('question');

                    Swal.fire({
                        icon: 'error',
                        text: _textQuestion,
                    }).then((result) => {
                        $(ele).find('.required').addClass('show');
                        var r = $("html, body");
                        r.animate({
                            scrollTop: $(ele).offset().top - 55
                        },'slow');
                    })
                }
            });
        }else{
            $.each($('#listQuestion-'+_current+' .show .item:not(.as-done)'),function(index,ele){
                if(index==0){
                    var _textQuestion = $(ele).data('question');

                    Swal.fire({
                        icon: 'error',
                        text: _textQuestion,
                    }).then((result) => {
                        $(ele).find('.required').addClass('show');
                        var r = $("html, body");
                        r.animate({
                            scrollTop: $(ele).offset().top - 55
                        },'slow');
                    })
                }
            });  
        }
    }
}

function onPrev(e){
    var _current = parseInt($(e).parent().attr('data-current'));
    var _prevID = _current - 1;
    var _nextID = _current + 1;
    $(e).parent().attr('data-current',_prevID); 

    var r = $("html, body");
    r.animate({
        scrollTop: 0,
    },'slow');

    setTimeout(function(){
        $('.section-step').removeClass('show');
        $('#listQuestion-'+_prevID).addClass('show');
        if(_current==2){
            $('.tt-btn--prev').removeClass('show');
        }else if(_current<=4){
            $('.btn-send').removeClass('show');
            $('.tt-btn--next').addClass('show');
        }else{
            $('.tt-btn--prev').addClass('show');
        }
    },500)
}

function checkRequired(currentPage){
    let _numItem = $('#listQuestion-'+currentPage+'.show .card:not(.hide)').length;
    let _numReq = $('#listQuestion-'+currentPage+' .show .as-done:not(.hide)').length;

    if(_numItem==_numReq){
        console.log('true')
    }else{
        console.log(false)
    }
}