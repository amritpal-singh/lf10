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
    return choice * 1.0;
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
/*******************************************************
Interpolation formulas for acceleration and velocity
********************************************************/

//Values of Fa lookup table
function faTable(){
    "use strict";
    var faLookup = [0.7,0.7,0.8,0.8,0.8,
                    0.8,0.8,0.9,1.0,1.0,
                    1.0,1.0,1.0,1.0,1.0,
                    1.3,1.2,1.1,1.1,1.0,
                    2.1,1.4,1.1,0.9,0.9];
    return faLookup;
}

//Values for Fv lookup table
function fvTable(){
    "use strict";
    var fvLookup = [0.5,0.5,0.5,0.6,0.6,
                    0.6,0.7,0.7,0.8,0.8,
                    1.0,1.0,1.0,1.0,1.0,
                    1.4,1.3,1.2,1.1,1.1,
                    2.1,2.0,1.9,1.7,1.7];
    return fvLookup;
}

function formatSiteOption(letters){
    "use strict";
    var choice;

    if(letters === JSON.stringify("A","A"))
        choice = 0;
    else if(letters === JSON.stringify("B","B"))
        choice = 1;
    else if(letters === JSON.stringify("C","C"))
        choice = 2;
    else if(letters === JSON.stringify("D","D"))
        choice = 3;
    else if(letters === JSON.stringify("E","E"))
        choice = 4;
    else
        choice = 5;
    return choice;
}

/*check -1check -1check -1check -1check -1check -1check -1check -1check -1check -1
check -1check -1check -1check -1check -1check -1check -1
check -1check -1check -1check -1check -1
check -1check -1check -1check -1check -1*/
function getTableRow(table, row_location, row_length){
    "use strict";
    var choice = [];
    var table_location = row_location * row_length -1;
    //if(table_location < 0) table_location = 0;
    for(var i = 0; i < row_length;i++){
        choice[i] = table[table_location+i+1];
    }
    return choice;
}

function getLookUpTableValue (table, row_location, col_location, row_length) {
    "use strict";
    var choice;
    var table_location = row_location * row_length -1;
    if(table_location > row_length - 1 ){
        choice = table_location +col_location  ;
    }else{
        choice = col_location;
    }
    return choice;
}

//Can be used to find the Fa & Fv interp
/**
    Parameters: 
                fArr: - An array of 5 numeric values
                sa: - A single numeric const  


    Return: interp[] - the results at most 6 numeric values or null 
*/

function getFAVInterp(fArr, sa, f_const){
    "use strict";
    //var f_const = [0.25,0.5,0.75,1,1.25];
    var interp = [0,0,0,0,0,0];

    if(fArr.length === 5){
        for (var i = 0; i < interp.length; i++) {
            if(i === 0)
                interp[i] = (sa <= f_const[i]) ? fArr[0]: null;
            else if (i === 5)
                interp[i] = (sa >= f_const[i-1]) ? fArr[4]: null;
            else
                if (sa > f_const[i-1]  && sa <= f_const[i])
                    interp[i] = (sa - f_const[i-1]) / f_const[0]*(fArr[i] - fArr[i-1]) + fArr[i-1];
                else
                    interp[i] = null;
        }
    }

    return interp;
}

// function getFAVInterp(fArr, sa, f_const, tmpSTVals){
//     "use strict";
//     //var f_const = [0.25,0.5,0.75,1,1.25];
//     var interp = [0,0,0,0,0,0];

//     if(fArr.length === 5){
//         for (var i = 0; i < interp.length; i++) {
//             if(i === 0)
//                 interp[i] = (sa <= f_const[i]) ? fArr[0]: null;
//             else if (i === 5)
//                 interp[i] = (sa >= f_const[i-1]) ? fArr[4]: null;
//             else
//                 if (sa > f_const[i-1]  && sa <= f_const[i])
//                     interp[i] = (sa - f_const[i-1]) / f_const[0]*(tmpSTVals[1] - tmpSTVals[0]) + tmpSTVals[0];
//                 else
//                     interp[i] = null;
//         }
//     }

//     return interp;
// }

