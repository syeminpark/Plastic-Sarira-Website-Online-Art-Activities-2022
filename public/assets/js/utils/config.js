export default{

    ///////////////////////////////////////////////////
    //world 

    worldSize:100,
    //최대 파티클 개수 
    maxParticleCount:15000,
    //처음에 불러오는 폐플라스틱 개수 
    initialMaxPlasticCount:10,
    plasticScale:0.3,
    
    //각 폐플라스틱 사이 간격 
    // plasticOffsetRange:0.13,
    plasticOffsetRange:0.6,

    //흐름(속력+방향)
    velMin: 0.001,

    ///////////////////////////////////////////////////
    //life 
    lifespan: 250,

    //생물체 크기?

    //라이프바 초기 y 위치?? 

    //controls
    lerpSpeed : 0.03,

    ///////////////////////////////////////////////////
    //materials

    particleSize: 0.3,

     ///////////////////////////////////////////////////
    //server
    type:"audience",
    sariraArchiveMax:300,

    worldCameraPositon:[0, 0, -200]
}


//베타 때 파라미터 수치 
/*
export default{

    ///////////////////////////////////////////////////
    //world 

    worldSize:300,
    //최대 파티클 개수 
    maxParticleCount:15000,
    //처음에 불러오는 폐플라스틱 개수 
    initialMaxPlasticCount:10,
    plasticScale:0.3,
    //각 폐플라스틱 사이 간격 
    plasticOffsetRange:0.15,
    //흐름(속력+방향)

    velMin: 0.001,

    ///////////////////////////////////////////////////
    //life 

    lifespan:700,

    //생물체 크기?

    //라이프바 초기 y 위치?? 


    //controls
    lerpSpeed : 0.03,

    ///////////////////////////////////////////////////
    //materials

    particleSize: 0.3,

     ///////////////////////////////////////////////////
    //server
       type:"audience",
    sariraArchiveMax:300

}
*/