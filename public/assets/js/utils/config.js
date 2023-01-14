export default{

    ///////////////////////////////////////////////////
    //world 

    worldSize:100,
    //최대 파티클 개수 
    maxParticleCount:20000,
    //처음에 불러오는 폐플라스틱 개수 
    initialMaxPlasticCount:15,
    plasticScale:0.5,
    
    //각 폐플라스틱 사이 간격 
    // plasticOffsetRange:0.13,
    plasticOffsetRange:0.6,

    //흐름(속력+방향)
    velMin: 0.0005,

    ///////////////////////////////////////////////////
    //life 
    lifespan: 120, // 초단위

    //생물체 크기?

    //라이프바 초기 y 위치?? 

    //controls
    lerpSpeed : 0.1,
    ZoomIn_Distance : 3.5, // this.user.mass * config.ZoomIn_Distance => 숫자가 클수록 멀어짐
    ZoomOut_Distance : 1.5,

    ///////////////////////////////////////////////////
    //materials

    particleSize: 0.3,

     ///////////////////////////////////////////////////
    //server
    type:"audience",
    sariraArchiveMax:100,

    worldCameraPositon:[0, 0, -200],

    //sound
    sizeMax:4,
    maxParticleEaten: 100,
}