/**
    Parameter:
                favInterp: - is an array of numeric values
    Returns: 
                choice: - returns the largest value from the array 
*/
function getFAV(favInterp){
    "use strict";
    var choice = null;
    choice = Math.max.apply(null, favInterp);
    return choice;
}


/**
    Parameters: 
                ie: - is an numeric value
                fav: - is the numeric value of Fa/Fv
                sa: - is th numeric value of Sa(0.2)/Sa(1.0)
    Returns:
                choice: - returns the product of all three values
*/
function getIeFAVSa(ie,fav,sa){
    "use strict";
    var choice = null;
    choice = ie * fav * sa;
    return choice;
}


/*******************************************
Values of S(T)
********************************************/
function getTEqLt02(fa, sa02){
    "use strict";
    var choice = null;
    choice = fa * sa02;
    return  choice;
}

function getTEq05(fv,fa,sa02,sa05){
    "use strict";
    var choice = null;
    choice = Math.min(fv*sa05,fa*sa02);
    return  choice;
}

function getTEq10(fv, sa10){
    "use strict";
    var choice = null;
    choice = fv * sa10;
    return choice;
}

function getTEq20(fv, sa20){
    "use strict";
    var choice = null;
    choice = fv * sa20;
    return  choice;
}


function getTEqGt40(tEq20){
    "use strict";
    var choice = null;
    choice = tEq20/2;
    return  choice;
}

function getSTValue(fa,fv,sa02,sa05,sa10, sa20, tEq20){
    "use strict";
    var choice = [0,0,0,0,0];
    choice[0] = getTEqLt02(fa,sa02);
    choice[1] = getTEq05(fv,fa,sa02,sa05);
    choice[2] = getTEq10(fv,sa10);
    choice[3] = getTEq20(fv,sa20);
    choice[4] = getTEqGt40(tEq20);
    return choice;
}

// or use for Ta_deflection replace systemLimitforDesign value with Limit for deflection
function getTaLoad(otherTa, taMechanice,taCode, systemLimitForDesign){
    "use strict";
    var choice = null;
    if(otherTa === false)
        choice = taCode;
    else
        choice = Math.min(taMechanice,systemLimitForDesign);
    return choice;
}

function getsa02sa20(sa02,sa20){
    "use strict";
    var choice = null;
    choice = sa02/sa20; 
    return choice;
}

function getApplicableLine(sa02sa20, numericalCode){
    "use strict";
    var choice = null;
    if(sa02sa20 < 8)
        choice = numericalCode;
    else 
        choice = numericalCode+5;
    return choice;
}

//-----------------------------------------------------------
function getS02M(s_02, mvForTaEqLt10 ){
    "use strict";
    var choice = null;
    choice = parseFloat(s_02) * parseFloat(mvForTaEqLt10);
    return choice;
}

function getS05M(s_05, mvForTaEqLt10){
    "use strict";
    var choice = null;
    choice = parseFloat(s_05) * parseFloat(mvForTaEqLt10);
    return choice;
}

function getS10M(s_10, mvForTaEqLt10){
    "use strict";
    var choice = null; 
    choice = parseFloat(s_10) * parseFloat(mvForTaEqLt10);
    return choice;
}

function getS20M(s_20, mvForTaEq20){
    "use strict";
    var choice = null;
    choice = parseFloat(s_20) * parseFloat(mvForTaEq20);
    return choice;
}

function getS40M(s_40, mvForTaEqGt40){
    "use strict";
    var choice = null;
    choice = parseFloat(s_40) * parseFloat(mvForTaEqGt40);
    return choice;
}

function getSM(arrValue, jsonValue){
    "use strict";
    var choice = [5];
    choice[0] = getS02M(arrValue[0], jsonValue[0] );
    choice[1] = getS05M(arrValue[1], jsonValue[1] );
    choice[2] = getS10M(arrValue[2], jsonValue[2] );
    choice[3] = getS20M(arrValue[3], jsonValue[3] );
    choice[4] = getS40M(arrValue[4], jsonValue[4] );
    return choice;
}

