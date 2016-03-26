var W,H;
var ctx,canvas,audioCtx,decor,canvasFond;
var source;
var pas = 10;
var perso = {"x":500,"y":500,"vx":0,"vy":pas,"r":0};
var imgShout = new Image();
imgShout.src = "images/shout.png";
var imgHalo = new Image();
imgHalo.src = "images/halo.png";
var imgQuest = new Image();
imgQuest.src = "images/q1.png";
var buffer,dataArray,bufferGo;
var firstTime = 90100;
var minDecible = 0;
var maxDecible = 10;
var a,b;
var nCiel = 7;
var imgCiel = [];
var objCiel = [];
var nPerso = 18;
var imgPerso = [];
var objPerso = [];
var nThink = 9;
var imgObj = [];
var nObj = 5;
var nRapace = 6;
var imgRapace = new Image();
var imgDanger = [];
var nDanger = 3;
var imgThink = [];
var objThink = [];
var nGrumph = 6;
var imgGrumph = [];
var nExpr = 6;
var imgExpr = [];
var time;
var n = 90099;
var frame;
var actions = ["move","wait","hide","jump","thinking","ET","superJump","move","wait","wait","wait","move","wait","rotate","change","shout","move","wait","wait","wait","thinking","thinking","monologue"];
var comps = ["normal","stupide","peureux","colérique","mou","hysterique"];
var n2 = 100;
var heros = {};

//donnee

var fond;

// programme

function rnd(max){
    return Math.floor(Math.floor(Math.random()*max));
}

function resize(){
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.setAttribute("width",W);
    canvas.setAttribute("height",H);
    canvasFond.setAttribute("width",W);
    canvasFond.setAttribute("height",H);
}

function aleatoire(n,max){
    n = Math.abs(n * 10000);
    return Math.round(((n-minDecible) / (maxDecible - minDecible) * max)%max);
}

function getData() {
    source = audioCtx.createBufferSource();
//    var request = new XMLHttpRequest();

//    request.open('GET', 'musiques/D.mp3', true);

//    request.responseType = 'arraybuffer';

    var input = document.getElementById("input");
    
    input.addEventListener('change', function(evt) {
        canvas.style.display = "block";
        canvasFond.style.display = "block";
        var files = evt.target.files;
        var file = files[0];
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
    
        reader.onload = function() {
            console.log(reader);
            var audioData = reader.result;
            audioCtx.decodeAudioData(audioData, function(buffer) {
                source.buffer = buffer;
                source.connect(audioCtx.destination);
                source.start();
                dataArray = buffer.getChannelData(0);
                frame = dataArray.length / buffer.length;
                animation();
            },

                                     function(e){console.log("Error with decoding audio data" + e.err);});

        };
    }); 

//        request.send();
}

function start(){
    canvas = document.querySelector("#canvas");
    canvas.style.display = "none";
    ctx = canvas.getContext("2d");
    canvasFond = document.querySelector("#fond");
    canvasFond.style.display = "none";
    decor = canvasFond.getContext("2d");
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    bufferGo = audioCtx.createBuffer(2, 22050, 44100);
    W = canvas.width;
    H = canvas.height;
    resize();
    dataArray = new Float32Array;
    for (var i = 1;i <= nPerso; i++){
        imgPerso.push(new Image);
        imgPerso[i-1].src = "images/p" + i + ".png";
    }
    for (var i = 1;i <= nCiel; i++){
        imgCiel.push(new Image);
        imgCiel[i-1].src = "images/" + i + ".png";
    }
    for (var i = 1;i <= nThink; i++){
        imgThink.push(new Image);
        imgThink[i-1].src = "images/t" + i + ".png";
    }
    for (var i = 1;i <= nGrumph; i++){
        imgGrumph.push(new Image);
        imgGrumph[i-1].src = "images/grumph" + i + ".png";
    }
    for (var i = 1;i <= nExpr; i++){
        imgExpr.push(new Image);
        imgExpr[i-1].src = "images/e" + i + ".png";
    }
   for (var i = 1;i <= nObj; i++){
        imgObj.push(new Image);
        imgObj[i-1].src = "images/o" + i + ".png";
    }
   for (var i = 1;i <= nDanger; i++){
        imgDanger.push(new Image);
        imgDanger[i-1].src = "images/d" + i + ".png";
    }
    getData();
}

function animation(){
    var f = function(t) {
        draw();
        window.requestAnimationFrame(f);
    };
    window.requestAnimationFrame(f);
}

