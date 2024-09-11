// 모달
const Modal = {
    show(name){
        $('.Bmodal').hide();
        $(`.${name}.Bmodal`).show();
    },
    close(){
        $('.Bmodal').hide();
    }
}
// 투어
const tour = {
    tourName:'0',
    tourDay:'0',

    init(){
        $(".canvas").html("");
        $(".canvas1").append('<canvas id="stick" width="800"height="600" style="width:800px; height:450px;"></canvas>');
        $(".canvas2").append('<canvas id="radar" width="600"height="600" style="width:600px; height:600px;"></canvas>');
        
        // 막대그래프를 만든다.
        $.ajax({
            type: "GET",
            url: "./asset/js/rush_hour_visitors.json",
            dataType: "json",
            success: function (response, textStatus, jqXHR) {
                // 명소 이름 버튼을 초기화
                $(".tour .box .name").remove();
                // check로 선택된 몇경 확인
                for(let i = 0; i< 8; i++){
                    if(i == tour.tourName){
                        $(".tour .box").append(`
                        <p class="name name${i} f18 check" onclick="tour.changeName(${i});"><span>${response.landscapes[i].name}</span></p>`);
                    }else{
                        $(".tour .box").append(`
                        <p class="name name${i} f18" onclick="tour.changeName(${i});"><span>${response.landscapes[i].name}</span></p>`);
                    }
                }
                // 받아온 값 확인
                console.log(response);
                // 몇경인지
                console.log(tour.tourName);
                // 무슨 요일인지
                console.log(tour.tourDay);
                // 막대그래프 (on)
                var bar = new Chart(document.getElementById("stick"), {
                    type : 'bar',
                    data : {
                        labels : Object.keys(response.landscapes[`${tour.tourName}`].visitors_per_hour[`${tour.tourDay}`].data),
                        datasets : [ {
                            backgroundColor : [ "#172c68", "#3b65ff",
                                    "#8db9ff", "#b1d2fc", "#ff884d", ],
                            data : Object.values(response.landscapes[`${tour.tourName}`].visitors_per_hour[`${tour.tourDay}`].data),
                        } ]
                    },
                    options : {
                        // title : {
                        //     display : false,
                        // },
                        // responsive:false,
                        plugins:{
                            tooltip: {
                                callbacks:{
                                    label: function(context){
                                        return `${context.label}시에 ${context.raw}명이 방문했습니다.`;
                                    }
                                }
                            },
                            legend:{
                                display:false,
                            },
                        },
                        scales: {
                            y: {
                                ticks: {
                                    min: 0,
                                    stepSize: 100,
                                    // max: Math.max(...values) + 100,
                                    beginAtZero: true,
                                    font:{
                                        size:15
                                    }
                                }
                            },
                            x:{
                                ticks:{
                                    font: {
                                        size: 15,
                                    }
                                }
                            }
                        }
                    },
                });

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.table(jqXHR)
            }
        });
        // 방사형그래프를 만든다.
        $.ajax({
            type: "GET",
            url: "./asset/js/visitors.json",
            dataType: "json",
            success: function (response, textStatus, jqXHR) {
                
                let label = response.data.map(element => element.name);
                let datas = response.data.map(element => element.visitor);
                console.log(label);
                var radar = new Chart(document.getElementById("radar"), {
                    type : 'radar',
                    data : {
                        labels : label,
                        datasets : [ {
                            backgroundColor : "#ff884dc7",
                            data : datas,
                        } ]
                    },
                    options : {
                        title : {
                            display : false,
                        },
                        responsive:false,
                        plugins:{
                            tooltip: {
                                callbacks:{
                                    label: function(context){
                                        return `${context.label} 방문자 수 : ${context.raw}명이 방문했습니다.`;
                                    }
                                }
                            },
                            legend:{
                                display:false,
                            },
                        },
                        scales: {
                            r:{
                                beginAtZero: true,
                                ticks: {
                                    min: 0,
                                    // max: ,
                                    stepSize: 50000,
                                    Color:"black",
                                },
                            },
                        },
                    },
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.table(jqXHR)
            }
        });
    },
    // 이름이 변경된다.
    changeName(idx){
        tour.tourName = idx;
        tour.init();
    },
    // 요일이 변경된다.
    changeWeek(idx){
        $(".week li").removeClass("check");
        $(".week li").eq(idx).addClass("check");
        $(".week .line div").stop().animate({
            "top" : (idx * 14.28571428571429) + "%"
        }, 500);
        tour.tourDay = idx;
        tour.init();
    },
    // 차트변경된다.
    changeChart(idx){
        $(`.canvas1_box`).hide();
        $(`.canvas2`).hide();
        $(`.chart_tab.check`).removeClass("check");
        $(`.chart_tab${idx}`).addClass("check");

        if(idx == 1){
            $(`.canvas1_box`).show();
            $(`.box .name`).show();            
        }else{
            $(`.canvas2`).show();
            $(`.box .name`).hide();            
        }
    }
}
// 물품 구매
const buy = {
    init(){
        $.ajax({
            type: "GET",
            url: "./asset/js/specialties.json",
            dataType: "json",
            success: function (response, textStatus, jqXHR) {
                console.log(response.data);
               let count = 0;
                response.data.forEach(element => {
                    // 처음 아이템
                    $(".buy .items").append(`
                    <div class="cc">
                        <div class="img" style="background:url('./asset/img/명물/${element.image}'); background-size: cover;"></div>
                        <button class="btn" onclick="Modal.show('modal${count}'); buy.nut();"><span>장바구니 담기</span></button>
                        <p class="c1 mt2 f28">${element.name}</p>
                    </div>
                    `);
                    // 모달창의 데이터들
                    if(count != 0){
                        $(".buy").append(`
                        <div class="Bmodal modal${count}" >
                        <div class="box">
                            <div class="fb">
                                <div class="middle">
                                    <h2 class="title3">SPECIALTIES</h2>
                                    <div class="f hc ">
                                        <p class="f21 cp1">${element.name}</p>
                                        <span></span>
                                    </div>
                                </div>
                                    <div>
                                        <button class="btn mt4" onclick="Modal.close();"><span>구매하기</span></button>
                                        <button class="btn mt4" onclick="Modal.close();"><span>닫기</span></button>
                                    </div>
                                </div>
                                <div class="mt4" style="position: relative;">
                                    <p class="mt3 f18" style="margin-left:15px;">포인트 : ${element.point}</p>
                                    <div class="mts" style="box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); padding: 20px; border-radius: 20px;">
                                        ${element.description}
                                    </div>
                                </div>
                            </div>
                        </div>`
                        );
                    } else{
                        $("#point0").text(element.point);
                        $("#text0").text(element.description);
                    }
                    count ++;
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.table(jqXHR)
            }
        });
    },
    // 3D
    nut(){
        // 기본 three.js를 위한 기본 설정 코드
        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(30, 920 / 300);
      
        const renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("#myCanvas"),
        });
        renderer.setSize(920, 300);
        camera.position.z = 100;
        const geometry = new THREE.SphereGeometry(15, 32, 16);
        
        const material = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load("./asset/img/walnut-flat.png"),
            side: THREE.DoubleSide,
        });
      
        const earth = new THREE.Mesh(geometry, material);
        
        scene.add(earth);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 2);
        scene.add(directionalLight);
        scene.background = new THREE.Color("#ffffff");
        // 끌어서 x, y축 2개를 중심으로 이동된다.
        function tick() {
            earth.rotation.y = $('#volume1').val() * 0.064;
            earth.rotation.x = $('#volume2').val() * 0.064;
            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        }
        tick();
    },
}


