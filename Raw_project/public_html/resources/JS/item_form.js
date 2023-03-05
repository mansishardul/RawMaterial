
var jpdbBaseURL = 'http://api.login2explore.com:5577';
var connToken = "90938077|-31949268713321395|90953047";
var jpdbIML = '/api/iml';
var jpdbIRL = '/api/irl';
var empDBName = "RAW_DB";
var empRelationName = "ITEMS";
var createTime = false;
var updateTime = false;
setBaseUrl(jpdbBaseURL);
function disableCtrl(ctrl)
{
    $('#new').prop('disabled', ctrl);
    $('#save').prop('disabled', ctrl);
    $('#edit').prop('disabled', ctrl);
    $('#change').prop('disabled', ctrl);
    $('#reset').prop('disabled', ctrl);

}
function disableNav(ctrl)
{
    $('#first').prop('disabled', ctrl);
    $('#prev').prop('disabled', ctrl);
    $('#next').prop('disabled', ctrl);
    $('#last').prop('disabled', ctrl);
}
function disableForm(bValue)
{
    $('#itemid').prop('disabled', bValue);
    $('#itemname').prop('disabled', bValue);
    $('#itemstk').prop('disabled', bValue);
    $('#itemUOM').prop('disabled', bValue);

}
//function save_rectoLS(res)
//{
//    var lvdata = JSON.parse(res.data);
//    localStorage.setItem('rec_no1', lvdata.rec_no1);
//
//}
function GetempID_AsJsonobj()
{
    var itemId = $('#itemid').val();
    var jsonStr = {
        itemid: itemId
    };
    return JSON.stringify(jsonStr);
}
function  filldata(res)
{
    setCurrRecNo2LS(res);
    var data = JSON.parse(res.data).record;
    $('#itemname').val(data.itemname);

    $('#itemstk').val(data.itemstk);
    $('#itemUOM').val(data.itemUOM);


}
function getitem()
{
    var obj = GetempID_AsJsonobj();
    var getrequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, obj, createTime, updateTime);
    jQuery.ajaxSetup({async: false});
    var res = executeCommandAtGivenBaseUrl(getrequest, "http://api.login2explore.com:5577", "/api/irl");

    jQuery.ajaxSetup({async: true});
    if (res.status === 400)
    {
        $('#save').prop('disabled', false);

        $('#reset').prop('disabled', false);

    } else if (res.status === 200)
    {
        filldata(res);
        $('#change').prop('disabled', false);
        $('#save').prop('disabled', true);
        $('#edit').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#empid').focus();
    }



}
function initEmpForm()
{
    localStorage.removeItem('first_rec_no');
    localStorage.removeItem('last_rec_no');
    localStorage.removeItem('rec_no');
    // console.log("initEmpForn()-Done!");
    //alert("initEmpForn()-Done!");
}
function  setFirstRecNo2LS(jsonObj)
{
    var data = (JSON.parse(jsonObj.data));
    if (data.rec_no === undefined) {
        localStorage.setItem("first_rec_no", "0");
    } else {
        localStorage.setItem("first_rec_no", data.rec_no);
    }
}
function getFirstRecNoFromLS()
{
    return localStorage.getItem("first_rec_no");
}
function setLastRecNo2LS(jsonObj)
{
    var data = (JSON.parse(jsonObj.data));
    if (data.rec_no === undefined) {
        localStorage.setItem("last_rec_no", "0");
    } else {
        localStorage.setItem("last_rec_no", data.rec_no);
    }

}
function getLastRecNoFromLS()
{
    return localStorage.getItem("last_rec_no");
}
function setCurrRecNo2LS(jsonObj)
{
    var data = (JSON.parse(jsonObj.data));
    localStorage.setItem("rec_no", data.rec_no);

}
function getCurrRecNoFromLS()
{
    return localStorage.getItem("rec_no");
}
function showData(jsonObj)
{
    if (jsonObj.status === 400)
    {
        return;
    }
    var data = (JSON.parse(jsonObj.data)).record;
    setCurrRecNo2LS(jsonObj);
    $('#itemid').val(data.itemid);
    $('#itemname').val(data.itemname);
    $('#itemstk').val(data.itemstk);
    $('#itemUOM').val(data.itemUOM);

    disableNav(false);
    disableForm(true);
    $('#save').prop('disabled', true);
    $('#change').prop('disabled', true);
    $('#reset').prop('disabled', true);

    $('#new').prop('disabled', false);
    $('#edit').prop('disabled', false);

    if (getCurrRecNoFromLS() === getLastRecNoFromLS())
    {
        $('#next').prop('disabled', true);
        $('#last').prop('disabled', true);
    }

    if (getCurrRecNoFromLS() === getFirstRecNoFromLS())
    {
        $('#prev').prop('disabled', true);
        $('#first').prop('disabled', true);
        return;
    }
}
function validateData()
{
    var Eid, Ename, EDA, Esal;
    Eid = $('#itemid').val();
    Ename = $('#itemname').val();
    Esal = $('#itemstk').val();
    EDA = $('#itemUOM').val();

    if (Eid === "") {
        alert("Please enter correct Item id ");
        $("#itemid").focus();
        return "";
    }
    if (Ename === "") {
        alert("Please enter correct Item name ");
        $("#itemname").focus();
        return "";
    }

    if (Esal === "") {
        alert("Enter value correctly!!");
        $("#itemstk").focus();
        return "";
    }
    if (EDA === "") {
        alert("Unit of Measure is Required Value");
        $("#itemUOM").focus();
        return "";
    }

    var jsonStrObj = {
        itemid: Eid,
        itemname: Ename,

        itemstk: Esal,
        itemUOM: EDA

    };
    return JSON.stringify(jsonStrObj);


}
function newemp()
{
    makeDataFormEmpty();
    disableForm(false);
    $('#itemid').focus();
    disableNav(true);
    disableCtrl(true);
    $('#save').prop('disabled', false);
    $('#reset').prop('disabled', false);

}
function makeDataFormEmpty()
{
    $('#itemid').val("");
    $('#itemname').val("");
    $('#itemstk').val("");
    $('#itemUOM').val("");

}
function save()
{
    var jsonStrObj = validateData();
    if (jsonStrObj === " ")
        return " ";
    var putrequest = createPUTRequest(connToken, jsonStrObj, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var jsonObj = executeCommandAtGivenBaseUrl(putrequest, "http://api.login2explore.com:5577", jpdbIML);

    jQuery.ajaxSetup({async: true});
    if (isNoRecordPresentLS())
    {
        setFirstRecNo2LS(jsonObj);
    }
    setLastRecNo2LS(jsonObj);
    setCurrRecNo2LS(jsonObj);
    reset();
    alert('Data saved sucessfully');


}
function edit()
{
    disableForm(false);
    $('#itemid').prop('disabled', true);
    $('#itemname').focus();
    disableCtrl(true);
    disableNav(true);
    $('#change').prop('disabled', false);
    $('#reset').prop('disabled', false);
}

function change()
{
    var jsonchg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonchg, empDBName, empRelationName, getCurrRecNoFromLS());
    jQuery.ajaxSetup({async: false});
    var res = executeCommandAtGivenBaseUrl(updateRequest, "http://api.login2explore.com:5577", "/api/iml");
    jQuery.ajaxSetup({async: true});
    console.log(jsonchg);
    reset();
    $('#itemid').focus();
    $('#edit').focus();
    alert("Data Updated Sucessfully");
}