//-------------------------------------------------------------------
function getInterpolationTEqLt1(taLoad, sTa, mvForTaEqLt10){
    "use strict";
    var choice = null;
    if(taLoad <= 1)
        choice = sTa * mvForTaEqLt10;
    else
        choice = "";
    return choice;
}

function getInterpolationTEqGt1Lt2(taLoad,s_10,s_20){
    "use strict";
    var choice = null;
    if(taLoad > 1 && taLoad < 2)
        choice = (taLoad-1)/1*(s_20-s_10)+s_10;
    else
        choice = "";
    return choice;
}

function getInterpolationTEqGt2Lt4(taLoad,s_20,s_40){
    "use strict";
    var choice = null;
    if(taLoad>=2 && taLoad<4)
        choice = (taLoad-2)/2*(s_40-s_20)+s_20;
    else
        choice = "";
    return choice;
}
function getInterpolationTEqGt4(taLoad, sTa, mvForTaEqGt40){
    "use strict";
    var choice = null;
    if(taLoad >= 4)
        choice = sTa*mvForTaEqGt40;
    else
        choice = "";
    return choice;
}

//------------------------------
function getJForTEqLt1(taLoad, jsonValue){
    "use strict";
    var choice = null;
    if(taLoad <= 0.5)
        choice = jsonValue;
    else
        choice = "";
    return choice;
}
function getJForTEqGt1Lt2(taLoad,jsonVal1, jsonVal2){
    "use strict";
    var choice = null;
    if(taLoad > 0.5 && taLoad < 2)
        choice = (taLoad-0.5)/1.5*(jsonVal2-jsonVal1)+jsonVal1;
    else
        choice = "";
    return choice;
}
function getJForTEqGt2Lt4(taLoad,jsonVal1,jsonVal2){
    "use strict";
    var choice = null;
    if(taLoad >= 2 && taLoad < 4)
        choice = (taLoad-2)/2*(jsonVal2-jsonVal1)+jsonVal1;
    else
        choice = "";
    return choice;
}
function getJForTEqGt4(taLoad, jsonValue){
    "use strict";
    var choice = null;
    if(taLoad >= 4)
        choice = jsonValue;
    else
        choice = "";
    return choice;
}
//----------------------------
function getInterp02(taLoad, val1){
    "use strict";
    var choice = null;
    if(taLoad <=0.2 )
        choice = val1; 
    else
        choice = "";
    return choice;
}
function getInterp0205(taLoad, val1, val2){
    "use strict";
    var choice = null;
    if(taLoad > 0.2 && taLoad <= 0.5)
        choice = (taLoad-0.2) /0.3 *(val2-val1)+val1;
    else
        choice = "";
    return choice;
}
function getInterp0510(taLoad, val2, val3){
    "use strict";
    var choice = null;
    if(taLoad > 0.5 && taLoad <= 1)
        choice = (taLoad-0.5)/0.5*(val3-val2)+val2;
    else
        choice = "";
    return choice;
}
function getInterp1020(taLoad, val3, val4){
    "use strict";
    var choice = null;
    if(taLoad>1 && taLoad<=2)
        choice = (taLoad-1)/1*(val4-val3)+val3;
    else
        choice = "";
    return choice;
}
function getInterp2040(taLoad, val4, val5){
    "use strict";
    var choice = null;
    if(taLoad>2 && taLoad<=4)
        choice = (taLoad-2)/2*(val5-val4)+val4;
    else
        choice = "";
    return choice;
}
function getInterp40(taLoad, val5){
    "use strict";
    var choice = null;
    if(taLoad >=4 )
        choice = val5;
    else
        choice = "";
    return choice;
}
//-------------------------------------
function getJForTInterp(appVals, ta, f_const){
    "use strict";
    //var f_const = [0.25,0.5,0.75,1,1.25];
    var interp = [0,0,0,0];

    if(fArr.length === 3){
        for (var i = 0; i < interp.length; i++) {
            if(i === 0)
                interp[i] = (sa <= f_const[i]) ? appVals[0]: null;
            else if (i === 3)
                interp[i] = (sa >= f_const[i-1]) ? appVals[2]: null;
            else
                if (sa > f_const[i-1]  && sa <= f_const[i])
                    interp[i] = (sa - f_const[i-1]) / f_const[0]*(fArr[1] - appVals[0]) + appVals[0]; 
                else
                    interp[i] = null;       
        }
    }
    return interp;
}