function draw() {
    n += 1;

    if (firstTime + 1 == n){
        imgRapace.src = "images/r" + aleatoire(dataArray[n*frame+1],nRapace - 1) + ".png";
        decor.fillStyle = fond;
        decor.fillRect(0, 0, W, H);
        decor.globalAlpha = 0.7;
        objCiel.forEach(
            function(c) {
                decor.drawImage(c.img,c.x,c.y);
            }
        );
	if (aleatoire(dataArray[n*frame],20) == 2) grotte();
        else if (aleatoire(dataArray[n*frame],20) == 1) montagne();
        else biome();
    }
    else if (firstTime == n){
        fond = "rgb(" + aleatoire(dataArray[n*frame],150) + "," + aleatoire(dataArray[n*frame+59],180) + "," + aleatoire(dataArray[n*frame+90],200) + ")";
        for(var i = 0;i < 5;i++){
            objCiel.push({"img":imgCiel[aleatoire(dataArray[n*frame+i*10],nCiel-1)],"x":aleatoire(dataArray[n*frame+i*10 + 109],W),"y":aleatoire(dataArray[n*frame+i*10 + 80],H/3)});
        }
    }
    else if (firstTime + 50 == n){
        for(var i = 0;i < aleatoire(dataArray[n*frame],3) + 2;i++){
            objPerso.push({"img":imgPerso[aleatoire(dataArray[n*frame+i*10],nPerso-1)],"x":aleatoire(dataArray[n*frame+i*10 + 109],W/2-100)*2,"y":H - 200,"goal":aleatoire(dataArray[n*frame+i*10 + 88],W/2)*2,"action":"choix","n":100,"pensee":imgThink[aleatoire(dataArray[n*frame+i],nThink-1)],"r":0,"scale":0.6,"comportement":comps[aleatoire(dataArray[n*frame+i*10 + 88],comps.length-1)],"expr":imgExpr[aleatoire(dataArray[n*frame+i],nExpr - 1)]});
        }
        objPerso.push({"img":imgPerso[aleatoire(dataArray[n*frame+9],nPerso-1)],"x":aleatoire(dataArray[n*frame+9 + 109],W/2-100)*2,"y":H - 200,"goal":aleatoire(dataArray[n*frame+9 + 88],W/2)*2,"action":"choix","n":100,"n2":0,"pensee":imgThink[aleatoire(dataArray[n*frame+9],nThink-1)],"r":0,"scale":1,"comportement":"heros","expr":imgExpr[aleatoire(dataArray[n*frame+1],nExpr - 1)],"obj":imgObj[aleatoire(dataArray[n*frame+1],nObj - 1)],"danger":imgDanger[aleatoire(dataArray[n*frame+11],nDanger - 1)]});
    }

    else if (firstTime + 61 <= n){
        ctx.clearRect(0,0,W,H);
        objPerso.forEach(
            function(c,index) {
                if (c.comportement == "colérique"){
                    if (c.action == "hide" | c.action == "ET") c.action = "shout";
                    else if (c.action == "rotate") c.action = "superJump";
                    else if (c.action == "change") c.action = "shout";
                    else if (c.action == "move" | c.action == "run" | c.action == "fall") c.action = "jump";
                }
                else if (c.comportement == "stupide"){
                    if (c.action == "hide" | c.action == "wait") c.action = "jump";
                    else if (c.action == "change") c.action = "rotate";
                    else if (c.action == "shout" | c.action == "superJump") c.action = "thinking";
                }
                else if (c.comportement == "peureux" && c.action != "hide" && c.action != "rapace" && c.action != "superFall"){
                    var moyenne = 0;
                    var nMoyenne = 0;
                    objPerso.forEach(
                        function(d,indexB) {
                            if (d.comportement != "peureux"){
                                if (d.action == "choix" | d.action == "move" | d.action == "thinking" | d.action == "wait" | d.action == "change" | d.action == "rotate" | d.action == "jump" | d.action == "superJump") {
                                    nMoyenne += 1;
                                    moyenne += d.x;
                                }
                            }
                        }
                    );
                    moyenne = moyenne / nMoyenne;
                    if (Math.abs(moyenne - c.x) < 100) {c.action = "hide";c.n = 100;c.scale = 0.6;c.rotate = 0;}
                    else if (moyenne > c.x) c.goal = 0;
                    else c.goal = W - 200;
                    if (c.action == "move") c.action = "run";
                    else if (c.action == "wait"| c.action == "superjump" | c.action == "rotate" | c.action == "ET") c.action = "run";
                    else if (c.action == "change") c.action = "shiver";
                }
                else if (c.comportement == "heros"){
                    c.scale = 1;
                    if (c.action == "hide") c.action = "thinking";
                    else if (c.action == "ET") c.action = "objet";
                    else if (c.action == "change") c.action = "objet";
                    else if (c.action == "rotate") c.action = "danger";
                    else if (c.action == "jump") c.action = "quest";
                    else if (c.action == "fall") c.action = "choix";

                }
                if (c.action == "choix") choix(c,index);
                else if (c.action == "move") move(c,index);
                else if (c.action == "wait") wait(c,index);
                else if (c.action == "hide") hide(c,index);
                else if (c.action == "jump") jump(c,index);
                else if (c.action == "thinking") think(c,index);
                else if (c.action == "ET") extraterrestre(c,index);
                else if (c.action == "superJump") superJump(c,index);
                else if (c.action == "fall") fall(c,index);
                else if (c.action == "superFall") fall(c,index);
                else if (c.action == "climb") climb(c,index);
                else if (c.action == "rotate") rotate(c,index);
                else if (c.action == "change") change(c,index);
                else if (c.action == "shout") shout(c,index);
                else if (c.action == "run") run(c,index);
                else if (c.action == "shiver") shiver(c,index);
                else if (c.action == "monologue") monologue(c,index);
                else if (c.action == "listen") listen(c,index);
                else if (c.action == "objet" && c.n > 50) objet(c,index);
                else if (c.action == "throw") throwing(c,index);
                else if (c.action == "danger") danger(c,index);
                else if (c.action == "quest") quest(c,index);
                else if (c.action == "rapace") rapace(c,index);
                ctx.save();
                ctx.translate(c.x + 100,c.y + 100);
                if (c.comportement == "heros") ctx.scale(c.scale,1);
                else ctx.scale(c.scale,0.6);
                ctx.rotate(c.r);
                ctx.drawImage(c.img,-100,-100);
                ctx.restore();
                if (c.action == "objet" && c.n <= 50) objet(c,index);
            }
        );
    }
}