function reset()
{
    disableCtrl(true);
    disableNav(false);
     makeDataFormEmpty();
    $('#new').prop('disabled', false);
    $('#itemid').focus();
    if (isOnlyOneRecordPresent() || isNoRecordpresentLS())
    {
        disableNav(true);
    }
    var getCurRequest = createGET_BY_RECORDRequest(connToken, empDBName, empRelationName, getCurrRecordNoFromLS());
    jQuery.ajaxSetup({async: false});
    var result = executeCommandAtGivenBaseUrl(getCurRequest, "http://api.login2explore.com:5577", irlPartUrl);
    showData(result);
    alert("WORKING");
    jQuery.ajaxSetup({async: true});
   






}

function getFirst()
{
    var getFirstRequest = createFIRST_RECORDRequest(connToken, empDBName, empRelationName);
    // alert(getFirstRequest);
    jQuery.ajaxSetup({async: false});
    var result = executeCommandAtGivenBaseUrl(getFirstRequest, "http://api.login2explore.com:5577", irlPartUrl);
    //alert(result);
    showData(result);
    setFirstRecNo2LS(result);
    jQuery.ajaxSetup({async: true});
    $('#itemid').prop('disabled', true);
    $('#first').prop('disabled', true);
    $('#prev').prop('disabled', true);
    $('#next').prop('disabled', false);
    $('#save').prop('disabled', true);

}

function getNext() {
    var r = getCurrRecNoFromLS();

    var getnextRequest = createNEXT_RECORDRequest(connToken, empDBName, empRelationName, r);
    jQuery.ajaxSetup({async: false});
    var result = executeCommandAtGivenBaseUrl(getnextRequest, "http://api.login2explore.com:5577", irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});

    $('#save').prop('disabled', true);
}

function getLast()
{
    var getLastRequest = createLAST_RECORDRequest(connToken, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var result = executeCommandAtGivenBaseUrl(getLastRequest, "http://api.login2explore.com:5577", irlPartUrl);
    setLastRecNo2LS(result);
    showData(result);

    jQuery.ajaxSetup({async: true});

    $('#first').prop('disabled', false);
    $('#prev').prop('disabled', false);
    $('#last').prop('disabled', true);
    $('#next').prop('disabled', true);
    $('#save').prop('disabled', true);

}
function getPrev()
{
    var r = getCurrRecNoFromLS();
    if (r === 1)
    {
        $('#first').prop('disabled', true);
        $('#prev').prop('disabled', true);
    }
    var getprevRequest = createPREV_RECORDRequest(connToken, empDBName, empRelationName, r);
    jQuery.ajaxSetup({async: false});
    var result = executeCommandAtGivenBaseUrl(getprevRequest, "http://api.login2explore.com:5577", irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});
    var r = getCurrRecNoFromLS();
    if (r === 1)
    {
        $('#first').prop('disabled', true);
        $('#prev').prop('disabled', true);
    }
    $('#save').prop('disabled', true);
}
function isNoRecordPresentLS()
{
    if (getFirstRecNoFromLS() === '0' && getLastRecNoFromLS() === '0')
    {
        return true;
    }
    return false;
}
function isOnlyOneRecordPresent()
{
    if (isNoRecordPresentLS())
    {
        return false;
    }
    if (getFirstRecNoFromLS() === getLastRecNoFromLS())
    {
        return true;
    }
    return false;

}
function checkForNoorOneRecord()
{
    if (isNoRecordPresentLS())
    {
        disableForm(true);
        disableNav(true);
        disableCtrl(true);
        $('#new').prop('disabled', false);
        return;

    }
    if (isOnlyOneRecordPresent())
    {
        disableForm(true);
        disableNav(true);
        disableCtrl(true);
        $('#new').prop('disabled', false);
        $('#edit').prop('disabled', false);
        return;

    }
}



initEmpForm();
getFirst();
getLast();
checkForNoorOneRecord();