/*************************************************************************
Structural systems data and tests of possible usage
**************************************************************************/

/**
    Parameters:
                faSa: - is a single numeric value from IEFaSa02
                rtrnVal: - an array of 4 numeric values from restrictions and one of these values maybe returned
                f_const: - an array of 3 numeric values used to compare against rtrnVal
    Return:
                choice: - contains rtrnVal that is selected else returns null
*/

function getAppRestrFASa02 (faSa, rtrnVal){
    "use strict";
    var f_const = [0.2,0.35,0.75];
    var choice = null;
    if(rtrnVal.length === 4){
        if(faSa < f_const[0])
            choice = rtrnVal[0];
        else
            if (faSa < f_const[1])
                choice = rtrnVal[1];
            else
                if (faSa < 0.75) 
                    choice = rtrnVal[2];
                else
                    choice = rtrnVal[3];
    }
    return choice;
}

/**
    Parameters:
                fvSa: - is a single numeric value IEFvSa10
                rtrnVal: - is a single numeric value
    Return:
                choice: - returns the rtrnVal if it passes the condition else 999
*/

function getAppRestrFVSa10(fvSa, rtrnVal){
    "use strict";
    var f_const = 0.3;
    var choice = null;
    if(fvSa > 0.3)
        choice = rtrnVal;
    else
        choice = 999;

    return choice;
}

/**
    Parameters:
                fvSa: - is a single numeric value
                faSa: - is a single numeric value
                ctgryChoice: - value is true/false
    Return:
                choice: - return the min value from fvSa & faSa if ctgryChoice is false else return 0
*/
function getFinalRestr(fvSa,faSa,ctgryChoice){
    "use strict";
    var choice = null;
    if(ctgryChoice === false){
        if(fvSa > faSa)
            choice = faSa;
        else
            choice = fvSa;
    }else
        choice = 0;
    return choice;
}

function getCtgryChoice (ctgyChoice,rowNum) {
    "use strict";
    var choice = null;
    if(ctgyChoice === 1.5 && between(12,18,rowNum))
        choice = true;
    else
        choice = false;
    return choice;
}

/*************************************************************************
Structural systems data and tests of possible usage
**************************************************************************/

/**
*/
function checkFaSa(faSa){
    "use strict";
    var choice = null;
    if(faSa <= 0.12)
        choice = 0;
    else 
        choice = 1;
    return choice;
}

/**************************************************
System Tab - Period Calculations table
***************************************************/


function getLimitDesign(ta, nbcMulti ){
    "use strict";
    var choice = null;
    choice = ta * nbcMulti;
    return choice;
}

function getTa(currHeight, currRow){
    "use strict";
    var choice = null;
    if(between(1,3,currRow) || currRow === 12 || currRow === 15){
        console.log("#1");
        choice = 0.085*Math.pow(currHeight,0.75);
    }else if(between(4,9,currRow) || currRow === 13 || currRow === 16){
        console.log("#2");
        choice = 0.025 * currHeight;
    }else if(between(10,11,currRow) || between(17,18,currRow) || currRow === 14){
        console.log("#3");
        choice =0.05*Math.pow(currHeight,0.75);
    }
    return  choice;
}

function checkPermitted(hght,finalRestriction){
    "use strict";
    var choice = null;
    if(hght > finalRestriction)
        choice = false;//"Not permitted by NBC";
    else
        choice = true;//"Permitted by NBC";
    return choice;
}

function getHeightLimit(finalRestriction){
    "use strict";
    var choice = null;
    if(finalRestriction === 999)
        choice = "No limit";
    else if(finalRestriction === 0)
        choice = "Not permitted";
    else
        choice = finalRestriction;
    return choice;
}

function amplificationFormula(first,second, third, currHeight){
    "use strict";
    var choice = null;
    var tmpChoice1 = null;
    var tmpChoice2 = null;
    console.log("!!!!");
    tmpChoice1 = first;
    if(currHeight > second)
        tmpChoice2 =  1+(currHeight-second)*third;
    else 
        tmpChoice2 = 1;
    choice = Math.min(tmpChoice1,tmpChoice2);
    return choice;
}