// FONCTIONS RELATIVES AUX PERSONNAGES

// n est une variable toujours remise à 100 après utilisation

function choix(e,i){
    e.n = 100;
    if (e.comportement == "stupide"){
        e.n = 100;
        e.y -= e.n / 10;
        e.n -= 10;
        while(e.y >= H - 200){
            e.y -= e.n / 10;
            e.n -= 10;
        }
        e.y = H - 200;
        e.n = 100;
    }
    e.action = actions[aleatoire(dataArray[n*frame+i*10 + 88],actions.length-1)];
    if (i == 0 && (e.action == "ET" | e.action == "hide")) e.action = "choix";
}

function move(e,i){
    if (e.comportement == "mou"){
        if (e.x > e.goal) e.x -= 1;
        else if (e.x < e.goal) e.x += 1;
    }
    else if (e.comportement == "hysterique"){
        if (e.x > e.goal) e.x -= 3;
        else if (e.x < e.goal) e.x += 3;
    }
    else {
        if (e.x > e.goal) e.x -= 2;
        else if (e.x < e.goal) e.x += 2;
    }
    if (Math.abs(e.x - e.goal) < 2) {
        e.goal = aleatoire(dataArray[n*frame + i * 10],W/2-100)*2;
        e.action = "choix";
        e.n = 100;
    }
}

function run(e,i){
    if (e.comportement == "mou"){
        if (e.x > e.goal) e.x -= 3;
        else if (e.x < e.goal) e.x += 3;
    }
    else if (e.comportement == "hysterique"){
        if (e.x > e.goal) e.x -= 10;
        else if (e.x < e.goal) e.x += 10;
    }
    else {
        if (e.x > e.goal) e.x -= 6;
        else if (e.x < e.goal) e.x += 6;
    }
    if (Math.abs(e.x - e.goal) < 10) {
        e.goal = aleatoire(dataArray[n*frame + i * 10],W/2-100)*2;
        e.action = "hide";
        e.n = 100;
    }
}

function wait(e,i){
    e.n -= aleatoire(dataArray[n*frame + i * 11],5);
    if (e.comportement == "hysterique") e.n -= 3;
    if (e.comportement == "colérique"){
        ctx.drawImage(imgGrumph[Math.floor(n / 3) % nGrumph],e.x,e.y - 150);
    }
    if (e.n < 0){
        e.n = 100;
        e.action = "choix";
    }
}

function hide(e,i){
    if (e.comportement == "hysterique"){
        e.n -= 3;
        if (e.n > 1) e.y += 9;
        else if (e.n == 1) e.x = aleatoire(dataArray[n*frame+i*10 + 13],W/2 - 100)*2;
        else if (e.n == -98) {e.action = "choix"; e.n = 100;e.y = H - 200;}
        else e.y -= 9;
    }
    else {
        e.n -= 1;
        if (e.n > 0) e.y += 3;
        else if (e.n == 0) e.x = aleatoire(dataArray[n*frame+i*10 + 13],W/2 - 100)*2;
        else if (e.n == -100) {e.action = "choix"; e.n = 100;}
        else e.y -= 3;
    }
}

function extraterrestre(e,i){
    if (e.comportement == "hysterique"){
        e.n -= 3;
        if (e.n > -200) e.y -= 9;
        else if (e.n == -202) e.img = imgPerso[aleatoire(dataArray[n*frame+i*10],nPerso-1)];
        else if (e.n <= -502) {e.action = "choix"; e.n = 100;e.y = H - 200;}
        else e.y += 9;
    }
    else {
        e.n -= 1;
        if (e.n > -200) e.y -= 3;
        else if (e.n == -200) e.img = imgPerso[aleatoire(dataArray[n*frame+i*10],nPerso-1)];
        else if (e.n == -500) {e.action = "choix"; e.n = 100;}
        else e.y += 3;
    }
}

function jump(e,i){
    if (e.comportement == "mou"){
        e.y -= e.n / 20;
        e.n -= 5;
    }
    else if (e.comportement == "hysterique"){
        e.y -= e.n / 5;
        e.n -= 20;
    }
    else{
        e.y -= e.n / 10;
        e.n -= 10;
    }
    if (e.y >= H - 200) {
        e.n = 100;
        e.action = "choix";
    }
}

function fall(e,i){
    e.y += (e.n  - 100) / 10;
    e.n += 10;
    if (e.y >= H + 1500) {
        e.n = 100;
        e.y = H + 1500;
        e.action = "climb";
    }
}

