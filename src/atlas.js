
var atlas = (function(){

    var canvas,ctx;
    var size = 22;
    var cols = 14; // has to be ONE MORE than intended to fix some sort of CHROME BUG (last cell always blank?)
    var rows = 36;

    var creates = 0;

    var drawGrid = function() {
        // draw grid overlay
        var canvas = document.getElementById('gridcanvas');
        if (!canvas) {
            return;
        }
        var w = size*cols*renderScale;
        var h = size*rows*renderScale;
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,w,h);
        var x,y;
        var step = size*renderScale;
        ctx.beginPath();
        for (x=0; x<=w; x+=step) {
            ctx.moveTo(x,0);
            ctx.lineTo(x,h);
        }
        for (y=0; y<=h; y+=step) {
            ctx.moveTo(0,y);
            ctx.lineTo(w,y);
        }
        ctx.lineWidth = "1px";
        ctx.lineCap = "square";
        ctx.strokeStyle="rgba(255,255,255,0.5)";
        ctx.stroke();
    };

    var create = function() {
        drawGrid();
        canvas = document.getElementById('atlas');
        ctx = canvas.getContext("2d");
        /*
        canvas.style.left = 0;
        canvas.style.top = 0;
        canvas.style.position = "absolute";
        */

        var w = size*cols*renderScale;
        var h = size*rows*renderScale;
        canvas.width = w;
        canvas.height = h;

        if (creates > 0) {
            ctx.restore();
        }
        creates++;

        ctx.save();
        ctx.clearRect(0,0,w,h);
        ctx.scale(renderScale,renderScale);

        var drawAtCell = function(f,row,col) {
            var x = col*size + size/2;
            var y = row*size + size/2;
            f(x,y);
        };

        var row = 0;
        drawAtCell(function(x,y) { drawCherry(ctx,x,y); },      row,0);
        drawAtCell(function(x,y) { drawStrawberry(ctx,x,y); },  row,1);
        drawAtCell(function(x,y) { drawOrange(ctx,x,y); },      row,2);
        drawAtCell(function(x,y) { drawApple(ctx,x,y); },       row,3);
        drawAtCell(function(x,y) { drawMelon(ctx,x,y); },       row,4);
        drawAtCell(function(x,y) { drawGalaxian(ctx,x,y); },    row,5);
        drawAtCell(function(x,y) { drawBell(ctx,x,y); },        row,6);
        drawAtCell(function(x,y) { drawKey(ctx,x,y); },         row,7);
        drawAtCell(function(x,y) { drawPretzel(ctx,x,y); },     row,8);
        drawAtCell(function(x,y) { drawPear(ctx,x,y); },        row,9);
        drawAtCell(function(x,y) { drawBanana(ctx,x,y); },      row,10);
        drawAtCell(function(x,y) { drawCookie(ctx,x,y); },      row,11);
        drawAtCell(function(x,y) { drawCookieFlash(ctx,x,y); },      row,12);

        var drawGhostCells = function(row,color) {
            var i,f;
            var col = 0;
            for (i=0; i<4; i++) { // dirEnum
                for (f=0; f<2; f++) { // frame
                    drawAtCell(function(x,y) { drawGhostSprite(ctx, x,y, f, i, false, false, false, color); },   row,col);
                    col++;
                }
            }
        };

        row++;
        drawGhostCells(row, "#FF0000");
        row++;
        drawGhostCells(row, "#FFB8FF");
        row++;
        drawGhostCells(row, "#00FFFF");
        row++;
        drawGhostCells(row, "#FFB851");

        row++;
        // draw disembodied eyes
        (function(){
            var i;
            var col = 0;
            for (i=0; i<4; i++) { // dirEnum
                drawAtCell(function(x,y) { drawGhostSprite(ctx, x,y, 0, i, false, false, true, "#fff"); },     row,col);
                col++;
            }
        })();

        // draw ghosts scared
        drawAtCell(function(x,y) { drawGhostSprite(ctx, x,y, 0, DIR_UP, true, false, false, "#fff"); }, row,4);
        drawAtCell(function(x,y) { drawGhostSprite(ctx, x,y, 1, DIR_UP, true, false, false, "#fff"); }, row,5);
        drawAtCell(function(x,y) { drawGhostSprite(ctx, x,y, 0, DIR_UP, true, true, false, "#fff"); },  row,6);
        drawAtCell(function(x,y) { drawGhostSprite(ctx, x,y, 1, DIR_UP, true, true, false, "#fff"); },  row,7);

        var drawPacCells = function(row,col,dir) {
            drawAtCell(function(x,y) { drawPacmanSprite(ctx, x,y, dir, Math.PI/6); }, row, col);
            drawAtCell(function(x,y) { drawPacmanSprite(ctx, x,y, dir, Math.PI/3); }, row, col+1);
        };
        row++;

        // draw pacman mouth closed
        drawAtCell(function(x,y) { drawPacmanSprite(ctx, x,y, DIR_RIGHT, 0); }, row, 0);

        // draw pacman directions
        (function(){
            var i;
            var col=1;
            for (i=0; i<4; i++) {
                drawPacCells(row,col,i);
                col+=2;
            }
        })();

        var drawMsPacCells = function(row,col,dir) {
            drawAtCell(function(x,y) { drawMsPacmanSprite(ctx, x,y, dir, 0); }, row, col);
            drawAtCell(function(x,y) { drawMsPacmanSprite(ctx, x,y, dir, 1); }, row, col+1);
            drawAtCell(function(x,y) { drawMsPacmanSprite(ctx, x,y, dir, 2); }, row, col+2);
        };
        row++;
        (function(){
            var i;
            var col=0;
            for (i=0; i<4; i++) {
                drawMsPacCells(row,col,i);
                col+=3;
            }
        })();

        var drawCookieCells = function(row,col,dir) {
            drawAtCell(function(x,y) { drawCookiemanSprite(ctx, x,y, dir, 0, true); }, row, col);
            drawAtCell(function(x,y) { drawCookiemanSprite(ctx, x,y, dir, 1, true); }, row, col+1);
            drawAtCell(function(x,y) { drawCookiemanSprite(ctx, x,y, dir, 2, true); }, row, col+2);
        };
        row++;
        (function(){
            var i;
            var col=0;
            for (i=0; i<4; i++) {
                drawCookieCells(row,col,i);
                col+=3;
            }
        })();

        var drawMonsterCells = function(row,color) {
            var i,f;
            var col=0;
            for (i=0; i<4; i++) { // dirEnum
                for (f=0; f<2; f++) { // frame
                    drawAtCell(function(x,y) { drawMonsterSprite(ctx, x,y, f, i, false, false, false, color); },   row,col);
                    col++;
                }
            }
        };

        row++;
        drawMonsterCells(row, "#FF0000");
        row++;
        drawMonsterCells(row, "#FFB8FF");
        row++;
        drawMonsterCells(row, "#00FFFF");
        row++;
        drawMonsterCells(row, "#FFB851");

        row++;
        (function(){
            var i;
            var col = 0;
            for (i=0; i<4; i++) { // dirEnum
                drawAtCell(function(x,y) { drawMonsterSprite(ctx, x,y, 0, i, false, false, true, "#fff"); },     row,col);
                col++;
            }
        })();
        drawAtCell(function(x,y) { drawMonsterSprite(ctx, x,y, 0, DIR_UP, true, false, false, "#fff"); }, row,4);
        drawAtCell(function(x,y) { drawMonsterSprite(ctx, x,y, 1, DIR_UP, true, false, false, "#fff"); }, row,5);
        drawAtCell(function(x,y) { drawMonsterSprite(ctx, x,y, 0, DIR_UP, true, true, false, "#fff"); },  row,6);
        drawAtCell(function(x,y) { drawMonsterSprite(ctx, x,y, 1, DIR_UP, true, true, false, "#fff"); },  row,7);

        var drawOttoCells = function(row,col,dir) {
            var i;
            for (i=0; i<4; i++) { // frame
                drawAtCell(function(x,y) { drawOttoSprite(ctx, x,y, dir, i); }, row, col);
                col++;
            }
        };
        row++;
        drawOttoCells(row,0, DIR_UP);
        drawOttoCells(row,4, DIR_RIGHT);
        row++;
        drawOttoCells(row,0, DIR_DOWN);
        drawOttoCells(row,4, DIR_LEFT);

        row++;
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 200, "#33ffff"); }, row, 0);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 400, "#33ffff"); }, row, 1);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 800, "#33ffff"); }, row, 2);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 1600, "#33ffff");}, row, 3);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 100, "#ffb8ff"); }, row, 4);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 300, "#ffb8ff"); }, row, 5);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 500, "#ffb8ff"); }, row, 6);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 700, "#ffb8ff"); }, row, 7);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 1000, "#ffb8ff"); }, row, 8);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 2000, "#ffb8ff"); }, row, 9);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 3000, "#ffb8ff"); }, row, 10);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 5000, "#ffb8ff"); }, row, 11);
        row++;
        drawAtCell(function(x,y) { drawMsPacPoints(ctx, x,y, 100, "#fff"); }, row, 0);
        drawAtCell(function(x,y) { drawMsPacPoints(ctx, x,y, 200, "#fff"); }, row, 1);
        drawAtCell(function(x,y) { drawMsPacPoints(ctx, x,y, 500, "#fff"); }, row, 2);
        drawAtCell(function(x,y) { drawMsPacPoints(ctx, x,y, 700, "#fff"); }, row, 3);
        drawAtCell(function(x,y) { drawMsPacPoints(ctx, x,y, 1000, "#fff"); }, row, 4);
        drawAtCell(function(x,y) { drawMsPacPoints(ctx, x,y, 2000, "#fff"); }, row, 5);
        drawAtCell(function(x,y) { drawMsPacPoints(ctx, x,y, 5000, "#fff"); }, row, 6);

        row++;
        drawAtCell(function(x,y) {
            drawSnail(ctx,x,y, "#0ff");
        }, row, 0);
        drawAtCell(function(x,y) {
            drawSnail(ctx,x,y, "#FFF");
        }, row, 1);

        var drawMsOttoCells = function(row,col,dir) {
            var i;
            for (i=0; i<4; i++) { // frame
                drawAtCell(function(x,y) { drawMsOttoSprite(ctx, x,y, dir, i); }, row, col);
                col++;
            }
        };
        row++;
        drawMsOttoCells(row,0, DIR_UP);
        drawMsOttoCells(row,4, DIR_RIGHT);
        row++;
        drawMsOttoCells(row,0, DIR_DOWN);
        drawMsOttoCells(row, 4, DIR_LEFT);

        // Covid 19
        // draw hoarding goods
        row++;
        drawAtCell(function (x, y) { drawMilk(ctx, x, y); }, row, 0);
        drawAtCell(function (x, y) { drawRice(ctx, x, y); }, row, 1);
        drawAtCell(function (x, y) { drawPenne(ctx, x, y); }, row, 2);
        drawAtCell(function (x, y) { drawFarfalle(ctx, x, y); }, row, 3);
        drawAtCell(function (x, y) { drawFusilli(ctx, x, y); }, row, 4);
        drawAtCell(function (x, y) { drawToiletPaper(ctx, x, y); }, row, 5);
        drawAtCell(function (x, y) { drawToiletRoll(ctx, x, y, "#FFF"); }, row, 6);
        drawAtCell(function (x, y) { drawToiletRoll(ctx, x, y, "#DAA520" /* gold */); }, row, 7);

        var drawVirusCells = function (row, color) {
            var i, f;
            var col = 0;
            for (i = 0; i < 4; i++) { // dirEnum
                for (f = 0; f < 2; f++) { // frame
                    drawAtCell(function (x, y) { drawVirusSprite(ctx, x, y, f, i, false, false, color); }, row, col);
                    col++;
                }
            }
        };

        row++;
        drawVirusCells(row, "#FF0000");
        row++;
        drawVirusCells(row, "#FFB8FF");
        row++;
        drawVirusCells(row, "#00FFFF");
        row++;
        drawVirusCells(row, "#FFB851");

        // draw ghosts scared
        row++;
        drawAtCell(function (x, y) { drawVirusSprite(ctx, x, y, 0, DIR_UP, true, false, "#fff"); }, row, 0);
        drawAtCell(function (x, y) { drawVirusSprite(ctx, x, y, 1, DIR_UP, true, false, "#fff"); }, row, 1);
        drawAtCell(function (x, y) { drawVirusSprite(ctx, x, y, 0, DIR_UP, true, true, "#fff"); }, row, 2);
        drawAtCell(function (x, y) { drawVirusSprite(ctx, x, y, 1, DIR_UP, true, true, "#fff"); }, row, 3);

        // draw board items
        row++
        drawAtCell(function (x, y) { drawPelletSprite(ctx, x, y); }, row, 0);

        // draw tom immune
        row++;
	console.log("tom imune row",row);
        var drawCovid19TomCells = function (row, col, dir) {
            drawAtCell(function (x, y) { drawCovid19TomSprite(ctx, x, y, dir, 0); }, row, col);
            drawAtCell(function (x, y) { drawCovid19TomSprite(ctx, x, y, dir, 1); }, row, col + 1);
            drawAtCell(function (x, y) { drawCovid19TomSprite(ctx, x, y, dir, 2); }, row, col + 2);
        };
        (function () {
            var i;
            var col = 0;
            for (i = 0; i < 4; i++) {
                drawCovid19TomCells(row, col, i);
                col += 3;
            }
        })();

        // draw adele immune
        row++;
	console.log("adele imune row",row);
        var drawCovid19AdeleCells = function (row, col, dir) {
            drawAtCell(function (x, y) { drawCovid19AdeleSprite(ctx, x, y, dir, 0); }, row, col);
            drawAtCell(function (x, y) { drawCovid19AdeleSprite(ctx, x, y, dir, 1); }, row, col + 1);
            drawAtCell(function (x, y) { drawCovid19AdeleSprite(ctx, x, y, dir, 2); }, row, col + 2);
        };
        (function () {
            var i;
            var col = 0;
            for (i = 0; i < 4; i++) {
                drawCovid19AdeleCells(row, col, i);
                col += 3;
            }
        })();

        // draw junie immune
        row++;
	console.log("junie imune row",row);
        var drawCovid19JunieCells = function (row, col, dir) {
            drawAtCell(function (x, y) { drawCovid19JunieSprite(ctx, x, y, dir, 0); }, row, col);
            drawAtCell(function (x, y) { drawCovid19JunieSprite(ctx, x, y, dir, 1); }, row, col + 1);
            drawAtCell(function (x, y) { drawCovid19JunieSprite(ctx, x, y, dir, 2); }, row, col + 2);
        };
        (function () {
            var i;
            var col = 0;
            for (i = 0; i < 4; i++) {
                drawCovid19JunieCells(row, col, i);
                col += 3;
            }
        })();

        // draw astere immune
        row++;
	console.log("astere imune row",row);
        var drawCovid19AstereCells = function (row, col, dir) {
            drawAtCell(function (x, y) { drawCovid19AstereSprite(ctx, x, y, dir, 0); }, row, col);
            drawAtCell(function (x, y) { drawCovid19AstereSprite(ctx, x, y, dir, 1); }, row, col + 1);
            drawAtCell(function (x, y) { drawCovid19AstereSprite(ctx, x, y, dir, 2); }, row, col + 2);
        };
        (function () {
            var i;
            var col = 0;
            for (i = 0; i < 4; i++) {
                drawCovid19AstereCells(row, col, i);
                col += 3;
            }
        })();

	
	var drawTomCells = function(row,col,dir) {
            drawAtCell(function(x,y) { drawTomSprite(ctx, x,y, dir, Math.PI/6); }, row, col);
            drawAtCell(function(x,y) { drawTomSprite(ctx, x,y, dir, Math.PI/3); }, row, col+1);
        };
        row++;
	console.log("tom not-imune row",row);

        // draw mouth closed
        drawAtCell(function(x,y) { drawTomSprite(ctx, x,y, DIR_RIGHT, 0); }, row, 0);

        // draw directions
        (function(){
            var i;
            var col=1;
            for (i=0; i<4; i++) {
                drawTomCells(row,col,i);
                col+=2;
            }
        })();
	
	var drawAdeleCells = function(row,col,dir) {
            drawAtCell(function(x,y) { drawAdeleSprite(ctx, x,y, dir, Math.PI/6); }, row, col);
            drawAtCell(function(x,y) { drawAdeleSprite(ctx, x,y, dir, Math.PI/3); }, row, col+1);
        };
        row++;
	console.log("adele not-imune row",row);

        // draw mouth closed
        drawAtCell(function(x,y) { drawAdeleSprite(ctx, x,y, DIR_RIGHT, 0); }, row, 0);

        // draw directions
        (function(){
            var i;
            var col=1;
            for (i=0; i<4; i++) {
                drawAdeleCells(row,col,i);
                col+=2;
            }
        })();
	
	var drawJunieCells = function(row,col,dir) {
            drawAtCell(function(x,y) { drawJunieSprite(ctx, x,y, dir, Math.PI/6); }, row, col);
            drawAtCell(function(x,y) { drawJunieSprite(ctx, x,y, dir, Math.PI/3); }, row, col+1);
        };
        row++;
	console.log("junie not-imune row",row);

        // draw mouth closed
        drawAtCell(function(x,y) { drawJunieSprite(ctx, x,y, DIR_RIGHT, 0); }, row, 0);

        // draw directions
        (function(){
            var i;
            var col=1;
            for (i=0; i<4; i++) {
                drawJunieCells(row,col,i);
                col+=2;
            }
        })();
	
	var drawAstereCells = function(row,col,dir) {
            drawAtCell(function(x,y) { drawAstereSprite(ctx, x,y, dir, Math.PI/6); }, row, col);
            drawAtCell(function(x,y) { drawAstereSprite(ctx, x,y, dir, Math.PI/3); }, row, col+1);
        };
        row++;
	console.log("astere not-imune row",row);

        // draw mouth closed
        drawAtCell(function(x,y) { drawAstereSprite(ctx, x,y, DIR_RIGHT, 0); }, row, 0);

        // draw directions
        (function(){
            var i;
            var col=1;
            for (i=0; i<4; i++) {
                drawAstereCells(row,col,i);
                col+=2;
            }
        })();
	
    };

    var copyCellTo = function(row, col, destCtx, x, y,display) {
        var sx = col*size*renderScale;
        var sy = row*size*renderScale;
        var sw = renderScale*size;
        var sh = renderScale*size;

        var dx = x - size/2;
        var dy = y - size/2;
        var dw = size;
        var dh = size;

        if (display) {
            console.log(sx,sy,sw,sh,dw,dy,dw,dh);
        }

        destCtx.drawImage(canvas,sx,sy,sw,sh,dx,dy,dw,dh);
    };

    var copyGhostPoints = function(destCtx,x,y,points) {
        var row = 16;
        var col = {
            200: 0,
            400: 1,
            800: 2,
            1600: 3,
        }[points];
        if (col != undefined) {
            copyCellTo(row, col, destCtx, x, y);
        }
    };

    var copyPacFruitPoints = function(destCtx,x,y,points) {
        var row = 16;
        var col = {
            100: 4,
            300: 5,
            500: 6,
            700: 7,
            1000: 8,
            2000: 9,
            3000: 10,
            5000: 11,
        }[points];
        if (col != undefined) {
            copyCellTo(row, col, destCtx, x, y);
        }
    };

    var copyMsPacFruitPoints = function(destCtx,x,y,points) {
        var row = 17;
        var col = {
            100: 0,
            200: 1,
            500: 2,
            700: 3,
            1000: 4,
            2000: 5,
            5000: 6,
        }[points];
        if (col != undefined) {
            copyCellTo(row, col, destCtx, x, y);
        }
    };

    var copyGhostSprite = function(destCtx,x,y,frame,dirEnum,scared,flash,eyes_only,color) {
        var row,col;
        if (eyes_only) {
            row = 5;
            col = dirEnum;
        }
        else if (scared) {
            row = 5;
            col = flash ? 6 : 4;
            col += frame;
        }
        else {
            col = dirEnum*2 + frame;
            if (color == blinky.color) {
                row = 1;
            }
            else if (color == pinky.color) {
                row = 2;
            }
            else if (color == inky.color) {
                row = 3;
            }
            else if (color == clyde.color) {
                row = 4;
            }
            else {
                row = 5;
            }
        }

        copyCellTo(row, col, destCtx, x, y);
    };

    var copyMuppetSprite = function(destCtx,x,y,frame,dirEnum,scared,flash,eyes_only,color) {
        if (scared) {
            if (flash) {
                copyFruitSprite(destCtx,x,y,"cookieface");
            }
            else {
                copyFruitSprite(destCtx,x,y,"cookie");
            }
        }
        else {
            copyGhostSprite(destCtx,x,y,frame,dirEnum,scared,flash,eyes_only,color);
        }
    };

    var copyMonsterSprite = function(destCtx,x,y,frame,dirEnum,scared,flash,eyes_only,color) {
        var row,col;
        if (eyes_only) {
            row = 13;
            col = dirEnum;
        }
        else if (scared) {
            row = 13;
            col = flash ? 6 : 4;
            col += frame;
        }
        else {
            col = dirEnum*2 + frame;
            if (color == blinky.color) {
                row = 9;
            }
            else if (color == pinky.color) {
                row = 10;
            }
            else if (color == inky.color) {
                row = 11;
            }
            else if (color == clyde.color) {
                row = 12;
            }
            else {
                row = 13;
            }
        }

        copyCellTo(row, col, destCtx, x, y);
    };

    var copyVirusSprite = function (destCtx, x, y, frame, dirEnum, scared, flash, eyes_only, color) {
        if (eyes_only) {
            copyGhostSprite(destCtx, x, y, frame, dirEnum, scared, flash, eyes_only, color);
        }
        var row, col;
        if (scared) {
            row = 26;
            col = flash ? 2 : 0;
            col += frame;
        }
        else {
            col = dirEnum * 2 + frame;
            if (color == blinky.color) {
                row = 22;
            }
            else if (color == pinky.color) {
                row = 23;
            }
            else if (color == inky.color) {
                row = 24;
            }
            else if (color == clyde.color) {
                row = 25;
            }
        }

        copyCellTo(row, col, destCtx, x, y);
    }

    var copyPelletSprite = function (destCtx, x, y) {
        var row = 27;
        var col = 0;
        copyCellTo(row, col, destCtx, x, y);
    }

    var copyOttoSprite = function(destCtx,x,y,dirEnum,frame) {
        var col,row;
        if (dirEnum == DIR_UP) {
            col = frame;
            row = 14;
        }
        else if (dirEnum == DIR_RIGHT) {
            col = frame+4;
            row = 14;
        }
        else if (dirEnum == DIR_DOWN) {
            col = frame;
            row = 15;
        }
        else if (dirEnum == DIR_LEFT) {
            col = frame+4;
            row = 15;
        }
        copyCellTo(row,col,destCtx,x,y);
    };

    var copyMsOttoSprite = function(destCtx,x,y,dirEnum,frame) {
        var col,row;
        if (dirEnum == DIR_UP) {
            col = frame;
            row = 19;
        }
        else if (dirEnum == DIR_RIGHT) {
            col = frame+4;
            row = 19;
        }
        else if (dirEnum == DIR_DOWN) {
            col = frame;
            row = 20;
        }
        else if (dirEnum == DIR_LEFT) {
            col = frame+4;
            row = 20;
        }
        copyCellTo(row,col,destCtx,x,y);
    };

    var copySnail = function(destCtx,x,y,frame) {
        var row = 18;
        var col = frame;
        copyCellTo(row,col,destCtx,x,y);
    };

    var copyPacmanSprite = function(destCtx,x,y,dirEnum,frame) {
        var row = 6;
        var col;
        if (frame == 0) {
            col = 0;
        }
        else {
           col = dirEnum*2+1+(frame-1);
        }
        copyCellTo(row,col,destCtx,x,y);
    };

    var copyTomSprite = function(destCtx,x,y,dirEnum,frame) {
        var row = 32;
        var col;
        if (frame == 0) {
            col = 0;
        }
        else {
           col = dirEnum*2+1+(frame-1);
        }
        copyCellTo(row,col,destCtx,x,y);
	//drawTomSprite(destCtx, x, y, dirEnum, frame);
    };

    var copyAdeleSprite = function(destCtx,x,y,dirEnum,frame) {
        var row = 33;
        var col;
        if (frame == 0) {
            col = 0;
        }
        else {
           col = dirEnum*2+1+(frame-1);
        }
        copyCellTo(row,col,destCtx,x,y);
	//drawAdeleSprite(destCtx, x, y, dirEnum, frame);
    };

    var copyJunieSprite = function(destCtx,x,y,dirEnum,frame) {
        var row = 34;
        var col;
        if (frame == 0) {
            col = 0;
        }
        else {
           col = dirEnum*2+1+(frame-1);
        }
        copyCellTo(row,col,destCtx,x,y);
	//drawJunieSprite(destCtx, x, y, dirEnum, frame);
    };

    var copyAstereSprite = function(destCtx,x,y,dirEnum,frame) {
        var row = 35;
        var col;
        if (frame == 0) {
            col = 0;
        }
        else {
           col = dirEnum*2+1+(frame-1);
        }
        copyCellTo(row,col,destCtx,x,y);
	//drawAstereSprite(destCtx, x, y, dirEnum, frame);
    };

    var copyCovid19TomSprite = function (destCtx, x, y, dirEnum, frame, ignore, energized) {
        // for non in game cases show mask all the time
        // if energized pac man has mask
        if (energized == undefined || energized == true) {
            var row = 28;
            var col = dirEnum * 3 + frame;
            copyCellTo(row, col, destCtx, x, y);
        }
        else {
            // normal pacman in other cases
            //copyPacmanSprite(destCtx, x, y, dirEnum, frame);
	    //drawTomSprite(destCtx, x, y, dirEnum, frame);
	    copyTomSprite(destCtx, x, y, dirEnum, frame);
        }
    };

    var copyCovid19AdeleSprite = function (destCtx, x, y, dirEnum, frame, ignore, energized) {
        // for non in game cases show mask all the time
        // if energized pac man has mask
        if (energized == undefined || energized == true) {
            var row = 29;
            var col = dirEnum * 3 + frame;
            copyCellTo(row, col, destCtx, x, y);
        }
        else {
            // normal pacman in other cases
            //copyPacmanSprite(destCtx, x, y, dirEnum, frame);
	    //drawAdeleSprite(destCtx, x, y, dirEnum, frame);
	    copyAdeleSprite(destCtx, x, y, dirEnum, frame);
        }
    };

    var copyCovid19JunieSprite = function (destCtx, x, y, dirEnum, frame, ignore, energized) {
        // for non in game cases show mask all the time
        // if energized pac man has mask
        if (energized == undefined || energized == true) {
            var row = 30;
            var col = dirEnum * 3 + frame;
            copyCellTo(row, col, destCtx, x, y);
        }
        else {
            // normal pacman in other cases
            //copyPacmanSprite(destCtx, x, y, dirEnum, frame);
	    //drawJunieSprite(destCtx, x, y, dirEnum, frame);
	    copyJunieSprite(destCtx, x, y, dirEnum, frame);
        }
    };
    
    var copyCovid19AstereSprite = function (destCtx, x, y, dirEnum, frame, ignore, energized) {
        // for non in game cases show mask all the time
        // if energized pac man has mask
        if (energized == undefined || energized == true) {
            var row = 31;
            var col = dirEnum * 3 + frame;
            copyCellTo(row, col, destCtx, x, y);
        }
        else {
            // normal pacman in other cases
            //copyPacmanSprite(destCtx, x, y, dirEnum, frame);
	    //drawAstereSprite(destCtx, x, y, dirEnum, frame);
	    copyAstereSprite(destCtx, x, y, dirEnum, frame);
        }
    };

    var copyMsPacmanSprite = function(destCtx,x,y,dirEnum,frame) {
        // TODO: determine row, col
        //copyCellTo(row,col,destCtx,x,y);
        var row = 7;
        var col = dirEnum*3+frame;
        copyCellTo(row,col,destCtx,x,y);
    };

    var copyCookiemanSprite = function(destCtx,x,y,dirEnum,frame) {
        var row = 8;
        var col = dirEnum*3+frame;
        copyCellTo(row,col,destCtx,x,y);
    };

    var copyFruitSprite = function (destCtx, x, y, name) {
        var fruits = {
            "cherry": [0, 0],
            "strawberry": [0, 1],
            "orange": [0, 2],
            "apple": [0, 3],
            "melon": [0, 4],
            "galaxian": [0, 5],
            "bell": [0, 6],
            "key": [0, 7],
            "pretzel": [0, 8],
            "pear": [0, 9],
            "banana": [0, 10],
            "cookie": [0, 11],
            "cookieface": [0, 12],
            // covid19 fruits
            'milk': [21, 0],
            'rice': [21, 1],
            'penne': [21, 2],
            'farfalle': [21, 3],
            'fusilli': [21, 4],
            'toilet paper': [21, 5],
            'toilet roll': [21, 6],
            'golden roll': [21, 7],
        };

        var row = fruits[name][0];
        var col = fruits[name][1];

        copyCellTo(row,col,destCtx,x,y);
    };

    return {
        create: create,
        getCanvas: function() { return canvas; },
        drawGhostSprite: copyGhostSprite,
        drawMonsterSprite: copyMonsterSprite,
        drawMuppetSprite: copyMuppetSprite,
        drawOttoSprite: copyOttoSprite,
        drawMsOttoSprite: copyMsOttoSprite,
        drawPacmanSprite: copyPacmanSprite,
        drawTomSprite: copyTomSprite,
        drawAdeleSprite: copyAdeleSprite,
        drawJunieSprite: copyJunieSprite,
        drawAstereSprite: copyAstereSprite,
        drawMsPacmanSprite: copyMsPacmanSprite,
        drawCookiemanSprite: copyCookiemanSprite,
        drawFruitSprite: copyFruitSprite,
        drawGhostPoints: copyGhostPoints,
        drawPacFruitPoints: copyPacFruitPoints,
        drawMsPacFruitPoints: copyMsPacFruitPoints,
        drawSnail: copySnail,
        drawCovid19TomSprite: copyCovid19TomSprite,
        drawCovid19AdeleSprite: copyCovid19AdeleSprite,
        drawCovid19JunieSprite: copyCovid19JunieSprite,
        drawCovid19AstereSprite: copyCovid19AstereSprite,
        drawVirusSprite: copyVirusSprite,
        drawPelletSprite: copyPelletSprite,
    };
})();