let commonData = {
    orgData: [],
    bmArr: [],
    labels_kr: null,
    labels_en: null,
    
    load(_callback) {
        commonData.orgData = [];
        $.getJSON('/asset/js/attraction.json', function(a) {
            commonData.labels_kr = [...a.labels_kr];
            commonData.labels_en = [...a.labels_en];

            a.data.forEach(val => {
                var ds = [];
                commonData.labels_en.forEach(e => {
                    ds.push(val[e]);
                });
                var obj = {
                    data: ds,
                    garden: val.name,
                    latitude: val.latitude,
                    longitude: val.longitude,
                };
                commonData.orgData.push(obj);
                if (commonData.bmArr.length > 0) {
                    commonData.bmArr.forEach(c => {
                        if (c.garden == val.name) {
                            c.data = obj.data;
                            c.garden = obj.garden;
                            c.latitude = obj.latitude;
                            c.longitude = obj.longitude;
                        }
                    });
                }
            });
            _callback();
        });
    }
}

let Distance = {
    state: false, // 거리재기 on/off 상태
    canvas: null, // 가상선
    ctx: null, // 가상선
    drawCanvas: null, // 실제 그리는 캔버스
    drawCtx: null, // 실제 그리는 캔버스
    isClick: false, // 거리재기 측정을 시작 했는지 여부
    posArr: [], // 저장된 지점
    moveEvent: null, // 현재 마우스 위치 정보
    init(){
        if(this.state){
            this.end();
        } else{
            $('.popMap #dc').draggable('disable');
            Distance.state = true;
            Distance.setEvent();
        }
    },
    setEvent() {
        // 가상선 캔버스 초기화
        Distance.canvas = $("#dc")[0];
        Distance.canvas.width = $('#dc').width();
        Distance.canvas.height = $('#dc').height();
        Distance.ctx = Distance.canvas.getContext("2d");

        // 실제 그려지는 캔버스 초기화
        Distance.drawCanvas = $("#ddc")[0];
        Distance.drawCanvas.width = $('#ddc').width();
        Distance.drawCanvas.height = $('#ddc').height();
        Distance.drawCtx = Distance.drawCanvas.getContext("2d");

        // 지점 목록 초기화
        Distance.posArr = [];

        $('#dc').on("mouseup", function (e) {
            if (Distance.state) {
                // 마우스 클릭 마다 지점 목록 등록, 목록에 따라 캔버스에 그리기
                Distance.posArr.push({x: e.offsetX, y: e.offsetY});
                Distance.drawPath(); // 지점 목록에 저장된 데이터로 캔버스에 그리기
    
                if (!Distance.isClick) { // 최초 클릭, false
                    Distance.isClick = !Distance.isClick; // true
                }
            }
        });

        $('#dc').on("mousemove", e => {
            if (Distance.isClick) { // 최초 클릭 후 거리재기 시작
                Distance.moveEvent = e; // ESC 기능을 위해서 항상 마우스 위치 저장
                Distance.drawLine(e); // 가상선 그리기
            }
        });

        $('#dc').on("dblclick", e => {
            Distance.posArr.splice(-1, 1); // 더블 클릭 시 지점이 하나 찍히기 때문에 마지막 하나 삭제
            Distance.end(); // 거리재기 종료(총 거리 측정)
        });

        $(window).on("keydown", function(e){
            if(e.keyCode == 8 && Distance.state){
                Distance.posArr.splice(-1, 1);
                Distance.drawPath();
                Distance.drawLine(Distance.moveEvent);
            } else if(e.keyCode == 27  && Distance.state){
                Distance.end();
            } else if(e.keyCode == 32){
                Distance.state = false;
                $('.popMap #dc').draggable('enable');
            }
        });
        $(window).on("keyup", function (e) {
            if(e.keyCode == 32){
                Distance.state = true;
                $('.popMap #dc').draggable('disable');
            }
        });
    },
    drawPath() {
        Distance.drawCtx.clearRect(0, 0, Distance.drawCanvas.width, Distance.drawCanvas.height); // 캔버스 클리어
        Distance.drawCtx.beginPath(); // 캔버스 그리기 시작
        
        for (let i = 0; i < Distance.posArr.length - 1; i++) {
            Distance.drawCtx.moveTo(Distance.posArr[i].x, Distance.posArr[i].y);
            Distance.drawCtx.lineTo(Distance.posArr[i+1].x, Distance.posArr[i+1].y);

            Distance.textBox(
                Distance.posArr[i + 1].x - 30,
                Distance.posArr[i + 1].y - 10,
                60,
                20,
                `${Distance.calculateDistance(Distance.posArr[i], Distance.posArr[i + 1])}km`
            );
        }
        Distance.drawCtx.stroke();
    },
    textBox(boxX, boxY, boxW, boxH, txt) {
        Distance.drawCtx.fillStyle = '#ffffff';
        Distance.drawCtx.fillRect(boxX, boxY, boxW, boxH);
        Distance.drawCtx.strokeStyle = "#000000";
        Distance.drawCtx.lineWidth = 0.5; // 박스 테두리는 0.5
        Distance.drawCtx.strokeRect(boxX, boxY, boxW, boxH);
        Distance.drawCtx.lineWidth = 1; // 다시 1로 지정 안해주면 거리 측정 라인도 얇아짐

        Distance.drawCtx.font = "14px a"; // 폰트는 상관 없으니 그냥 a
        Distance.drawCtx.fillStyle = "#000000";
        if (txt.indexOf('총') != -1) { // 총 거리일 경우 박스 크기가 다르므로 텍스트 위치 차이
            Distance.drawCtx.fillText(txt, boxX + 10, boxY + 15);
        } else {
            Distance.drawCtx.fillText(txt, boxX + 3, boxY + 15); // 측정된 거리 그려주기
        }
    },
    end() {
        // 선언된 이벤트 제거       
        $(window).off('keydown keyup');
        $('#dc').off("mouseup mousemove dblclick");
        $('.popMap #dc').draggable('enable');        
        Distance.state, Distance.isClick = false;
        Distance.ctx.clearRect(0, 0, Distance.canvas.width, Distance.canvas.height);
        Distance.drawPath();
        // 지점 목록에 거리들 다 더해서 총 거리 구하기
        var totKm = 0;
        for (var i = 0; i < Distance.posArr.length - 1; i++) {
            var endPoint = Distance.posArr[i + 1];
            totKm += Number(Distance.calculateDistance(Distance.posArr[i], endPoint));
        }

        Distance.textBox(
            endPoint.x - 60,
            endPoint.y - 30,
            120,
            20,
            `총 거리 ${totKm.toFixed(2)}km`
        );

    },
    drawLine(e) {
        Distance.ctx.clearRect(0, 0, Distance.canvas.width, Distance.canvas.height);
        if (Distance.posArr.length > 0) { // 지점 목록이 하나라도 있을 경우 가상선 표출
            Distance.ctx.beginPath();
            Distance.ctx.moveTo(Distance.posArr[Distance.posArr.length - 1].x, Distance.posArr[Distance.posArr.length - 1].y);
            Distance.ctx.lineTo(e.offsetX, e.offsetY); // 마지막 지점 ~ 현재 마우스 위치 라인 그리기
            Distance.ctx.stroke();
        }
    },
    calculateDistance(startPoint, endPoint) {
        // 마우스 위치 절대값
        var dx = (startPoint.x - endPoint.x) < 0 ? (startPoint.x - endPoint.x) * -1 : (startPoint.x - endPoint.x);
        var dy = (startPoint.y - endPoint.y) < 0 ? (startPoint.y - endPoint.y) * -1 : (startPoint.y - endPoint.y);

        // 마우스 위치에 따른 거리 계산
        var lon = ((indexMap.max[0] - indexMap.min[0]) * (dx / $('#dc').width())) * 10 * 8.9;
        var lat = ((indexMap.max[1] - indexMap.min[1]) * (dy / $('#dc').height())) * 10 * 11;
        
        // X, Y 제곱근 계산
        var pathDis = Math.sqrt((lon * lon) + (lat * lat));
        return pathDis.toFixed(2);
    }
}