function climb(e,i){
    if (e.comportement == "mou") e.y += 7;
    if (e.comportement == "hysterique") e.y -= 7;
    e.y -= 15;
    if (e.y <= H - 200) {
        e.n = 100;
        e.y = H - 200;
        e.action = "choix";
    }
}

function superJump(e,i){
    e.y -= e.n / 2;
    e.n -= 10;
    if (e.y >= H - 200) {
        e.n = 100;
        objPerso.forEach(
            function(c,index) {
                if (c.action == "choix" | c.action == "move" | c.action == "thinking" | c.action == "wait" | c.action == "change" | c.action == "run") {
                    c.scale = 0.6;
                    c.action = "fall";
                }
            }
        );
        e.action = "choix";
    }
}

function think(e,i){
    e.n -= aleatoire(dataArray[n*frame + i * 11],2);
    if (e.comportement == "hysterique") e.n -= 3;
    ctx.drawImage(e.pensee,e.x + 50,e.y - 200);
    if (e.n < 0){
        e.n = 100;
        if (e.comportement != "stupide")e.pensee = imgThink[aleatoire(dataArray[n*frame+i],nThink-1)];
        e.action = "choix";
    }
}

function objet(e,i){
    if (e.n > 50) ctx.drawImage(e.obj,e.x + 350 - (e.n * 4),e.y + 50);
    if (e.n <= 50) ctx.drawImage(e.obj,e.x - 54 + (e.n * 4),e.y + 50);
    e.n -= 1;
    if (e.n <= 0){
        e.n = 100;
        e.n2 = 0;
        if (aleatoire(dataArray[n*frame+2],20) < 15) e.action = "objet";
        else e.action = "throw";
    }
}

function throwing(e,i){
    if (e.n == 100) e.n = 31;
    e.n -= 1;
    ctx.drawImage(e.obj,e.x - 50 + (30-e.n) * 10,e.y + 50 - e.n2);
    e.n2 += e.n;
    if (e.n == -35){
        e.obj = imgObj[aleatoire(dataArray[n*frame+i],nObj-1)];
        e.n = 100;
        e.action = "choix";
    }
}

function listen(e,i){
    e.n -= 1;
    if (e.comportement == "hysterique") e.n -= 1;
    if (e.n > 0) ctx.drawImage(e.expr,e.x + 100,H - 400 + e.n * 2);
    else if (e.n == -10) {e.expr = imgExpr[aleatoire(dataArray[n*frame+i],nExpr - 1)];e.n = 100;}
}

function monologue(e,i){
    e.n -= aleatoire(dataArray[n*frame + i * 11],3);
    ctx.drawImage(imgHalo,e.x,H - 800);
    ctx.drawImage(e.pensee,e.x + 50,e.y - 200);
    objPerso.forEach(
        function(c,index) {
            if (c.action == "choix" | c.action == "move" | c.action == "thinking" | c.action == "wait" | c.action == "change") {
                c.scale = 0.6;
                c.n = 100;
                c.action = "listen";
            }
        }
    );
    if (e.n < 0){
        n2 -= aleatoire(dataArray[n*frame + i * 11],30);
        e.n = 100;
        e.pensee = imgThink[aleatoire(dataArray[n*frame+i],nThink-1)];
        if (n2 < 0) {
            n2 = 100;
            e.action = "choix";
            objPerso.forEach(
                function(c,index) {
                    if (c.action == "listen") {
                        c.action = "choix";
                    }
                }
            );
        }
    }
}

function rotate(e,i){
    if (e.comportement == "mou"){e.n -= 0.5;e.r += Math.PI / 100;}
    else if (e.comportement == "hysterique"){e.n -= 2;e.r += Math.PI / 25}
    else{
        e.n -= 1;
        e.r += Math.PI / 50;
    }
    if (e.n == 0){
        e.n = 100;
        e.action = "choix";
    }
}

function change(e,i){
    e.n -= 1;
    if (e.n > 0) e.scale -= 0.006;
    else if (e.n == 0) e.img = imgPerso[aleatoire(dataArray[n*frame+i*10],nPerso-1)];
    else if (e.n == -100) {e.action = "choix"; e.n = 100;}
    else e.scale += 0.006;
}

function shout(e,i){
    e.n -= aleatoire(dataArray[n*frame+666],3);
    ctx.drawImage(imgShout,e.x,e.y - 50);
    if (e.n < 90){
        objPerso.forEach(
            function(c,index) {
                if ((c.action == "choix" | c.action == "move" | c.action == "thinking" | c.action == "wait" | c.action == "change") && c.comportement != "heros") {
                    c.scale = 0.6;
                    if (c.x < e.x) c.goal = 4;
                    else c.goal = W - 200;
                    c.action = "run";
                }
            }
        );
    }
    if (e.n < 0){
        e.n = 100;
        e.action = "choix";
    }
}

