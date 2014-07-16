/*********************************************************
Data table tab  
*********************************************************/

function getULSWindCategory(indexVal) {
    "use strict";
    var uls = [0.80, 1.00, 1.15, 1.25];
    return uls[indexVal];
}



function getSLSWindCategory() {
    "use strict";
    var sls = [0.75, 0.75, 0.75, 0.75];
    return sls;
}


function getWindCategoryName() {
    "use strict";
    var name = [{tName: "Low", tValue: 1},
                {tName: "Normal", tValue: 2},
                {tName: "High", tValue: 3},
                {tName: "Post-disaster", tValue: 4}];
    return name;
}


function getLimitStatesWind() {
    "use strict";
    var limit = [{tName: "Ultimate Limit States", tValue: 1},
                 {tName: "Serviceability Limit States", tValue: 2}];
    return limit;
}


function getTerrainType() {
    var terrain = [{tName: "Open (static); Exposure A (dynamic)", tValue: 1},
                   {tName: "Rough (static); Exposure B (dynamic)", tValue: 2}];
    return terrain;
}

function getLoadTypes() {
    var terrain = [{tName: "Principal Load", tValue: 1},
                   {tName: "Companion Load", tValue: 2}];
    return terrain;
}

function getProcedure(indexVal) {
    var procedure = [{tName: "Static Procedure", tValue: 1},
                     {tName: "Dynamic Procedure", tValue: 2}];
    return procedure;   
}


function getHill(){
    var hill = [{tName: "No hill", tValue: 0},
                {tName: "2-dimensional ridge", tValue: 1},
                {tName: "2-dimensional escarpments", tValue: 2},
                {tName: "3-dimensional axi-symmetrical hill", tValue: 3}];
    return hill;
}

/********************************************************
Wind Tab formulas
**********************************************************/
function getFloorCode(nextHsM, currHsM){
    var choice = null;
    if(currHsM > 0){
        if(nextHsM === 0)
            choice = 2;
        else
            choice = 1;
    }else
        choice = 0;
    return choice;
}


function getEffectiveWidthHi(sum, floorCode){
    var choice = null;
    if(floorCode > 0)
        choice = sum;
    else
        choice = 0;
    return choice;
}

function getEffectiveWidthHiDXi(wxM,hi){
    var choice = null;
    choice = wxM * hi;
    return choice;
}

function getEffectiveWidthHiDYi(wyM,hi){
    var choice = null;
    choice = wyM * hi;
    return choice;
}

function getHillSpeedUp(floorCode,hillOption,hh,lh,deltaSMax,xHill,kHill, alphaHill,hi){
    var choice = null;
    var part1, part2, part3, part4;
    if(floorCode > 0){
        if(hillOption === 0)
            choice = 1;
        else {
                if(hh/lh > 0.5){
                    part1 = 1;
                    part2 = deltaSMax*(1-Math.abs(xHill)/(kHill*2*hh));
                    part3 = Math.exp( (-1)*( alphaHill*(hi/(2*hh)) ) );
                    part4 = Math.pow(part1 + part2 * part3,2);
                }else{
                    part1 = 1;
                    part2 = deltaSMax*(1-Math.abs(xHill)/(kHill*lh));
                    part3 = Math.exp((-1)*( alphaHill*(hi/lh) ) );
                    part4 = Math.pow(part1 + part2 * part3,2);
                }
                choice = Math.max(1,part4);
        }
    }else
        choice = 0;         
    return choice;  
}

function getWindwardStaticCe(floorCode,terrainType,hi){
    var choice = null;
    if(floorCode > 0) 
        if(terrainType === 1)
            choice = Math.max.apply( Math.pow((hi/10),0.2), 0.9);
        else
            choice = Math.max.apply( Math.pow(0.7*(hi/12),0.3), 0.7 );
    else
        choice = 0;

    return choice;
}

function getWindwardDynamicCe(floorCode,terrainType, hi){
    var choice = null;
    if(floorCode > 0)
        if(terrainType ===1)
            Math.min.apply(Math.max.apply( Math.pow((hi/10), 0.28), 1), 2.5);
        else
            Math.min.apply(Math.max.apply( Math.pow(0.5*(hi/12.7),0.5), 0.5),2.5);
    else
        choice = 0;
    return choice;
}