const indexMap = {
    min: [126.9741, 36.6208],
    max: [127.4377, 36.9842],
    helper() {
        // 드레그
        $('.popMap #dc').draggable({ // 드래그 기능 활성화
            drag: (e, ui) => {
                // 0이상 떨어져 왼쪽, 위 여백이 생기지 않도록 처리
                if (ui.position.left > 0) ui.position.left = 0;
                if (ui.position.top > 0) ui.position.top = 0;
                // 지도 크기별로 계산하여 오른쪽, 아래에도 여백이 생기지 않도록 처리
                var lDis = Number($('.popMap .draw').width() - $('.popMap .draw').parent().width()) * -1;

                if (ui.position.left < lDis) ui.position.left = lDis;
                if (ui.position.top < lDis) ui.position.top = lDis;

                $('.popMap .poiWrap, .popMap .draw, #ddc').css({
                    left: ui.position.left+"px",
                    top: ui.position.top+"px",
                });
            },
        });

        // 횔
        $(".popMap #dc").on("wheel", function(e){
            if(e.originalEvent.wheelDelta > 0){ // 휠 위로 작동 시
                // 현재 마우스 커서 위치에 따른 지도 위치값 정의
                var pLeft = (e.offsetX - (($(this).position().left) * (indexMap.use - 1))) * -1;
                var pTop = (e.offsetY - (($(this).position().top) * (indexMap.use - 1))) * -1;

                // 다음 단계 지도 크기 계산
                var pScale = $(this).width() + ($(this).parent().width() * indexMap.use);

                // 다음 단계 레벨 지정
                var useNum = indexMap.use + 1;

                // 최대 레벨 지정
                var maxUse = 2;

                indexMap.setMapScale(pLeft, pTop, pScale, useNum, maxUse);
            } else if (e.originalEvent.wheelDelta < 0 && indexMap.use != 1) { // 휠 아래로 작동 시, 현재 지도 레벨이 1일 아닐 경우
                var left = $(this).position().left + ((e.offsetX / 2) * (indexMap.use - 2));
                var top = $(this).position().top + ((e.offsetY / 2) * (indexMap.use - 2));
                left = left <= ($(this).width() / 4 * -1) ? ($(this).width() / 4 * -1) : left;
                top = top <= ($(this).height() / 4 * -1) ? ($(this).width() / 4 * -1) : top;
                left = left > 0 ? 0 : left;
                top = top > 0 ? 0 : top;
                if(indexMap.use == 2){
                    left = 0;
                    top = 0;
                }
                indexMap.setMapScale( 
                    left,
                    top,
                    $(this).width() - ($(this).parent().width() * (indexMap.use - 1)),
                    indexMap.use - 1,
                    3
                );
            }
        });
        // 버튼 클릭
        $('.popMap .box .btns>button').click(function(e) {
            var left;
            var top;
            console.log(left);
            switch($(this).html()){
                case '<span>5km</span>':
                    indexMap.setMapScale(0, 0, $('.popMap .box').width(), 1);
                    break;
                case '<span>3km</span>':
                    if(indexMap.use == 2) return false;
                    if(indexMap.use == 3){
                        left = $(".popMap .draw").position().left + ((($('.popMap .draw').position().left * -1) + 350) / 2);
                        top = $(".popMap .draw").position().top + ((($('.popMap .draw').position().left * -1) + 350) / 2);
                        left = left <= -700 ? -700 : left;
                        top = top <= -700 ? -700 : top;
                        left = left > 0 ? 0 : left;
                        top = top > 0 ? 0 : top;
                    } else{
                        left = -350;
                        top = -350;
                    }
                    indexMap.setMapScale(left, top, 1400, 2);
                break;
                case '<span>500m</span>':
                    if(indexMap.use == 3) return false;
                    if(indexMap.use == 2){
                        left = ((($('.popMap .draw').position().left * -1) + 350) - ($('.popMap .draw').position().left)) * -1;
                        top = ((($('.popMap .draw').position().top * -1) + 350) - ($('.popMap .draw').position().top)) * -1;
                    } else{
                        left = -1050;
                        top = -1050;
                    }
                    indexMap.setMapScale(left, top, 2800, 3);
                break;
            }
        });
        // 포인트 클릭
        $(document).on('click', '.poi', function() {
            $(this).toggleClass('active').css("z-index", "1010").siblings().css("z-index", "1000");
        });
        // 명소 추가하기
        $(document).on('click', '.poi .spread a', function(e) {
            e.preventDefault();

            var idx = $(this).parents('.poi').data('idx');

            var data = commonData.orgData[idx];
                data.idx = idx;
            
            if (commonData.bmArr.find(val => { return val.idx == idx })) {
                alert('이미 추가된 명소입니다.');
            } else {
                commonData.bmArr.push(data);
            }

            indexMap.setBm();
        });
        // 삭제하기
        $(document).on('click', '.right .items li .btn', function (e) {
            e.preventDefault();

            var idx = Number($(this).parents('.item').data('idx'));
            var chk = true;
            commonData.bmArr.forEach((val, key) => {
                if (val.idx == idx && chk) {
                    idx = key;
                    chk = false;
                };
            });

            commonData.bmArr.splice(idx, 1);

            indexMap.setBm();
        });

        indexMap.setPoi(commonData.orgData);
        // 명소 보기
        $('.look').click(function() {
            $(this).toggleClass('active');

            if ($(this).hasClass('active')) {
                $(this).html('<span>전체 보기</span>');
                $('[data-idx]').hide();
                commonData.bmArr.forEach(bm => {
                    $(`[data-idx="${bm.idx}"]`).show();
                })
            } else {
                $(this).html('<span>추가된 명소만 보기</span>');
                $('[data-idx]').show();
            }
        });
    },
    init(){
        indexMap.use = 0;
        indexMap.rd = true;
        
        indexMap.make(1);
        indexMap.helper();
    },
    make(level) {
        indexMap.use = level;
        switch(level) {
            case 1:
                $(".draw").html('<div class="big-box" style="background:url(./asset/img/map/1/1.png) no-repeat center/cover;">');
            break;
            case 2:
                $(".big-box").empty().css({"grid-template-columns": "repeat(2, 1fr)"});
                for (var i = 1; i <= 4; i++) {
                    $(".big-box").append('<div class="small-box" style="background: url(./asset/img/map/2/'+level+'-'+i+'.png) no-repeat center/cover;"></div>');
                }
            break;
            case 3:
                $(".big-box").empty().css({"grid-template-columns": "repeat(4, 1fr)"});
                for (var i = 1; i <= 16; i++) {
                    $(".big-box").append('<div class="x-small-box" style="background: url(./asset/img/map/3/'+level+'-'+i+'.png) no-repeat center/cover;"></div>');
                }
            break;
        }
    },
    setMapScale(_pLeft, _pTop, _pScale, _useNum, _maxUse = 10) {
        if (indexMap.use <= _maxUse && indexMap.rd) {
            var xNum = _useNum > indexMap.use ? 2 * (_useNum - indexMap.use) : 0.5 - (0.25 * ((indexMap.use - _useNum) - 1));
            if (_useNum == indexMap.use) xNum = 1;

            indexMap.rd = false;
            $('.popMap .draw, .popMap .poiWrap, #dc, #ddc').stop().animate({
                "left": (_pLeft) + "px",
                "top": (_pTop) + "px",
                "width": _pScale + "px",
                "height": _pScale + "px",
            }, 500, () => {
                indexMap.make(_useNum);
                indexMap.rd = true;

                if (Distance.canvas != null && Distance.posArr.length > 1) {
                    Distance.drawPath();
                    Distance.end();
                }
            });

            if (Distance.canvas != null) {
                Distance.canvas.width = _pScale;
                Distance.canvas.height = _pScale;
                Distance.drawCanvas.width = _pScale;
                Distance.drawCanvas.height = _pScale;
    
                Distance.ctx = Distance.canvas.getContext("2d");
                Distance.drawCtx = Distance.drawCanvas.getContext("2d");
                
                Distance.posArr.forEach(val => {
                    val.x = val.x * xNum;
                    val.y = val.y * xNum;
                });
            }
        }
    },
    setPoi(_dataArr) {
        $('.poiWrap').empty();

        _dataArr.forEach((val, key) => {
            var left = (val.longitude - indexMap.min[0]) / (indexMap.max[0] - indexMap.min[0]) * 100;
            var top = (val.latitude - indexMap.min[1]) / (indexMap.max[1] - indexMap.min[1]) * 100;

            $('.poiWrap').append(`
                <div class="poi cc" data-idx="${val.idx != undefined ? val.idx : key}" style="left:${left}%; top:${top}%;">
                    <img src="/asset/img/point.png" class="point" alt="">
                    <div class="spread cc">
                        <p>${val.garden == 'user' ? '현위치' : val.garden}</p>
                        ${ val.garden != 'user' ? `<a href="#">즐겨찾기 추가</a>` : ''}
                    </div>
                </div>
            `);
        });
// 변형 문제
        // $('.popMap .poiWrap .poi').draggable({
        //     stop() {
        //         $('.popMap .poiWrap .poi').each(function(key) {
        //             var l = $(this).position().left / $(this).parent().width() * 100;
        //             var t = $(this).position().top / $(this).parent().height() * 100;

        //             $(this).css({"left": `${l}%`, "top": `${t}%`});
        //         });
        //     }
        // });
    },
    setBm() {
        $('.right .items').empty();
        commonData.bmArr.forEach(val => {
            $('.right .items').append(`
                <li class="item f20 fb" data-idx="${val.idx}">
                    <a href="javascript:indexMap.moveCamera('${val.garden}');">${val.garden}</a>
                    <a href="#" class="btn"><span>삭제</span></a>
                </li>`
            );
        });
    },
    moveCamera(_target) {
        if (indexMap.use == 1) return false;
        commonData.orgData.forEach((val, key) => {
            if (_target == val.garden) {
                var tgt = $(`.poi[data-idx="${key}"]`);

                var w = $('.box').width() / 2;
                var h = $('.box').height() / 2;

                $('.draw, .poiWrap, #ddc, #dc').stop().animate({
                    left: `${w - tgt.position().left}px`,
                    top: `${h - tgt.position().top}px`,
                });
            }
        });
    }
}