function danger(e,i){
    if (e.x > 150) e.x -= 2;
    else if (e.x < 145) e.x += 2;
    else{
        e.n -= 1;
        ctx.drawImage(e.danger,W - 150 - (e.n % 3)*2,H - 300);
        if (e.n < 90){
            objPerso.forEach(
                function(c,index) {
                    if ((c.action == "choix" | c.action == "move" | c.action == "thinking" | c.action == "wait" | c.action == "change" | c.action == "monologue" | c.action == "listen") && c.comportement != "heros") {
                        c.scale = 0.6;
                        c.goal = 0;
                        c.action = "run";
                    }
                    else if (c.action == "hide") {
                        c.n = 100;
                        c.action = "shiver";
                        c.y = H - 200;
                    }
                }
            );
        }
        if (e.n < -200){
            ctx.drawImage(e.obj,e.x + ((W - 150 - e.x) / 100) * (-200 - e.n),e.y + 50);

        }
        if (e.n < -300){
            e.obj = imgObj[aleatoire(dataArray[n*frame+i],nObj-1)];
            e.danger = imgDanger[aleatoire(dataArray[n*frame+i],nDanger-1)];
            e.n = 100;
            e.action = "choix";
        }
    }
}

function shiver(e,i){
    e.n -= 1;
    if (e.n % 4 ==  1) e.x += 3;
    else if (e.n == 0) {e.action = "choix"; e.n = 100;}
    else if (e.n % 4 == 3) e.x -= 3;
}

function quest(e,i){
    ctx.drawImage(imgQuest,0,H - 300);
    if (e.n == 100){
//        objPerso[0].x = 50;
//        objPerso[0].y = H - 500;
        objPerso[0].action = "rapace";
        objPerso[0].n = 100;
    }
    else if (e.n < -100){
        if (e.n > -200){
            ctx.drawImage(imgRapace,e.x - 250,(H - 220) / 100 * (-100 - e.n));
        }
        else if (e.n > -300){
            ctx.drawImage(imgRapace,e.x - 250,H - 220);
        }
        else if (e.n > -305){
            ctx.drawImage(imgRapace,e.x - 250 + (100 / 5) * (-300 - e.n),H - 220);
            e.x -= 100/5;
        }
        else if (e.n == -305){
            if (aleatoire(dataArray[n*frame+1],20) < 15) {e.n = -250;e.x += 100;}
            else {
                e.n = 101;
                e.action = "choix";
                objPerso[0].action = "superFall";
                objPerso[0].n = 100;
            }

        }
    }
    e.n -=1;
}

function rapace(e,i){
//    else if (e.n > 100){
        // A revoir car cela ne marche pas du tout !!!
//        e.y += (H - 200 - e.goal) / 100;
//    }
    if (e.n == 100){
        e.r = 0;
        e.scale = 0.6;
        e.y = H - 200;        
    }
    else if (e.n > 0){
        ctx.drawImage(imgRapace,e.x,(H - 300) / 100 * (100 - e.n));
    }
    else if (e.n > -20){
        e.y -= 10;
        ctx.drawImage(imgRapace,e.x,e.y - 100);
    }
    else if (e.n == -20){
        ctx.drawImage(imgRapace,e.x,e.y - 100);
        e.goal = e.x;
    }
    else if (e.n > -51){
        e.x += (50 - e.goal) / 30;
        ctx.drawImage(imgRapace,e.x,e.y - 100);
    }

    e.n -= 1;
}


// FONCTIONS RELATIVES AUX DESSINS DE DECOR ET D'EFFETS VISUELS

function montagne(){
    decor.globalAlpha = 1;
    for (var j = 50;j >= 0;j -= 10){
        decor.fillStyle = "rgb("+ (100 + j) + "," + (125 + j) +","+ (200 + j * 2) +")";
        if (j % 20 == 0){
            var mx = 0;
            var my = H / 2;
            decor.beginPath();
            decor.moveTo(mx,my);
            for (var i = firstTime;i < firstTime + 9;i++){
                if (i % 2 == 0) {my -= (aleatoire(dataArray[(i+j) * 10+666],70) + j) * 0.4;mx += (aleatoire(dataArray[(i+j) * 10+666],70) + j) * 0.8;}
                else {my += (aleatoire(dataArray[(i+j) * 10+666],200) + j) * 0.4;mx += (aleatoire(dataArray[(i+j) * 10+666],200) + j) * 0.8;}
                decor.lineTo(mx,my);
            }
            decor.lineTo(mx + (H-my) * 2,H);
            decor.lineTo(0,H);
            decor.closePath();
            decor.fill();
        }
        else{
            var mx = W;
            var my = H / 2;
            decor.beginPath();
            decor.moveTo(mx,my);
            for (var i = firstTime;i < firstTime + 9;i++){
                if (i % 2 == 0) {my -= (aleatoire(dataArray[(i+j) * 10+666],70) + j) * 0.4;mx -= (aleatoire(dataArray[(i+j) * 10+666],70) + j) * 0.8;}
                else {my += (aleatoire(dataArray[(i+j) * 10+666],200) + j) * 0.4;mx -= (aleatoire(dataArray[(i+j) * 10+666],200) + j) * 0.8;}
                decor.lineTo(mx,my);
            }
            decor.lineTo(mx - (H-my) * 2,H);
            decor.lineTo(W,H);
            decor.closePath();
            decor.fill();
        }
    }
    decor.globalAlpha = 0.7;
}