function getWindwardSelectedCorrected(procedureWind,staticWindCe,dynamicWindCe,hillSpeedUpCe){
    var choice = null;
    if(procedureWind === 1)
        choice = staticWindCe*hillSpeedUpCe;
    else
        choice = dynamicWindCe*hillSpeedUpCe;
    return choice;
}

function getLeewardStaticCe(floorCode,terrainType,totalHeight){
    var choice = null;
    if(floorCode > 0)
        if(terrainType === 1)
            choice = Math.max.apply( Math.pow((totalHeight/2/10),0.2),0.9);
        else
            choice = Math.max.apply( Math.pow(0.7*(totalHeight/2/12),0.3),0.7);
    else
        choice = 0;
    return choice;
}

function getLeewardDynamic(floorCode,terrainType,totalHeight){
    var choice = null;
    if(floorCode > 0)
        if(terrainType === 1)
            choice = Math.min.apply(Math.max.apply( Math.pow((totalHeight/2/10),0.28), 1), 2.5);
        else
            choice = Math.min.apply(Math.max.apply( Math.pow(0.5*(totalHeight/2/12.7), 0.5), 0.5), 2.5);
    else
        choice = 0;
    return choice;
}

function getLeewardSelectedCorrected(procedureWind,staticWindCe,dynamicWindCe,hillSpeedUpCe){
    var choice = null;
    if(procedureWind === 1)
        choice = staticWindCe * hillSpeedUpCe;
    else
        choice = dynamicWindCe * hillSpeedUpCe;
    return choice;
}

function getXDirectionStaticCg(floorCode){
    var choice = null;
    if(floorCode > 0)
        choice = 2;
    else
        choice = 0;
    return choice;
}

function getXDirectionDynamicCg(floorCode, cgDynamicX){
    var choice = null;
    if(floorCode > 0)
        choice = cgDynamicX;
    else
        choice = 0;
    return choice;
}

function getXDirectionSelectedCg(procedureWind, staticCg,dynamicCg){
    var choice = null;
    if(procedureWind===1)
        choice = AL21;
    else
        choice = AM21;
    return choice;
}

function getXDirectionSelectedCorrected(floorCode,xSelectedCg,hillSpeedUpCe){
    var choice = null;
    if(floorCode > 0)
        choice = 1+(xSelectedCg-1)*Math.pow((hillSpeedUpCe),-0.5);
    else
        choice = 0;
    return choice;
}

function getYDirectionStaticCg(floorCode){
    var choice = null;
    if(floorCode > 0)
        choice = 2;
    else
        choice = 0;
    return choice;
}

function getYDirectionDynamicCg(floorCode, cgDynamicY){
    var choice = null;
    if(floorCode > 0)
        choice = cgDynamicY;
    else
        choice = 0;
    return choice;
}

function getYDirectionSelectedCg(procedureWind, staticCg, dynamicCg){
    var choice = null;
    if(procedureWind === 1)
        choice = staticCg;
    else
        choice = dynamicCg;
    return choice;
}

function getYDirectionSelectedCorrected(floorCode,ySelectedCg, hillSpeedUpCe){
    var choice;
    if(floorCode > 0)
        choice = 1+(ySelectedCg-1)*(Math.pow((hillSpeedUpCe),-0.5));
    else
        choice = 0;
    return choice;
}

/*******************************************************
 Wind Tab formulas - Building Forces and Overturning - Output
********************************************************/

function getSecondFloorCode(currWindwardSelCe, nextWindwardSelCe){
    var choice = null;
    if(currWindwardSelCe > 0)
        if(nextWindwardSelCe === 0)
            choice = 2;
        else
            choice = 1;
    else
        choice = 0;
    return choice;
}

function getTributaryHeightWindAbove(hsM,secFloorCode,parapet){
    var choice = null;
    if(secFloorCode === 2)
        choice = hsM/2 + Parapet;
    else
        choice = hsM/2;
    return choice;
}

