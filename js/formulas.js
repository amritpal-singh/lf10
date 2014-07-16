/****************************************************
General Functions
*****************************************************/
function between(lowNum, highNum, value){
    "use strict";
    var choice = null;
    var tmp = null;
    if(lowNum > highNum){
        tmp = lowNum;
        lowNum = highNum;
        highNum = tmp;
    }
    if(value > lowNum  && value < highNum)
        choice = true;
    else if( value === lowNum || value === highNum)
        choice = true;
    else
        choice = false;
    return choice;
}

function roundVal(currNumber,decimalPlaces){
    "use strict";
    var choice = null;
    var placement = 1 * Math.pow(10,decimalPlaces);
    choice = Math.round(currNumber * placement) / placement;
    return choice;
}

function roundArr(arr, decimalPlaces){
    "use strict";
    var size = arr.length;
    var choice = arr;
    for(var i = 0; i<=size-1; i++){
        choice[i] = roundVal(choice[i],decimalPlaces);
    }
    return choice;
}
/*********************************************************
Data table tab  
*********************************************************/

function getULSWindCategory(indexVal) {
    "use strict";
    var uls = [0.80, 1.00, 1.15, 1.25];
    return uls[indexVal];
}



function getSLSWindCategory(indexVal) {
    "use strict";
    var sls = [0.75, 0.75, 0.75, 0.75];
    return sls[indexVal];
}


function getWindCategoryName(observable) {
    "use strict";
    var selected = {tName: "Normal", tValue: 2};
    var name = [{tName: "Low", tValue: 1},
                selected,
                {tName: "High", tValue: 3},
                {tName: "Post-disaster", tValue: 4}];
    observable(selected);
    return name;
}


function getLimitStatesWind() {
    "use strict";
    var limit = [{tName: "Ultimate Limit States", tValue: 1, tOutput: 1.0},
                 {tName: "Serviceability Limit States", tValue: 2, tOutput: 0.75}];
    return limit;
}


function getTerrainType() {
    "use strict";
    var terrain = [{tName: "Open (static); Exposure A (dynamic)", tValue: 1, surface: 0.08},
                   {tName: "Rough (static); Exposure B (dynamic)", tValue: 2, surface: 0.1}];
    return terrain;
}

function getLoadTypes() {
    "use strict";
    var terrain = [{tName: "Principal Load", tValue: 1, tOutput: 1.4},
                   {tName: "Companion Load", tValue: 2, tOutput: 0.4}];
    return terrain;
}

function getProcedure(observable) {
    "use strict";
    var selected = {tName: "Static Procedure", tValue: 1};
    var procedure = [selected,
                     {tName: "Dynamic Procedure", tValue: 2}];
    observable(selected);
    return procedure;
}


function getHill() {
    "use strict";
    var hill = [{tName: "No hill", tValue: 0},
                {tName: "2-dimensional ridge", tValue: 1},
                {tName: "2-dimensional escarpments", tValue: 2},
                {tName: "3-dimensional axi-symmetrical hill", tValue: 3}];
    return hill;
}

/********************************************************
Wind Tab formulas
**********************************************************/
function getFloorCode(nextHsM, currHsM) {
    "use strict";
    var choice = null;
    if (currHsM > 0) {
        if (nextHsM === 0) {
            choice = 2;
        } else {
            choice = 1;
        }
    } else {
        choice = 0;
    }
    return choice;
}


function getEffectiveWidthHi(sum, floorCode) {
    "use strict";
    var choice = null;
    if (floorCode > 0){
        choice = sum;
    } else {
        choice = 0;
    }
    return choice;
}

function getEffectiveWidthHiDXi(wxM,hi) {
    "use strict";
    var choice = null;
    choice = wxM * hi;
    return choice;
}

function getEffectiveWidthHiDYi(wyM,hi) {
    "use strict";
    var choice = null;
    choice = wyM * hi;
    return choice;
}