function grotte(){
    for (var j = 30;j >= 0;j -= 10){
        decor.fillStyle = "rgb("+ (100 + j) + "," + (100 + j) +","+ (50 + j) +")";
            var mx = -j;
            var my = H / 17 + j;
            decor.beginPath();
            decor.moveTo(mx,my);
            for (var i = firstTime;i < firstTime + 51;i++){
                if (i % 2 == 0) {my += stalag(i+j,40);mx += W / 50;}
                else {my -= stalag(i+j-1,40);mx += W / 50;}
                decor.lineTo(mx,my);
            }
            decor.lineTo(W,0);
            decor.lineTo(0,0);
            decor.closePath();
            decor.fill();
    }
}

function stalag(a,b){
    var truc = aleatoire(dataArray[a * 10+666],b);
    if (truc > b - b / 5) truc = truc * 2;
    return truc;
}

function biome(){
    var couleurs = ["rgb(250,200,90)","rgb(100,100,50)","rgb(200,200,180)","rgb(60,60,60)","rgb(200,200,255)","rgb(10,10,11)","rgb(149,150,0)","rgb(150,150,150)","rgb(235,235,235)"];
    var couleur = couleurs[aleatoire(dataArray[n * frame+664],couleurs.length - 1)];
    console.log(couleur);
    var relief = aleatoire(dataArray[n * frame+664],14);
//    var relief = 12;
    decor.fillStyle = couleur;
    decor.globalAlpha = 0.5;
    if (relief == 0) plat();
    else if (relief == 1) sommet();
    else if (relief == 2) vallee();
    else if (relief == 3) ecorche();
    else if (relief == 4) colline();
    else if (relief == 6) troue();
    else if (relief == 7) falaise();
    else if (relief == 8) devers();
    else if (relief == 9) pointe();
    else if (relief == 10) morcele();
    else if (relief == 12) double();
    else if (relief == 13) cratere();
    else if (relief == 14) roc();
    else sommet();

    decor.globalAlpha = 0.2;
    var climat = aleatoire(dataArray[n * frame+664],5);
    if (climat == 1) pluie();
    else if (climat == 2) neige();
    else if (climat == 3) brume();
    else if (climat == 4) bulle();
}

function pluie(){
    decor.fillStyle = "rgb(10,10,100)";
    var nBoucle = aleatoire(dataArray[n*frame + 500],40) + 50;
    for (var i = 0;i <= nBoucle;i++){
        decor.beginPath();
        decor.arc(aleatoire(dataArray[n*frame + 82 + i],W),aleatoire(dataArray[n*frame + 88 + i],H - H / 10),aleatoire(dataArray[n*frame + 14 + i],10) + 3,0,Math.PI);
        decor.moveTo(aleatoire(dataArray[n*frame + 82 + i],W) - aleatoire(dataArray[n*frame + 14 + i],10) - 3,aleatoire(dataArray[n*frame + 88 + i],H - H / 10));
        decor.lineTo(aleatoire(dataArray[n*frame + 82 + i],W),aleatoire(dataArray[n*frame + 88 + i],H - H / 10) - aleatoire(dataArray[n*frame + 14 + i],10) * 2 -6);
        decor.lineTo(aleatoire(dataArray[n*frame + 82 + i],W) + aleatoire(dataArray[n*frame + 14 + i],10) + 3,aleatoire(dataArray[n*frame + 88 + i],H - H / 10));
        decor.closePath();
        decor.fill();
    }
}

function neige(){
    decor.strokeStyle = "rgb(255,255,255)";
    var nBoucle = aleatoire(dataArray[n*frame + 500],40) + 30;
    var coor = [[0,3],[2,2],[3,0],[2,-2],[0,-3],[-2,-2],[-3,0],[-2,2]];
    for (var i = 0;i <= nBoucle;i++){
        var size = aleatoire(dataArray[n*frame + 666 + i],15) + 2;
        decor.beginPath();
        coor.forEach( function(e){
            decor.moveTo(aleatoire(dataArray[n*frame + 18 + i],W),aleatoire(dataArray[n*frame + 42 + i],H - H / 10));
            decor.lineTo(aleatoire(dataArray[n*frame + 18 + i],W) + e[0] * size,aleatoire(dataArray[n*frame + 42 + i],H - H / 10) + e[1] * size);
        });
        decor.closePath();
        decor.stroke();
    }
}

function bulle(){
    var nBoucle = aleatoire(dataArray[n*frame + 500],40) + 30;
    var coor = [[0,3],[2,2],[3,0],[2,-2],[0,-3],[-2,-2],[-3,0],[-2,2]];
    for (var i = 0;i <= nBoucle;i++){
        decor.strokeStyle = "rgb(0,0,0)";
        decor.beginPath();
        decor.arc(aleatoire(dataArray[n*frame + 82 + i],W),aleatoire(dataArray[n*frame + 88 + i],H - H / 10),aleatoire(dataArray[n*frame + 14 + i],15) + 5,-Math.PI,Math.PI);
        decor.closePath();
        decor.stroke();
    }
}

function brume(){
    decor.fillStyle = "rgb(150,150,150)";
    decor.globalAlpha = 0.04;
    for (var i = 0;i <= 20;i++){
        decor.fillRect(0,i * H / 20,W,H);
    }
}