function getTributaryHeightWindBelow(hsM){
    var choice = null;
    choice = hsM/2;
    return choice;
}

function getDXabove(secFloorCode, currWxM, prevWxM){
    var choice = null;
    if(secFloorCode === 2)
        choice = currWxM;
    else
        choice = prevWxM;
    return choice;
}

function getDYabove(secFloorCode, currWyM, prevWyM){
    var choice = null;
    if(secFloorCode === 2)
        choice = currWyM;
    else
        choice = prevWyM;
    return choice;
}

function getTributaryAx(dXAbove,hWindAbove,dXBelow,hWindBelow){
    var choice = null;
    choice = dXAbove*hWindAbove + dXBelow*hWindBelow;
    return choice;
}

function getTributaryAy(dYAbove,hWindAbove,dYBelow,hWindBelow){
    var choice = null;
    choice = dYAbove*hWindAbove + dYBelow*hWindBelow;
    return choice;
}

function getXWindPressure(factorWind,refVelPressure,selCe,xDirSel,cpXWind){
    var choice = null;
    choice = factorWind*refVelPressure*selCe*xDirSel*cpXWind;
    return choice;
}

function getXLeePressure(factorWind,refVelPressure,selCe,xDirSel,cpXLee){
    var choice = null;
    choice = factorWind*refVelPressure*selCe*xDirSel*cpXLee;
    return choice;
}

function getYWindPressure(factorWind,refVelPressure,selCe,yDirSel,cpyWind){
    var choice = null;
    choice = factorWind*refVelPressure*selCe*yDirSel*cpYWind;
    return choice;
}

function getYLeePressure(factorWind,refVelPressure,selCe,yDirSel,cpYLee){
    var choice = null;
    choice = factorWind*refVelPressure*selCe*yDirSel*cpYLee;
    return choice;
}

function getTotalForceXDirection(xWindPressure,xLeePressure,tributaryAx){
    var choice = null;
    choice = (xWindPressure-xLeePressure)*tributaryAx;
    return choice;
}

function getTotalForceYDirection(yWindPressure,yLeePressure,tributaryAy){
    var choice = null;
    choice = (yWindPressure-yLeePressure)*tributaryAy;
    return choice;
}

function getTotalOverTurningMomentHi(prevSecFloorCode,currHi,prevHi, parapet) {
    var choice = null;
    if(prevSecFloorCode === 2)
        choice = prevHi+parapet/2;
    else
        choice = currHi;
    return choice;
}

function getTotalOverTurningMomentXDir(prevSecFloorCode,prevTotalShearXDir, currTotalShearXDir, parapet, totalOverTurningMomentHi, prevTotalMomentHi, prevHsWindBelow, nextTotalOverTurningMomentXDir){
    var choice = null;
    if(prevSecFloorCode === 2)
        choice = prevTotalShearXDir*(parapet/(parapet+prevHsWindBelow))*(totalOverTurningMomentHi-prevTotalMomentHi);
    else
        choice = nextTotalOverTurningMomentXDir+currTotalShearXDir*(totalOverTurningMomentHi-prevTotalMomentHi);
    return choice;
}


function getTotalOverTurningMomentYDir(prevSecFloorCode,prevTotalShearYDir, currTotalShearYDir, parapet, totalOverTurningMomentHi, prevTotalMomentHi, prevHsWindBelow, nextTotalOverTurningMomentYDir){
    var choice = null;
    if(prevSecFloorCode === 2)
        choice = prevTotalShearYDir*(parapet/(parapet+prevHsWindBelow))*(totalOverTurningMomentHi-prevTotalMomentHi);
    else
        choice = nextTotalOverTurningMomentYDir+currTotalShearYDir*(totalOverTurningMomentHi-prevTotalMomentHi);
    return choice;
}


function getCpXWindward(totalHeight, baseDimensionY) {
    var choice = null;
    if(totalHeight/baseDimensionY < 0.25)
            choice = 0.6;
    else
        if(totalHeight/baseDimensionY < 1)
            choice = 0.27*(totalHeight/baseDimensionY+2);
        else
            choice = 0.8;
    return choice;
}

