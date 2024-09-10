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