function double(){
    var relief = aleatoire(dataArray[n * frame+674],14);
    if (relief == 0) plat();
    else if (relief == 1) sommet();
    else if (relief == 2) vallee();
    else if (relief == 3) ecorche();
    else if (relief == 4) colline();
    else if (relief == 6) troue();
    else if (relief == 7) falaise();
    else if (relief == 8) devers();
    else if (relief == 9) pointe();
    else if (relief == 10) morcele();
    else if (relief == 13) cratere();
    else if (relief == 14) roc();
    else sommet();
    relief = aleatoire(dataArray[n * frame+274],14);
    if (relief == 0) plat();
    else if (relief == 1) sommet();
    else if (relief == 2) vallee();
    else if (relief == 3) ecorche();
    else if (relief == 4) colline();
    else if (relief == 6) troue();
    else if (relief == 7) falaise();
    else if (relief == 8) devers();
    else if (relief == 9) pointe();
    else if (relief == 10) morcele();
    else if (relief == 13) cratere();
    else if (relief == 14) roc();
    else sommet();
}

function plat(){
    decor.fillRect(0,H - H / 10,W,H / 10);
}

function sommet(){
    decor.fillRect(0,H - H / 10,W,H / 10);
    var repartition = aleatoire(dataArray[n*frame+323],2);
    var nBoucle = aleatoire(dataArray[n*frame + 500],5) + 2;
    if (repartition == 0 | repartition == 2){
        for (var i = 0;i <= nBoucle;i++){
            decor.beginPath();
            decor.moveTo(aleatoire(dataArray[n*(frame + i)],W - 100),H - H / 10);
            decor.lineTo(aleatoire(dataArray[n*(frame + i)],W - 100) + aleatoire(dataArray[n*(frame + i - 3)],H / 10) + 50,H - H / 10 - aleatoire(dataArray[n*(frame + i + 1)],H / 4) - 100);
            decor.lineTo(aleatoire(dataArray[n*(frame + i)],W - 100) + aleatoire(dataArray[n*(frame + i - 3)],H / 10) * 2 + 100,H - H / 10);
            decor.closePath();
            decor.fill();
        }
    }
    if (repartition == 1 | repartition == 2){
        decor.beginPath();
        decor.moveTo(W / 4,H - H / 10);
        decor.lineTo(W / 2,H - H / 10 - aleatoire(dataArray[n*(frame + 1)],H / 2) - 300);
        decor.lineTo((W / 4) * 3,H - H / 10);
        decor.closePath();
        decor.fill();
    }
}

function vallee(){
    decor.fillRect(0,H - H / 10,W,H / 10);
    decor.beginPath();
    decor.moveTo(0,H / 2 - aleatoire(dataArray[n*frame + 38],200));
    decor.lineTo(W / 3 + aleatoire(dataArray[n*frame + 41],100),H - H / 10);
    decor.lineTo(0,H - H / 10);
    decor.closePath();
    decor.fill();
    decor.beginPath();
    decor.moveTo(W,H / 2 - aleatoire(dataArray[n*frame + 39],200));
    decor.lineTo(W - W / 3 - aleatoire(dataArray[n*frame + 40],100),H - H / 10);
    decor.lineTo(W,H - H / 10);
    decor.closePath();
    decor.fill();    
}

function ecorche(){
    decor.fillRect(0,H - H / 10,W,H / 10);
    var nBoucle = aleatoire(dataArray[n*frame + 500],4) + 2;
    for (var i = 0;i <= nBoucle;i++){
        decor.fillRect(aleatoire(dataArray[n*frame + 82 + i],W - 120),H - H / 10,50, - aleatoire(dataArray[n*frame + 81 + i],400) - 40);
        decor.fillRect(aleatoire(dataArray[n*frame + 82 + i],W - 120),H - H / 10 - aleatoire(dataArray[n*frame + 81 + i],400) - 40,aleatoire(dataArray[n*frame + 81 + i],800) - 400,50);
        spike(aleatoire(dataArray[n*frame + 82 + i],W - 120),H - H / 10 - aleatoire(dataArray[n*frame + 81 + i],400) + 10,aleatoire(dataArray[n*frame + 81 + i],800) - 400);
    }
}

function spike(x,y,l){
    if (l < 0) {
        x += l;
        l = -l;
    }
    var actx = x;
    decor.beginPath();
    decor.moveTo(x,y);
    while (actx < x + l){
        actx += 11;
        decor.lineTo(actx,y + ((actx - x)%2)*(10 + aleatoire(dataArray[n*frame + 82 + actx],15)));
    }
    decor.lineTo(x + l,y);
    decor.closePath();
    decor.fill();
}

function colline(){
    decor.fillRect(0,H - H / 10,W,H / 10);
    var nBoucle = aleatoire(dataArray[n*frame + 500],10) + 7;
    for (var i = 0;i <= nBoucle;i++){
        decor.beginPath();
        decor.arc(aleatoire(dataArray[n*frame + 82 + i],W),H,aleatoire(dataArray[n*frame + 83 + i],150) + H / 10,-Math.PI,0);
        decor.closePath();
        decor.fill();
    }
}