function getForceAmplification(importantCategory,fa,_Sa02,currRow, iefaSa02, iefvSa10, currHeight){
    "use strict";
    var choice = null;
    var tmpChoice1 = null;
    var tmpChoice2 = null;
    if(between(15,17,currRow)){
        if(importantCategory*fa*_Sa02>=0.35){
            console.log("15-17");
                if(Math.min(iefvSa10,iefaSa02) === 60) 
                    tmpChoice1 = 1.9;
                else 
                    tmpChoice1 = 1.5; 
                if(currHeight > 15) 
                    tmpChoice2 = 1+(currHeight-15)*0.02; 
                else  
                    tmpChoice2 = 1;
            choice = Math.min(tmpChoice1,tmpChoice2);
        }else{
            choice = 1;
            console.log("!! ? !!!");
        }
    }else if(currRow === 4){
        choice = amplificationFormula(1.24, 32, 0.03, currHeight);
        console.log("!! 4 !!!");
    }else if(currRow === 5){
        choice = amplificationFormula(1.12, 16, 0.03, currHeight);
        console.log("!! 5 !!!");
    }else if(currRow === 6){
        choice = amplificationFormula(1.24, 48, 0.02, currHeight);
        console.log("!! 6 !!!");
    }else if(currRow === 7){
        choice = amplificationFormula(1.24, 32, 0.03, currHeight);
        console.log("!! 7 !!!");
    }else{
        choice = 1;
    }
    return  choice;
}

/******************************************************************************
Front page
*******************************************************************************/

function getFloorCode(currHsM,switchPermitted){
    "use strict";
    var choice = null;
    if(currHsM > 0)
        choice = 1*switchPermitted;
    else
        choice = 0*switchPermitted;
    return  choice;
}

function getFinalHxm(currFloorCode, sumOfHsM){
    "use strict";
    var choice = null;
    if(currFloorCode === 0)
        choice = "";
    else
        choice = sumOfHsM;
    return  choice;
}

function getFinalWkN(currFloorCode, wkN){
    "use strict";
    var choice = null;
    if(currFloorCode === 0)
        choice = "";
    else
        choice = wkN;
    return  choice;
}

function getFinalhxWx(currFloorCode,currHxM, currWxkN){
    "use strict";
    var choice = null;
    if(currFloorCode === 0)
        choice = "";
    else
        choice = currHxM*currWxkN;
    return  choice;
}


function getFt(switchPermitted,taLoad, vtotal){
    "use strict";
    var choice = null;
    if(switchPermitted === 0)
        choice = "-";
    else
        if(taLoad > 0.7)
            choice = Math.min(0.07*taLoad*vtotal,0.25*vtotal);
        else 
            choice = 0;
    return  choice;
}

function getVTotal(switchPermitted, vAmp, totalWeght){
    "use strict";
    var choice = null;
    if(switchPermitted===0)
        choice = "-";
    else
        choice = vAmp*totalWeght;
    return  choice;
}

function getMinLateralEarthquakeForce(sTaMv, importanceCategory, rd, ro, switchPermitted){
    "use strict";
    var choice = null;
    choice = sTaMv*importanceCategory/rd/ro*switchPermitted;
    return choice;
}

function getUpperLimitV(s_02, rd, importanceCategory, ro, switchPermitted){
    "use strict";
    var choice = null;
    choice = 2/3*s_02*importanceCategory/rd/ro*switchPermitted;
    return choice;
}

function getLowerLimitV(numericalCode,s2Mv,s4Mv,importanceCategory,rd,ro,switchPermitted){
    "use strict";
    var choice = null;
    if(numericalCode === 4)
        choice = s4Mv*importanceCategory/rd/ro*switchPermitted;
    else 
        choice = s2Mv*importanceCategory/rd/ro*switchPermitted;
    return choice;
}