function getCpXLeeward(totalHeight,baseDimensionY){
    var choice = null;
    if(totalHeight/baseDimensionY < 0.25)
        choice = -0.3;
    else
        if(totalHeight/baseDimensionY < 1)
            choice = -0.27*(totalHeight/baseDimensionY+0.88);
        else
            choice = -0.5;
    return choice;
}

function getCpYWindward(totalHeight,baseDimensionX){
    var choice = null;
    if(totalHeight/baseDimensionX<0.25)
        choice = 0.6;
    else
        if(totalHeight/baseDimensionX<1)
            choice = 0.27*(totalHeight/baseDimensionX+2);
        choice = 0.8;
    return choice;
}

function getCpYWindward(totalHeight,baseDimensionX){
    var choice = null;
    if(totalHeight/baseDimensionX<0.25)
        choice = -0.3;
    else
        if(totalHeight/baseDimensionX<1)
            choie = -0.27*(totalHeight/baseDimensionX+0.88);
        else
            choice = -0.5;
    return choice;
}

function getWindLoadFactor(limitStatesWind,loadType){
    var choice = null;
    if(limitStatesWind === 2)
        choice = 1;
    else
        if(loadType === 2)
            choice = 0.4;
        else
            choice = 1.4;
    return choice;
}

function getLevelFXDir(floorCode, totalForceXDir, windLoadFactor){
    var choice = null;
    if(floorCode > 0)
        choice = totalForceXDir*windLoadFactor;
    else
        choice = "";
    return choice;
}

function getLevelVXDir(floorCode, totalShearXDir, windLoadFactor){
    var choice = null;
    if(floorCode > 0)
        chocie = totalShearXDir*windLoadFactor;
    else
        choice = "";
    return choice;
}

function getLevelMXDir(floorCode, totalOverturningMomentXDir, windLoadFactor){
    var choice = null;
    if(floorCode > 0)
        choice = totalOverturningMomentXDir*windLoadFactor;
    else
        choice = "";
    return choice;
}

function getLevelFYDir(floorCode, totalForceYDir, windLoadFactor){
    var choice = null;
    if(floorCode > 0)
        choice = totalForceYDir*windLoadFactor;
    else
        choice = "";
    return choice;
}

function getLevelVYDir(floorCode, totalShearYDir, windLoadFactor){
    var choice = null;
    if(floorCode > 0)
        chocie = totalShearYDir*windLoadFactor;
    else
        choice = "";
    return choice;
}

function getLevelMYDir(floorCode, totalOverturningMomentYDir, windLoadFactor){
    var choice = null;
    if(floorCode > 0)
        choice = totalOverturningMomentYDir*windLoadFactor;
    else
        choice = "";
    return choice;
}

function getKHill(xHill, pick){
    var choice = null;
    if(pick === 1 || pick ===3)
        choice = 1.5;
    else if(pick === 2)
        if(xHill < 0)
            choice = 1.5;
        else
            choice = 4;
    return choice;
}

function getAlphaHill(pick){
    var choice = null;
    if(pick === 1)
        choice = 3;
    else if(pick === 2)
        choice = 2.5;
    else if(pick === 3)
        choice = 4;
    return choice;
}

function get2Dimensional(hh,lh,xHill){
    var choice = [0,3,0];
    if(hh/lh>0.5)
        choice[0] =2.2*0.5;
    else
        chocie[0] =2.2*hh/lh;
    if(xHill<0)
        choice[2] = 1.5;
    else
        choice[2]= 1.5;
    return choice;
}
function get2DimensionalEscarpments(hh,lh,xHill){
    var choice = [0,2.5,0];
    if(hh/lh > 0.5)
        choice[0] = 1.3*0.5;
    else
        choice[0] = 1.3*hh/lh;

    if(xHill < 0)
        choice[2] = 1.5;
    else
        choice[2] = 4;
    return choice;
}
function get3Dimensional(hh,lh,xHill){
    var choice = [0,4,0];
    if(hh/lh > 0.5)
        choice[0] = 1.6*0.5;
    else
        choice[0] = 1.6*hh/lh;

    if(xHill < 0)
        choice[2] = 1.5;
    else 
        choice[2] = 1.5;
    return choice;
}