function falaise(){
    decor.fillRect(0,H - H / 10,W,H / 10);
    var nBoucle = aleatoire(dataArray[n*frame + 500],10) + 5;
    for (var i = 0;i <= nBoucle;i++){
        decor.fillRect(aleatoire(dataArray[n*frame + 82 + i],W),H - H / 10,-aleatoire(dataArray[n*frame + 83 + i],150) - 100,-aleatoire(dataArray[n*frame + 63 + i],300) - 100);
    }
}

function pointe(){
    decor.fillRect(0,H - H / 10,W,H / 10);
    var x = 0;
    decor.beginPath();
    decor.moveTo(x,H-H/10);
    while (x < W){
        x += 21;
        decor.lineTo(x,H-H/10 - (x%2)*(30 + aleatoire(dataArray[n*frame + 82 + x],100) * 4));
    }
    decor.lineTo(W,H - H/10);
    decor.closePath();
    decor.fill();
}

function devers(){
    decor.fillRect(0,H - H / 10,W,H / 10);
    decor.beginPath();
    decor.moveTo(0,H / 2 - aleatoire(dataArray[n*frame + 37],200));
    decor.lineTo(W / 4 + aleatoire(dataArray[n*frame + 41],100),H / 2 - aleatoire(dataArray[n*frame + 38],200));
    decor.lineTo(W / 4 - aleatoire(dataArray[n*frame + 42],100),H / 2 + aleatoire(dataArray[n*frame + 32],50));
    decor.lineTo(W / 4 - aleatoire(dataArray[n*frame + 43],100),H-H/10);
    decor.lineTo(0,H-H/10);
    decor.closePath();
    decor.fill();
    decor.beginPath();
    decor.moveTo(W,H / 2 - aleatoire(dataArray[n*frame + 38],200));
    decor.lineTo(W - W / 4 - aleatoire(dataArray[n*frame + 45],100),H / 2 - aleatoire(dataArray[n*frame + 39],200));
    decor.lineTo(W - W / 4 + aleatoire(dataArray[n*frame + 46],100),H / 2 + aleatoire(dataArray[n*frame + 35],50));
    decor.lineTo(W - W / 4 - aleatoire(dataArray[n*frame + 47],100),H-H/10);
    decor.lineTo(W,H-H/10);
    decor.closePath();
    decor.fill();    
}

function troue(){
    decor.fillRect(0,H - H / 10,W,H / 10);
    var nBoucle = aleatoire(dataArray[n*frame + 500],13) + 9;
    for (var i = 0;i <= nBoucle;i++){
        decor.beginPath();
        decor.arc(aleatoire(dataArray[n*frame + 82 + i],W),aleatoire(dataArray[n*frame + 83 + i],H),aleatoire(dataArray[n*frame + 83 + i],150),-Math.PI,Math.PI);
        decor.closePath();
        decor.fill();
    }
}

function morcele(){
    decor.fillRect(0,H - H / 10,W,H / 10);
    var nBoucle = aleatoire(dataArray[n*frame + 500],5) + 2;
    for (var i = 0;i <= nBoucle;i++){
        decor.beginPath();
        decor.arc(aleatoire(dataArray[n*frame + 82 + i],W),aleatoire(dataArray[n*frame + 83 + i],H),aleatoire(dataArray[n*frame + 83 + i],150),0,-Math.PI);
        decor.closePath();
        decor.fill();
    }
}

function cratere(){
    decor.fillRect(0,H - H / 10,W,H / 10);
    var nBoucle = aleatoire(dataArray[n*frame + 500],3) + 2;
    for (var i = 0;i <= nBoucle;i++){
        decor.beginPath();
        decor.moveTo(aleatoire(dataArray[n*frame + 28 + i],W),H-H/10);
        decor.lineTo(aleatoire(dataArray[n*frame + 28+i],W)+aleatoire(dataArray[n*frame + 47 + i],50) + 50,H/2 - aleatoire(dataArray[n*frame + 11 + i],100));
        decor.lineTo(aleatoire(dataArray[n*frame+28+i],W)+aleatoire(dataArray[n*frame+47+i],100)+100,H/2 - aleatoire(dataArray[n*frame + 11 + i],50) + 20);
        decor.lineTo(aleatoire(dataArray[n*frame+28+i],W)+aleatoire(dataArray[n*frame+47+i],100)+200,H/2 - aleatoire(dataArray[n*frame + 11 + i],50) + 20);
        decor.lineTo(aleatoire(dataArray[n*frame+28+i],W)+aleatoire(dataArray[n*frame+47+i],300)+200,H/2 - aleatoire(dataArray[n*frame + 11 + i],100));
        decor.lineTo(aleatoire(dataArray[n*frame+28+i],W)+aleatoire(dataArray[n*frame+47+i],400)+300,H-H/10);
        decor.closePath();
        decor.fill();
    }
}

function roc(){
    decor.fillRect(0,H - H / 10,W,H / 10);
    var nBoucle = aleatoire(dataArray[n*frame + 500],13) + 9;
    for (var i = 0;i <= nBoucle;i++){
        decor.fillRect(aleatoire(dataArray[n*frame+28+i],W),aleatoire(dataArray[n*frame+77+i],H),aleatoire(dataArray[n*frame+98+i],300),aleatoire(dataArray[n*frame+29+i],300));
    }
}
