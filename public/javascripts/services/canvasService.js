angular
    .module('ttt')
    .service('canvasService', canvasService);

function canvasService ($sessionStorage, $document) {
        var w = window.innerWidth;
        var h =  window.innerHeight;
        var canvas = $document.find('canvas')[0];
        canvas.width  = w;
        canvas.height = h;
        var pulse = true;
        var ctx  = canvas.getContext('2d');
        var dir = 1;
        var x = w/3;
        var y = h/3;
        var ox = w;
        var oy = h/4;
        var palette = [
            {
                velocity:-3,
                sky:"#819FF7",
                cloud:"#3104B4",
                other:"#3104B4"
            },
            {
                velocity:0,
                sky:"#0B0B61",                
                cloud: ["#FF0000","#FE9A2E","#9AFE2E","#58FAF4","#FF00FF"],
                other:"#FFFF00",                
            },
            {
                velocity:1,
                sky:"#A9E2F3",
                cloud:"#EFF5FB",
                other:"#F3F781"
            }
        ];
        var blower= [];
        for(let a=0;a<200;a++)blower.push({'px': w/2, 'py': h/2, 'vx': 5 -10*Math.random(),'vy': 5 -10*Math.random()});

        function draw() {
            if($sessionStorage.canvasState!=undefined) dir = $sessionStorage.canvasState;
            var state = palette[dir+1];
            pulse=!pulse;
            if(x>w*2)x=-w/2;
            else if(x<0-w) x=w*2 - w/2;

            x += state.velocity;
            y = state.velocity* h/3;
            ctx.fillStyle = state.sky;
            ctx.fillRect(0, 0, w, h);
            
            ctx.fillStyle = state.other;
            if(dir==-1) {
                if(oy>h*2)oy=h;
                ox = state.velocity;
                oy -= state.velocity;

                for(let n=0; n<h*4; n+=200){
                    for(let m=0; m<w; m+=100){
                        cx = ox + m;
                        cy = oy - n;
                        ctx.beginPath();
                        for(let s=1;s<-state.velocity;s++){
                            ctx.arc(cx-s,cy+s , 2, 0, 2*Math.PI, false);
                        }
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }
            else if(dir==1) { 
                ctx.beginPath();
                ctx.arc(w/9 , h/9, h/10, 0, 2*Math.PI, false);
                ctx.closePath();
                ctx.fill();            
            }
            else {
                ctx.beginPath();
                ctx.arc(w*9/10,h*2/10, h/11, 0, 2*Math.PI, false);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = state.sky;  
                ctx.beginPath();
                ctx.arc(w*9/10-30,h*2/10-30 , h/11, 0, 2*Math.PI, false);
                ctx.closePath();
                ctx.fill();               
                for(let b = 0; b<200;b++) {
                        if(b%40==0) ctx.fillStyle = state.cloud[b/40];                

                        ctx.beginPath();
                        ctx.arc(blower[b].px,blower[b].py, 10,0,2*Math.PI, false);
                        ctx.closePath();
                        ctx.fill();
                        blower[b].px +=blower[b].vx;
                        blower[b].py +=blower[b].vy;                    
                }
            }

            if(dir!=0){
                ctx.fillStyle = state.cloud;
                for(let k = 0;k<6*Math.abs(state.velocity); k++){
                    let l = k;
                    if(k%2 == 0) l*=-1;
                    for(let i = 0;i<6;i++) {
                        let j=i;
                        if(i%2 == 0) j*=-1;
                        let cx = x-30*i + l*w/7;
                        let cy = y-10*j*Math.abs(state.velocity)+ k*50;
                        ctx.beginPath();
                        ctx.arc(cx,cy, 55*Math.abs(state.velocity)*Math.abs(state.velocity), 0, 2*Math.PI, false); 
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }
            requestAnimationFrame(draw);
        };

        return {
            setState: function(state) {
                dir = state;
            }

        };
    }