function getShearCorr(sTaMv,importanceCategory,switchPermitted){
    "use strict";
    var choice = null;
    choice = sTaMv*importanceCategory/1.3*switchPermitted;
    return choice;
}

function getFinalBaseShear(switchPermitted, totalWeght, ampBaseShearV){
    "use strict";
    var choice = null;
    if(!switchPermitted){
        choice = "-";
    }else{
        choice = totalWeght*ampBaseShearV;
    }
    return choice;
}

function getBaseShear(rd, site, vMax, vMin, vMin2, switchPermitted){
    "use strict";
    var choice = null;
    if(rd>=1.5 && site < 5)
        choice = Math.min(vMax, Math.max(vMin,vMin2))*switchPermitted;
    else
        choice = Math.max(vMin,vMin2)*switchPermitted;
    return choice;
}

function getAmpHn(forceAmplification, switchPermitted){
    "use strict";
    var choice = null;
    choice = (forceAmplification)*switchPermitted;
    return choice;
}

function getAmpBaseShear(currRow, ampHn, vMaxRoRd ,vBaseShear,switchPermitted){
    "use strict";
    var choice = null;
    if(between(15,17,currRow))
        choice = Math.min(vMaxRoRd,(vBaseShear*ampHn))*switchPermitted;
    else
        choice = vBaseShear*ampHn*switchPermitted;
    return choice;
}

function getFxkN(currFloorCode, currHxWxkNm, nextHxWxkNm, sumHxWxkNm, ft, vTotal){
    "use strict";
    var choice = null;
    if(currFloorCode === 0)
        choice = "";
    else
        if(nextHxWxkNm === 0 && currHxWxkNm>0)
            choice = (vTotal-ft)*currHxWxkNm/sumHxWxkNm+ft;
        else
            choice = (vTotal-ft)*currHxWxkNm/sumHxWxkNm;
    return  choice;
}

function getVxkN(currFloorCode, sumFxkN){
    "use strict";
    var choice = null;
    if(currFloorCode === 0)
        choice = "";
    else
        choice = sumFxkN;
    return  choice;
}

function getVxhx(currFloorCode, currHxM, prevHxM, currVxKN){
    "use strict";
    var choice = null;
    // if(currFloorCode === 0){
    //     choice = "";
    //     console.log("----1----");
    // }else{
    //     if(currHxM === "" && currHxM > 0){
    //         console.log("----2----");
    //         choice = 0;
    //     }else{
    //         choice = currVxKN*(prevHxM-currHxM);
    //         console.log("----3----:" + choice);
    //     }
    // }
    choice = currVxKN*(prevHxM-currHxM);
    return  choice;
}


function getMx(currFloorCode, currHxM, nextHxM, nextMxkNm, currVxhxkNm){
    "use strict";
    var choice = null;
    if(currFloorCode === 0){
        choice = "";
    }else{
        if(nextHxM === "" && currHxM > 0){
            choice = 0;
        }else{
            choice = nextMxkNm+currVxhxkNm;
        }
    }
    return  choice;
}

function getJx(currFloorCode, buildingHeight, J_Ta, currHxM){
    "use strict";
    var choice = null;
    if(currFloorCode === 0) 
        choice = "";
    else
        if(currHxM < 0.6*buildingHeight)
            choice = J_Ta+(1-J_Ta)*(currHxM/(0.6*buildingHeight));
        else
            choice = 1;
    return  choice;
}


function getMxRedkNm(currFloorCode,currMxkNm,currJx){
    "use strict";
    var choice = null;
    if(currFloorCode === 0)
        choice = "";
    else
        choice =  currMxkNm*currJx;
    return  choice;
}

function getMuitDeflection(switchPermitted, vAmpDefl, vAmp){
    "use strict";
    var choice = null;
    if(switchPermitted === 0)
        choice = "";
    else
        choice = vAmpDefl/vAmp;
    return choice;
}

function getPeriodUsedTaDefl(taOther, taCode, taMechanics, limitForDeflection){
    "use strict";
    var choice = null;
    if(!taOther)
        choice = taCode;
    else
        choice = Math.min(taMechanics,limitForDeflection);
    return choice;
}

// function get(){
//  var choice = null;
//  return  choice;
// }