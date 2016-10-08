$(function(){
    var canvas=$('.canvas').get(0)
    var ctx=canvas.getContext('2d');
    var width=$('.canvas').width();
    var rom=15;
    var off=width/15;
    var blocks={};
    var xflag=true;
    var ai=false;
    var blank={};
    var audio=$('audio').get(0);
    for(var i=0;i<rom;i++){
        for(var j=0;j<rom;j++){
            blank[p2k(i,j)]=true;
        }
    }
    console.log(blank)

    function AI() {
        //遍历所有的空白位置
        var max1 = -Infinity;
        var max2 = -Infinity;
        var pos1;
        var pos2;
        for(var i in blank){
            var score1 = check(k2o(i),'black');
            console.log(score1);
            var score2 = check(k2o(i),'white');
            if(score1>max1){
                max1 = score1;
                pos1 = k2o(i);
            }
            if(score2>max2){
                max2 = score2;
                pos2 = k2o(i);
            }
        }
        if(max1>=max2){
            return pos1;
        }else{
            return pos2;
        }
    }

    function  drawpan() {
        function makehx(i){
            ctx.beginPath();
            ctx.strokeStyle='#bda37b'
            ctx.moveTo(off/2+0.5,off/2+0.5+i*off);
            ctx.lineTo(width-off/2+0.5,off/2+0.5+i*off)
            ctx.stroke();
            ctx.closePath();
        }
        for(var i=0;i<15;i++){
            makehx(i)
        }

        function makesx(j){
            ctx.beginPath();
            ctx.strokeStyle='#bda37b'
            ctx.moveTo(off/2+0.5+j*off,off/2+0.5);
            ctx.lineTo(off/2+0.5+j*off,width-off/2+0.5)
            ctx.stroke();
            ctx.closePath();
        }

        for(var j=0;j<15;j++){
            makesx(j);
        }

        function makecirclce(x,y){

            ctx.beginPath();
            // ctx.fillStyle='#543004';
            ctx.arc(x*off,y*off,3,0,Math.PI*2)
            ctx.fill();
            ctx.closePath();
        }
        makecirclce(3.5,3.5)
        makecirclce(3.5,11.5)
        makecirclce(7.5,7.5)
        makecirclce(11.5,3.5)
        makecirclce(11.5,11.5)
    }
    //画棋
    function pieces(position,color){
        ctx.save();
        ctx.beginPath();
        ctx.translate((position.x+0.5)*off+0.5,(position.y+0.5)*off+0.5)
        if(color==='black'){
            var hqi = ctx.createRadialGradient(-6,-6,1,0,0,15);
            hqi.addColorStop(0,"white");
            hqi.addColorStop(0.5,"black");
            ctx.fillStyle = hqi;
            audio.play();
            clearInterval(hei)
        }else if(color==='white'){
            ctx.shadowOffsetX=2;
            ctx.shadowOffsetY=2;
            ctx.shadowColor = "black";
            ctx.shadowBlur = 5;
            ctx.fillStyle='#fff';
            audio.play();
            clearInterval(bai);

        }
        ctx.arc(0,0,15,0,Math.PI*2)
        ctx.fill()
        ctx.closePath();
        ctx.restore();
        blocks[position.x + '_' + position.y]=color;
        delete  blank[v2k(position)];
        // console.log(blocks)
    }


    // var img = new Image();
    // function pieces(position,color){
    //     ctx.save();
    //     ctx.translate((position.x+0.5)*off+0.5,(position.y+0.5)*off+0.5)
    //     ctx.beginPath();
    //     ctx.arc(0,0,15,0,Math.PI*2)
    //     if(color==='black'){
    //         img.src = 'img/hei.png';
    //         ctx.drawImage(img, -15, -15, 30, 30);
    //
    //     }else{
    //         img.src = 'img/bai.png';
    //         ctx.drawImage(img, -15, -15, 30, 30);
    //
    //     }
    //     ctx.closePath();
    //     ctx.restore();
    //     blocks[position.x + '_' + position.y]=color;
    //     delete  blank[v2k(position)];
    // }

    function v2k(position) {
        return position.x+'_'+position.y;
    }
    function p2k(x,y){
        return x+'_'+y;
    }

    function check(pos,color){

        var table={};
        var rowNum=1,
            colNum=1,
            leftNum=1,
            rightNum=1;
        for(var i in blocks){
            if(blocks[i]===color){
                table[i]=true;
            }
        }

        //横
        var tx=pos.x;
        var ty=pos.y;
        while(table[p2k(tx+1,ty)]){
            rowNum++;
            tx++
            // console.log(rowNum)
        };

        //复原
        var tx=pos.x;
        var ty=pos.y;
        while(table[p2k(tx-1,ty)]){
            rowNum++;
            tx--
            console.log(rowNum)
        };

        //竖
        var tx=pos.x;
        var ty=pos.y;
        while(table[p2k(tx,ty+1)]){
            colNum++;
            ty++
        };
        var tx=pos.x;
        var ty=pos.y;
        while(table[p2k(tx,ty-1)]){
            colNum++;
            ty--
        };

        //左斜
        var tx=pos.x;
        var ty=pos.y;
        while(table[p2k(tx-1,ty-1)]){
            leftNum++;
            ty--;
            tx--;
        };
        var tx=pos.x;
        var ty=pos.y;
        while(table[p2k(tx+1,ty+1)]){
            leftNum++;
            ty++;
            tx++;
        };
        //右斜
        var tx=pos.x;
        var ty=pos.y;
        while(table[p2k(tx+1,ty-1)]){
            rightNum++;
            ty--;
            tx++;
        };
        var tx=pos.x;
        var ty=pos.y;
        while(table[p2k(tx-1,ty+1)]){
            rightNum++;
            ty++;
            tx--;
        };


        // console.log(table)
        // return rowNum>=5||colNum>=5||leftNum>=5||rightNum>=5;
        return Math.max(rowNum,colNum,leftNum,rightNum);
    }

    function k2o(key){
        var arr=key.split('_');
        return {x:parseInt(arr[0]),y:parseInt(arr[1])}
    }
    //绘制文本
    function drawText(pos,text,color){
        ctx.save();
        ctx.font='15px 微软雅黑';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        if(color==='black'){
            ctx.fillStyle='white';
        }else if(color==='white'){
            ctx.fillStyle='black';
        }

        ctx.fillText(text, (pos.x+0.5)*off,(pos.y+0.5)*off)
        ctx.restore();


    }
    function review(){
        var i=1;
        for(var pos in blocks){
            drawText(k2o(pos),i,blocks[pos])
            i++;
        }
    }
    function handClick(e){
        var position=
        {   x:Math.round((e.offsetX-off/2)/off),
            y:Math.round((e.offsetY-off/2)/off)
        }
        if(blocks[v2k(position)]){
            return;
        }


        if(ai){
            pieces(position,'black');
            pieces(AI(),'white');
            if(check(position,'black')>=5){
                $('.blackwin').addClass('ani fade-in-down')
                $('.blackwin').css('display','block')
                $(canvas).off('click');
                setTimeout(function(){
                    $('.qipu').css('display','block');
                },2000)
                $('.yes').on('click',function(){
                    review();
                    $('.qipu').css('display','none');
                    $('.whitewin').css('display','none');
                    $('.blackwin').css('display','none');
                })
                $('.no').on('click',function(){
                    $('.qipu').css('display','none');
                    $('.whitewin').css('display','none');
                    $('.blackwin').css('display','none');
                })
                return;
            }
            if(check(AI(),'white')>5){
                $('.whitewin').addClass('ani fade-in-down')
                $('.whitewin').css('display','block')
                $(canvas).off('click');
                setTimeout(function(){
                    $('.qipub').css('display','block')
                },2000)
                $('.yes').on('click',function(){
                    review();
                    $('.qipub').css('display','none');
                    $('.whitewin').css('display','none');
                    $('.blackwin').css('display','none');
                })
                $('.no').on('click',function(){
                    $('.qipub').css('display','none');
                    $('.whitewin').css('display','none');
                    $('.blackwin').css('display','none');
                })
                return;
            }
            return;
        }



        if(xflag){

            pieces(position,'black')
            //输赢判断
            if(check(position,'black')>=5){
                $('.blackwin').addClass('ani fade-in-down')
                $('.blackwin').css('display','block')
                $('.canvas').off('click')
                setTimeout(function(){
                    $('.qipu').css('display','block');
                },2000)
                $('.yes').on('click',function(){
                    review();
                    $('.qipu').css('display','none');
                    $('.whitewin').css('display','none');
                    $('.blackwin').css('display','none');
                })
                $('.no').on('click',function(){
                    $('.qipu').css('display','none');
                    $('.whitewin').css('display','none');
                    $('.blackwin').css('display','none');
                })

                return;
            }

            // console.log(position.x,position.y)
        }else {
            pieces(position,'white')
            if( check(position,'white')>=5){
                $('.whitewin').addClass('ani fade-in-down')
                $('.whitewin').css('display','block')
                $('.canvas').off('click')
                setTimeout(function(){
                    $('.qipub').css('display','block')
                },2000)
                $('.yes').on('click',function(){
                    review();
                    $('.qipub').css('display','none');
                    $('.whitewin').css('display','none');
                    $('.blackwin').css('display','none');
                })
                $('.no').on('click',function(){
                    $('.qipub').css('display','none');
                    $('.whitewin').css('display','none');
                    $('.blackwin').css('display','none');
                })
                return;
            }

        }
        xflag=!xflag;

    }

    function restart(){
        //清空画布
        ctx.clearRect(0,0,width,width)
        xflag=true;
        blocks={};
        $('.canvas').on('click',handClick);
        $('.blackwin').css('display','none');
        $('.whitewin').css('display','none');
        $('.qipub').css('display','none');
        $('.qipu').css('display','none');

        secondh=-1;
        secondb=-1;
        drawpan();
    }

    drawpan();
    $('.canvas').on('click',handClick)

    $('.start').on('click',function(){
        $('.start').toggleClass('active');
        restart();
    })

    $('.ai').on('click',function(){
        restart();
        $('.ai').toggleClass('active');
        // AI();
        if(ai==true){
            ai=false
        }else if(ai==false){
            ai = true;
        }
    })



    function format(second){
        var m=parseInt(second/60);
        var s=parseInt(second%60);
        s=(s < 10)?( '0' + s):s;
        m=(m<10)?('0'+m):m;
        var time=m + ":" + s;
        return time;
    }


    //白秒表
    var second=$('.clock').get(0);
    var sctx=second.getContext('2d');
    var sb=0;
    function miao() {
        sctx.clearRect(0,0,100,100)
        sctx.save();
        sctx.translate(50,50);
        sctx.beginPath();
        sctx.rotate(Math.PI*2/60*sb);
        sctx.arc(0,0,3,0,Math.PI*2);
        sctx.moveTo(0,-3)
        sctx.lineTo(0,-30)
        sctx.moveTo(0,3)
        sctx.lineTo(0,8)
        sctx.stroke();
        sctx.closePath();
        sctx.restore();
        sb++;
    }
    miao()
    var bai=setInterval(miao,1000);


    var secondb=0
    var timeb=$('.time')
    setInterval(function () {
        secondb++;
        timeb=$('.time').text(format(secondb))
    },1000)


    //黑秒表
    var secondh=$('.clockh').get(0);
    var hctx=secondh.getContext('2d');
    var sh=0;
    function miaoh() {
        hctx.clearRect(0,0,100,100)
        hctx.save();
        hctx.translate(50,50);
        hctx.beginPath();
        hctx.strokeStyle = '#fff';
        hctx.rotate(Math.PI*2/60*sh);
        hctx.arc(0,0,3,0,Math.PI*2);
        hctx.moveTo(0,-3)
        hctx.lineTo(0,-30)
        hctx.moveTo(0,3)
        hctx.lineTo(0,8)

        hctx.stroke();
        hctx.closePath();
        hctx.restore();
        sh++;
    }
    miaoh()
    var hei=setInterval(miaoh,1000);

    var secondh=0
    var timeh=$('.time')
    setInterval(function () {
        secondh++;
        timeh=$('.time').text(format(secondh))
    },1000)
    $(document).on('mousedown',false)
})