function getHillSpeedUp(floorCode,hillOption,hh,lh,deltaSMax,xHill,kHill, alphaHill,hi) {
    "use strict";
    var choice = null;
    var part1, part2, part3, part4;
    if (floorCode > 0) {
        if (hillOption === 0) {
            choice = 1;
        } else {
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
    } else {
        choice = 0;         
    }
    return choice;  
}

function getWindwardStaticCe(floorCode,terrainType,hi) {
    "use strict";
    var choice = null;
    if (floorCode > 0) 
        if(terrainType === 1)
            choice = Math.max( Math.pow((hi/10),0.2), 0.9);
        else
            choice = Math.max( 0.7*(Math.pow((hi/12),0.3)), 0.7 );
    else
        choice = 0;

    return choice;
}

function getWindwardDynamicCe(floorCode,terrainType, hi){
    "use strict";
    var choice = null;
    if(floorCode > 0){
        
        if(terrainType ===1){
            
            choice = Math.min(Math.max( Math.pow((hi/10), 0.28), 1), 2.5);
        }else{
            
            choice = Math.min(Math.max( 0.5*(Math.pow((hi/12.7),0.5)), 0.5),2.5);
        }
    }else{
        
        choice = 0;
    }
    return choice;
}

function getWindwardSelectedCorrected(procedureWind,staticWindCe,dynamicWindCe,hillSpeedUpCe){
    "use strict";
    var choice = null;
    if(procedureWind === 1)
        choice = staticWindCe*hillSpeedUpCe;
    else
        choice = dynamicWindCe*hillSpeedUpCe;
    return choice;
}

function getLeewardStaticCe(floorCode,terrainType,totalHeight){
    "use strict";
    var choice = null;
    if(floorCode > 0)
        if(terrainType === 1)
            choice = Math.max( Math.pow((totalHeight/2/10),0.2),0.9);
        else
            choice = Math.max( 0.7*(Math.pow((totalHeight/2/12),0.3) ),0.7);
    else
        choice = 0;
    return choice;
}

function getLeewardDynamic(floorCode,terrainType,totalHeight){
    "use strict";
    var choice = null;
    if(floorCode > 0)
        if(terrainType === 1)
            choice = Math.min(Math.max( Math.pow((totalHeight/2/10),0.28), 1), 2.5);
        else
            choice = Math.min(Math.max( 0.5*(Math.pow((totalHeight/2/12.7), 0.5)), 0.5), 2.5);
    else
        choice = 0;
    return choice;
}

function getLeewardSelectedCorrected(procedureWind,staticWindCe,dynamicWindCe,hillSpeedUpCe){
    "use strict";
    var choice = null;
    if(procedureWind === 1)
        choice = staticWindCe * hillSpeedUpCe;
    else
        choice = dynamicWindCe * hillSpeedUpCe;
    return choice;
}

function getXDirectionStaticCg(floorCode){
    "use strict";
    var choice = null;
    if(floorCode > 0)
        choice = 2;
    else
        choice = 0;
    return choice;
}

function getXDirectionDynamicCg(floorCode, cgDynamicX){
    "use strict";
    var choice = null;
    if(floorCode > 0)
        choice = cgDynamicX;
    else
        choice = 0;
    return choice;
}

function getXDirectionSelectedCg(procedureWind, staticCg,dynamicCg){
    "use strict";
    var choice = null;
    if(procedureWind===1)
        choice = staticCg;
    else
        choice = dynamicCg;
    return choice;
}

function getXDirectionSelectedCorrected(floorCode,xSelectedCg,hillSpeedUpCe){
    "use strict";
    var choice = null;
    if(floorCode > 0)
        choice = 1+(xSelectedCg-1)*Math.pow((hillSpeedUpCe),-0.5);
    else
        choice = 0;
    return choice;
}

function getYDirectionStaticCg(floorCode){
    "use strict";
    var choice = null;
    if(floorCode > 0)
        choice = 2;
    else
        choice = 0;
    return choice;
}

function getYDirectionDynamicCg(floorCode, cgDynamicY){
    "use strict";
    var choice = null;
    if(floorCode > 0)
        choice = cgDynamicY;
    else
        choice = 0;
    return choice;
}

function getYDirectionSelectedCg(procedureWind, staticCg, dynamicCg){
    "use strict";
    var choice = null;
    if(procedureWind === 1)
        choice = staticCg;
    else
        choice = dynamicCg;
    return choice;
}

function getYDirectionSelectedCorrected(floorCode,ySelectedCg, hillSpeedUpCe){
    "use strict";
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
    "use strict";
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
    "use strict";
    var choice = null;
    if(secFloorCode === 2)
        choice = hsM/2 + parapet;
    else
        choice = hsM/2;
    return choice;
}

function getTributaryHeightWindBelow(hsM){
    "use strict";
    var choice = null;
    choice = hsM/2;
    return choice;
}

function getDXabove(secFloorCode, currWxM, prevWxM){
    "use strict";
    var choice = null;
    if(secFloorCode === 2)
        choice = currWxM;
    else
        choice = prevWxM;
    return choice;
}

function getDYabove(secFloorCode, currWyM, prevWyM){
    "use strict";
    var choice = null;
    if(secFloorCode === 2)
        choice = currWyM;
    else
        choice = prevWyM;
    return choice;
}

function getTributaryAx(dXAbove,hWindAbove,dXBelow,hWindBelow){
    "use strict";
    var choice = null;
    choice = dXAbove*hWindAbove + dXBelow*hWindBelow;
    return choice;
}

function getTributaryAy(dYAbove,hWindAbove,dYBelow,hWindBelow){
    "use strict";
    var choice = null;
    choice = dYAbove*hWindAbove + dYBelow*hWindBelow;
    return choice;
}

function getXWindPressure(factorWind,refVelPressure,selCe,xDirSel,cpXWind){
    "use strict";
    var choice = null;
    choice = factorWind*refVelPressure*selCe*xDirSel*cpXWind;
    return choice;
}

function getXLeePressure(factorWind,refVelPressure,selCe,xDirSel,cpXLee){
    "use strict";
    var choice = null;
    choice = factorWind*refVelPressure*selCe*xDirSel*cpXLee;
    return choice;
}

function getYWindPressure(factorWind,refVelPressure,selCe,yDirSel,cpYWind){
    "use strict";
    var choice = null;
    choice = factorWind*refVelPressure*selCe*yDirSel*cpYWind;
    return choice;
}

function getYLeePressure(factorWind,refVelPressure,selCe,yDirSel,cpYLee){
    "use strict";
    var choice = null;
    choice = factorWind*refVelPressure*selCe*yDirSel*cpYLee;
    return choice;
}

function getTotalForceXDirection(xWindPressure,xLeePressure,tributaryAx){
    "use strict";
    var choice = null;
    choice = (xWindPressure-xLeePressure)*tributaryAx;
    return choice;
}

function getTotalForceYDirection(yWindPressure,yLeePressure,tributaryAy){
    "use strict";
    var choice = null;
    choice = (yWindPressure-yLeePressure)*tributaryAy;
    return choice;
}

function getTotalOverTurningMomentHi(prevSecFloorCode,currHi,prevHi, parapet) {
    "use strict";
    var choice = null;
    if(prevSecFloorCode === 2)
        choice = prevHi+parapet/2;
    else
        choice = currHi;
    return choice;
}

function getTotalOverTurningMomentXDir(prevSecFloorCode,prevTotalShearXDir, currTotalShearXDir, parapet, totalOverTurningMomentHi, prevTotalMomentHi, prevHsWindBelow, nextTotalOverTurningMomentXDir){
    "use strict";
    var choice = null;
    if(prevSecFloorCode === 2)
        choice = prevTotalShearXDir*(parapet/(parapet+prevHsWindBelow))*(totalOverTurningMomentHi-prevTotalMomentHi);
    else
        choice = nextTotalOverTurningMomentXDir+prevTotalShearXDir*(totalOverTurningMomentHi-prevTotalMomentHi);
    return choice;
}


function getTotalOverTurningMomentYDir(prevSecFloorCode,prevTotalShearYDir, currTotalShearYDir, parapet, totalOverTurningMomentHi, prevTotalMomentHi, prevHsWindBelow, nextTotalOverTurningMomentYDir){
    "use strict";
    var choice = null;
    if(prevSecFloorCode === 2)
        choice = prevTotalShearYDir*(parapet/(parapet+prevHsWindBelow))*(totalOverTurningMomentHi-prevTotalMomentHi);
    else
        choice = nextTotalOverTurningMomentYDir+prevTotalShearYDir*(totalOverTurningMomentHi-prevTotalMomentHi);
    return choice;
}


function getCpXWindward(totalHeight, baseDimensionY) {
    "use strict";
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
    "use strict";
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
    "use strict";
    var choice = null;
    if(totalHeight/baseDimensionX<0.25)
        choice = 0.6;
    else
        if(totalHeight/baseDimensionX<1)
            choice = 0.27*(totalHeight/baseDimensionX+2);
        else
            choice = 0.8;
    return choice;
}

function getCpYLeeward(totalHeight,baseDimensionX){
    "use strict";
    var choice = null;
    if(totalHeight/baseDimensionX<0.25)
        choice = -0.3;
    else
        if(totalHeight/baseDimensionX<1)
            choice = -0.27*(totalHeight/baseDimensionX+0.88);
        else
            choice = -0.5;
    return choice;
}

function getWindLoadFactor(limitStatesWind,loadType){
    "use strict";
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
    "use strict";
    var choice = null;
    if(floorCode > 0)
        choice = totalForceXDir*windLoadFactor;
    else
        choice = "";
    return choice;
}

function getLevelVXDir(floorCode, totalShearXDir, windLoadFactor){
    "use strict";
    var choice = null;
    if(floorCode > 0)
        choice = totalShearXDir*windLoadFactor;
    else
        choice = "";
    return choice;
}

function getLevelMXDir(floorCode, totalOverturningMomentXDir, windLoadFactor){
    "use strict";
    var choice = null;
    if(floorCode > 0)
        choice = totalOverturningMomentXDir*windLoadFactor;
    else
        choice = "";
    return choice;
}

function getLevelFYDir(floorCode, totalForceYDir, windLoadFactor){
    "use strict";
    var choice = null;
    if(floorCode > 0)
        choice = totalForceYDir*windLoadFactor;
    else
        choice = "";
    return choice;
}

function getLevelVYDir(floorCode, totalShearYDir, windLoadFactor){
    "use strict";
    var choice = null;
    if(floorCode > 0)
        choice = totalShearYDir*windLoadFactor;
    else
        choice = "";
    return choice;
}

function getLevelMYDir(floorCode, totalOverturningMomentYDir, windLoadFactor){
    "use strict";
    var choice = null;
    if(floorCode > 0)
        choice = totalOverturningMomentYDir*windLoadFactor;
    else
        choice = "";
    return choice;
}

function getKHill(xHill, pick){
    "use strict";
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
    "use strict";
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
    "use strict";
    var choice = [0,3,0];
    if(hh/lh>0.5)
        choice[0] =2.2*0.5;
    else
        choice[0] =2.2*hh/lh;
    if(xHill<0)
        choice[2] = 1.5;
    else
        choice[2]= 1.5;
    return choice;
}
function get2DimensionalEscarpments(hh,lh,xHill){
    "use strict";
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
    "use strict";
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
    "use strict";
    var choice = null;
    choice = 4/3*sumOfArea;
    return choice;
}


// V bar
function getReferenceWindSpeed(factorWind,q150) {
    "use strict";
    var choice = null;
    choice = 39.2*Math.sqrt(factorWind*q150);
    return choice;
}

function getexposureFactorTop(terrainType, totalHeight){
    "use strict";
    var choice = null;
    if (terrainType === 1)
        choice = Math.min(Math.max( Math.pow((totalHeight/10),0.28),1),2.5);
    else
        choice = Math.min(Math.max(0.5* Math.pow((totalHeight/12.7),0.5) ,0.5),2.5);
    return choice;
}

// V h
function getMeanWindSpeedTopOfStructure(refWindSpeed,exposureFactorTop) {
    "use strict";
    var choice = null;
    choice = refWindSpeed*Math.sqrt(exposureFactorTop);
    return choice;
}

// w / H
function getw_hAspectRatio(heightWindwardFace, effectiveWidthWindward) {
    "use strict";
    var choice = null;
    choice = effectiveWidthWindward / heightWindwardFace;
    return choice;
}

// x0
function getGustEnergyRatioX0(waveNumber) {
    "use strict";
    var choice = null;
    choice = 1220*waveNumber;
    return choice;
}

// F
function getGustEnergyRatioF(gustEnergyRatioX0) {
    "use strict";
    var choice = null;
    choice = Math.pow(gustEnergyRatioX0,2)/Math.pow((1+Math.pow(gustEnergyRatioX0,2)),(4/3));
    return choice;
}

// f nd / V h
function getWaveNumber(naturalFrequency, meanWindSpeed) {
    "use strict";
    var choice = null;
    choice = naturalFrequency / meanWindSpeed;
    return choice;
}

//f nd H / V h
function getReducedFrequency(naturalFrequency, heightWindwardFace, meanWindSpeed) {
    "use strict";
    var choice = null;
    choice = naturalFrequency*heightWindwardFace/meanWindSpeed;
    return choice;
}

// s
function getSizeReductionFactor(reducedFrequency, naturalFrequency, effectiveWidthWindward, meanWindSpeed){
    "use strict";
    var choice = null;
    choice = Math.PI/3*(1/(1+8/3*reducedFrequency))*(1/(1+10*naturalFrequency*effectiveWidthWindward/meanWindSpeed));
    return choice;
}

// v
function getAverageFluctationRate(naturalFrequency, sizeReductionFactor, gustEnergyRatioF, dampingRatio, backGroundTurbulence){
    "use strict";
    var choice = null;
    choice = naturalFrequency*Math.sqrt(sizeReductionFactor*gustEnergyRatioF/(sizeReductionFactor*gustEnergyRatioF+dampingRatio*backGroundTurbulence));
    return choice;
}

//  s / m
function getCoefficient_s_m(surfaceRoughness, exposureFactorTop, backGroundTurbulence, sizeReductionFactor, gustEnergyRatioF, dampingRatio){
    "use strict";
    var choice = null;
    choice = Math.sqrt(surfaceRoughness/exposureFactorTop*(backGroundTurbulence+sizeReductionFactor*gustEnergyRatioF/dampingRatio));
    return choice;
}

// g p
function getPeakFactor(averageFluctuation){
    "use strict";
    var choice = null;
    choice = Math.sqrt(2*Math.log(averageFluctuation*3600))+0.577/Math.sqrt(2*Math.log(averageFluctuation*3600));
    return choice;
}

// C g
function getGustEffectFactor(peakFactor, coeffiecient_s_m){
    "use strict";
    var choice = null;
    choice = 1 + peakFactor * coeffiecient_s_m;
    return choice;
}

// x
function getTrapeZoidalX(currStep, integration){
    "use strict";
    var choice = null;
    choice = currStep / 1000 * integration;
    return choice;
}

// f(x)
function getTrapeZoidalFx(currX, heightWindwardFace, effectiveWidthWindward){
    "use strict";
    var choice = null;
    choice = (1/(1+currX*heightWindwardFace/457))*(1/(1+currX*effectiveWidthWindward/122))*(currX/Math.pow((1+Math.pow(currX,2)),(4/3)));
    return choice;
}

// Area
function getTrapeZoidalArea(currX, prevX, currFx, prevFx){
    "use strict";
    var choice = null;
    choice = (currX-prevX)*(currFx+prevFx)/2;
    return choice;
}

// function get(){
//  var choice = null;
//  return choice;
// }