var chart = {
    labels_kr: ['별점', '리뷰', '방문자', '재방문자', '주차대수', '관리도'],
    labels_en: ['star', 'review', 'visitant', 'returning_visitor', 'parking', 'managed'],
    data: {
        labels: [],
        datasets: [],
    },
    init() {
        chart.ct = new Chart($('#base')[0], {
            type: 'radar',
            data: chart.data,
            options: {
                responsive: false,
                scale: {
                    max: 100,
                    min: 0,
                    ticks: {
                        stepSize: 20,
                    },
                },
            }
        });
    },
    
    // 그래프 세팅
    setChart() {
        $('[toggle]').removeAttr('strike');
        chart.data.labels = chart.labels_kr.slice();
        chart.data.datasets = [];
        commonData.bmArr.forEach(val => {
            chart.data.datasets.push({
                label: val.garden,
                data: [...val.data],
                raw: [...val.data.slice()],
                backgroundColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}, 0.5)`,
                hidden: true
            });
        });

        chart.ct.update();
    },
    toggle(key) {
        const node = $(`[toggle="${key}"]`)[0];
        node.toggleAttribute('strike')
        const nodes = $('[toggle]:not([strike])');
        if (nodes.length < 3) {
            alert('unable to display labels less than 3')
            return node.toggleAttribute('strike')
        }
        chart.data.labels.length = 0
        chart.data.datasets.forEach(ds => ds.data.length = 0)
        Array.from(nodes).map(n => n.getAttribute('toggle')).forEach(l => {
            const index = chart.labels_en.findIndex(e => e == l)
            chart.data.labels.push(chart.labels_kr[index])
            chart.data.datasets.forEach(ds => ds.data.push(ds.raw[index]))
        })
        chart.ct.update();
    },
    // download() {
        // $('body').append('<canvas id="downCan"></canvas>');
        // $('#downCan')[0].width = $('#base')[0].width;
        // $('#downCan')[0].height = $('#base')[0].height;
        // var ctx = $('#downCan')[0].getContext('2d');
        // ctx.fillStyle = 'aliceblue';
        // ctx.fillRect(0, 0, $('#base')[0].width, $('#base')[0].height);
        // ctx.drawImage($('#base')[0], 0, 0);
        // $('#downCan').remove();
        // $('#download')[0].href = $('#base')[0].toDataURL();
    // },
    reload() {
        commonData.load(() => {    
            chart.setChart();
        });
    },
}