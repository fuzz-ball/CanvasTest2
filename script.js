const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(canvas);
console.log(ctx);
window.addEventListener('resize',function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const mouse = {x: null, y: null};
let drawing = [];
let line = [];
let isDrawing = false;
let intersections = [];
let intersectionLines = [];
let intersectionSelect = 0;
let intersectionsObject = [];
let testPointA = [310,10];
let testPointB = [610,310];
let testPointC = [610,10];
let testPointD = [310,310];
let selectedTestPoint = null;
let testPoints = [testPointA,testPointB,testPointC,testPointD];
testPoints[0][0]=460;

function incrementIntersectionSelect(){
    if (intersectionSelect < intersections.length -1) intersectionSelect++; else { intersectionSelect = 0}
}
function decrementIntersectionSelect(){
    //console.log("333");
    if (intersectionSelect > 0) {
        intersectionSelect--
        //console.log("ddd");
    }
    else {
        intersectionSelect = intersections.length -1;
    }
}

function findIntersections(){
    intersectionSelect = 0;
    intersections = [];
    intersectionLines = [];
    //console.log("herello");
    for (let i = 0;i < drawing.length;i++){
        let polyLineA = drawing[i];
        for (let j = 0;j < (polyLineA.length - 1);j++){
            //polyLineA[j]
            //polyLineA[j+1]
            for (let k = (j+2);k<(polyLineA.length -1);k++){
                //polyLineA[j]
                //polyLineA[j+1]
                let intersection = segmentIntersection(polyLineA[j],polyLineA[j+1],polyLineA[k],polyLineA[k+1]);
                if (intersection.isIntersecting){
                    //console.log(intersections);
                    intersections.push(intersection.intersectionPoint);
                    intersectionLines.push([polyLineA[j],polyLineA[j+1],polyLineA[k],polyLineA[k+1]]);
                    intersectionsObject.push(intersection);
                }
            }
            for (let k = (i+1);k<(drawing.length);k++){
                let polyLineB = drawing[k];
                for (let l = 0;l<(polyLineB.length-1);l++){
                    let intersection = segmentIntersection(polyLineA[j],polyLineA[j+1],polyLineB[l],polyLineB[l+1]);
                    if (intersection.isIntersecting){
                        //console.log(intersections);
                        intersections.push(intersection.intersectionPoint);
                        intersectionLines.push([polyLineA[j],polyLineA[j+1],polyLineB[l],polyLineB[l+1]]);
                        intersectionsObject.push(intersection);
                    }
                }
            }
        }
    }
};

function segmentIntersection(pointA,pointB,pointC,pointD){
    let Ax = pointA[0];
    let Ay = pointA[1];
    let Bx = pointB[0];
    let By = pointB[1];
    let Cx = pointC[0];
    let Cy = pointC[1];
    let Dx = pointD[0];
    let Dy = pointD[1];
    //let commonDenominator = ((Dx-Cx)*(By-Ay))-((Dy-Cy)*(Bx-Ax));
    //let alphaNumerator = ((Ax-Cx)*(Dy-Cy))-((Ay-Cy)*(Dx-Cx));
    //let betaNumerator = ((Cy-Ay)*(Bx-Ax))-((Cx-Ax)*(By-Ax));

    let commonDenominator = ((Ax-Bx)*(Cy-Dy))-((Ay-By)*(Cx-Dx));
    let alphaNumerator = ((Ax-Cx)*(Cy-Dy))-((Ay-Cy)*(Cx-Dx));
    let betaNumerator = ((Ay-By)*(Ax-Cx))-((Ax-Bx)*(Ay-Cy));

    let alpha = alphaNumerator/commonDenominator;
    let beta = betaNumerator/commonDenominator;
    //if denominator = 0 then paralel
    //if denominator = numberator = 0 then colinear
    let result = {

    };
    if ((0 <= alpha)&&(alpha <= 1)&&(0 <= beta)&&(beta <= 1)){
        result.isIntersecting = true;
        result.intersectionPoint = lerp(pointA,pointB,alpha);
        result.alpha = alpha;
        result.beta = beta;
    }
    else {
        result.isIntersecting = false;
        result.intersectionPoint = [undefined,undefined];
    }

    return result;
}

function lerp(pointA,pointB,value){
    return([pointA[0]+((pointB[0]-pointA[0])*value),pointA[1]+((pointB[1]-pointA[1])*value)]);
}

canvas.addEventListener("pointermove",function(e){
    //console.log(e);
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
});

canvas.addEventListener("pointerdown",function(){
    for (let i = 0;i <testPoints.length;i++){
        if (distance(testPoints[i],[mouse.x,mouse.y])<20){
            selectedTestPoint = testPoints[i];
           return;
        }
    }
    isDrawing = true;
    line.push([mouse.x,mouse.y]);
});

function distance(point1,point2){
    return Math.sqrt(((point2[0]-point1[0])**2)+(point2[1]-point1[1])**2);
}


document.addEventListener("keydown",function(e){
    if (e.key == 'z'){
        console.log("herro");
        drawing.pop();
    }
});

canvas.addEventListener("pointerup",function(){
    selectedTestPoint = null;
    isDrawing = false;
    if (line.length > 1){
        drawing.push(line);
    }
    line = [];
});

function animate(){
    ctx.lineJoin ="round";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (isDrawing){
        //console.log(line);
        //console.log((((line[line.length-1][0] - mouse.x)**2) + ((line[line.length-1][1]-mouse.y)**2)));
        if ((((line[line.length-1][0] - mouse.x)**2) + ((line[line.length-1][1]-mouse.y)**2))>50) line.push([mouse.x,mouse.y]);

    }
    if (selectedTestPoint != null){
        selectedTestPoint[0] = mouse.x;
        selectedTestPoint[1] = mouse.y;
    }
    ctx.beginPath();
    for (let i = 0;i < drawing.length; i++){
        let tempLine = drawing[i];
        ctx.moveTo(tempLine[0][0],tempLine[0][1]);
        for (let j = 1;j< tempLine.length;j++){
            ctx.lineTo(tempLine[j][0],tempLine[j][1]);
        }
    }
    ctx.stroke();
    if (line.length > 1){
        ctx.beginPath();
        ctx.lineTo(line[0][0],line[0][1]);
        for (let i = 1;i<line.length;i++){
            ctx.lineTo(line[i][0],line[i][1]);
        }
        ctx.stroke();
    }

    ctx.lineWidth = 3;


    for(var i =0;i<intersections.length;i++){
        ctx.strokeStyle = "red";
        if (i == intersectionSelect ) ctx.strokeStyle = "yellow";
        ctx.beginPath();
        ctx.arc(intersections[i][0],intersections[i][1],5,0,2*Math.PI);
        ctx.stroke();
    };

    ctx.lineWidth = 3;

    if (intersections.length > intersectionSelect){
        ctx.strokeStyle = "#ff3333";
        ctx.beginPath();
        ctx.moveTo(intersectionLines[intersectionSelect][0][0],intersectionLines[intersectionSelect][0][1]);
        ctx.lineTo(intersectionLines[intersectionSelect][1][0],intersectionLines[intersectionSelect][1][1]);
        ctx.stroke();

        ctx.strokeStyle = "#3333ff";
        ctx.beginPath();
        ctx.moveTo(intersectionLines[intersectionSelect][2][0],intersectionLines[intersectionSelect][2][1]);
        ctx.lineTo(intersectionLines[intersectionSelect][3][0],intersectionLines[intersectionSelect][3][1]);
        ctx.stroke();
    }
    //document.getElementById("intersectionInformation").innerHTML = JSON.stringify(intersectionsObject[intersectionSelect]);
    if (intersections.length != 0)
    document.getElementById("intersectionSelect").innerHTML = (intersectionSelect +1 +"/"+ (intersections.length));
    else document.getElementById("intersectionSelect").innerHTML = ("0/0")

    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(testPointA[0],testPointA[1],20,0,2*Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(testPointB[0],testPointB[1],20,0,2*Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(testPointC[0],testPointC[1],20,0,2*Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(testPointD[0],testPointD[1],20,0,2*Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(testPointA[0],testPointA[1]);
    ctx.lineTo(testPointB[0],testPointB[1]);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(testPointC[0],testPointC[1]);
    ctx.lineTo(testPointD[0],testPointD[1]);
    ctx.stroke();

    let testIntersectionPoint = segmentIntersection(testPointA,testPointB,testPointC,testPointD).intersectionPoint;
    ctx.beginPath();
    ctx.arc(testIntersectionPoint[0],testIntersectionPoint[1],20,0,2*Math.PI);
    ctx.stroke();


    requestAnimationFrame(animate);
}

animate();