/********************************************************************
Dynamic X Tab formulas
********************************************************************/

// B
function getBackGroundTurbulence(sumOfArea) {
    var choice = null;
    choice = 4/3*sumOfArea;
    return choice;
}


// V bar
function getReferenceWindSpeed(factorWind,q150) {
    var choice = null;
    choice = 39.2*Math.sqrt(factorWind*q150);
    return choice;
}

// V h
function getMeanWindSpeedTopOfStructure(refWindSpeed,exposureFactorTop) {
    var choice = null;
    choice = refWindSpeed*Math.sqrt(exposureFactorTop);
    return choice;
}

// w / H
function getw_hAspectRatio(heightWindwardFace, effectiveWidthWindward) {
    var choice = null;
    choice = effectiveWidthWindward / heightWindwardFace;
    return choice;
}

// x0
function getGustEnergyRatioX0(w_hAspectRatio) {
    var choice = null;
    choice = 1220*w_hAspectRatio;
    return choice;
}

// F
function getGustEnergyRatioF(gustEnergyRatioX0) {
    var choice = null;
    choice = Math.pow(gustEnergyRatio,2)/Math.pow((1+Math.pow(gustEnergyRatio,2)),(4/3));
    return choice;
}

// f nd / V h
function getWaveNumber(naturalFrequency, meanWindSpeed) {
    var choice = null;
    choice = naturalFrequency / meanWindSpeed;
    return choice;
}

//f nd H / V h
function getReducedFrequency(naturalFrequency, heightWindwardFace, meanWindSpeed) {
    var choice = null;
    choice = naturalFrequency*heightWindwardFace/meanWindSpeed;
    return choice;
}

// s
function getSizeReductionFactor(reducedFrequency, naturalFrequency, effectiveWidthWindward, meanWindSpeed){
    var choice = null;
    choice = Math.PI/3*(1/(1+8/3*reducedFrequency))*(1/(1+10*naturalFrequency*effectiveWidthWindward/meanWindSpeed));
    return choice;
}

// v
function getAverageFluctationRate(naturalFrequency, sizeReductionFactor, gustEnergyRatioF, dampingRatio, backGroundTurbulence){
    var choice = null;
    choice = naturalFrequency*Math.sqrt(sizeReductionFactor*gustEnergyRatioF/(sizeReductionFactor*gustEnergyRatioF+dampingRatio*backGroundTurbulence));
    return choice;
}

//  s / m
function getCoefficient_s_m(surfaceRouhgness, exposureFactorTop, backGroundTurbulence, sizeReductionFactor, gustEnergyRatioF){
    var choice = null;
    choice = Math.sqrt(surfaceRouhgness/exposureFactorTop*(backGroundTurbulence+sizeReductionFactor*gustEnergyRatioF/M7));
    return choice;
}

// g p
function getPeakFactor(averageFluctuation){
    var choice = null;
    choice = Math.sqrt(2*Math.log(averageFluctuation*3600))+0.577/Math.sqrt(2*Math.log(averageFluctuation*3600));
    return choice;
}

// C g
function getGustEffectFactor(peakFactor, coeffiecient_s_m){
    var choice = null;
    choice = 1 + peakFactor * coeffiecient_s_m;
    return choice;
}

// x
function getTrapeZoidalX(currStep, integration){
    var choice = null;
    choice = currStep / 1000 * integration;
    return choice;
}

// f(x)
function getTrapeZoidalFx(currX, heightWindwardFace, effectiveWidthWindward){
    var choice = null;
    choice = (1/(1+currX*heightWindwardFace/457))*(1/(1+currX*effectiveWidthWindward/122))*(currX/Math.pow((1+Math.pow(currX,2)),(4/3)));
    return choice;
}

// Area
function getTrapeZoidalArea(currX, prevX, currFx, prevFx){
    var choice = null;
    choice = (currX-prevX)*(prevFx+prevFx)/2;
    return choice;
}

// function get(){
//  var choice = null;
//  return choice;
// }

//
