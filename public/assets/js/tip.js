export default function changeTip(page){
    if (page =="home") {
        $('tip-KR').text("TIP: 화면을 드래그하면, 3D 모델이 회전합니다")
        $('tip-KEN').text("TIP: Drag the screen to rotate the view")	
    }
    else if (page=="about") {
        
        $('#tip-KR').text("TIP: 화면 좌측의 소리 버튼을 클릭해보세요")
        $('#tip-EN').text("TIP: Try clicking on the sound button")
    }
    else if (page =="research") {

        document.getElementById('tip-KR').innerHTML="	TIP: 해변목록 / 해변명을 클릭하여 새로운 이미지들을 확인해보세요"
        document.getElementById('tip-EN').innerHTML="	TIP: Click each name from the beach list to see new data"
    }
    else if (page =="world") {

        document.getElementById('tip-KR').innerHTML="	TIP: 각 참여자들이 만든 플라스틱 사리를 모아놓은 페이지입니다"
        document.getElementById('tip-EN').innerHTML="	TIP: This page shows the plastic sarira of every participant"
    }
    else if ([page] =="sarira") {

        document.getElementById('tip-KR').innerHTML="	TIP: 주어진 시간(초록 라이프바)이 끝날 때까지 생태계 안에서 자유롭게 움직여보세요"
        document.getElementById('tip-EN').innerHTML="	TIP: Explore this world within your given time, indicated by the green lifebar"
    }
}