var jpdbBaseURL = 'http://api.login2explore.com:5577';
var connToken = "90938077|-31949268713321395|90953047";
var jpdbIML = '/api/iml';
var jpdbIRL = '/api/irl';
var empDBName = "RAW_DB";
var empRelationName = "OUTWARD";
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
    $('#recid').prop('disabled', bValue);
    $('#recdate').prop('disabled', bValue);
    $('#itemid').prop('disabled', bValue);
    $('#itemnm').prop('disabled', bValue);
    $('#itemqtn1').prop('disabled', bValue);

}
//function save_rectoLS(res)
//{
//    var lvdata = JSON.parse(res.data);
//    localStorage.setItem('rec_no1', lvdata.rec_no1);
//
//}
function GetempID_AsJsonobj()
{
    var recId = $('#recid').val();
    var jsonStr = {
        recid: recId
    };
    return JSON.stringify(jsonStr);
}
function GetitemID_AsJsonobj()
{
    var itemid = $('#itemid').val();
    var jsonStr = {
        itemid: itemid
    };
    return JSON.stringify(jsonStr);
}
function chgData(final_qtn)
{

    var jsonStr = {
        itemqtn: final_qtn
    };
    return JSON.stringify(jsonStr);
}

function  filldata(res)
{
    setCurrRecNo2LS(res);
    var data = JSON.parse(res.data).record;
    $('#recdate').val(data.recdate);

    $('#itemid').val(data.itemid);
    $('#itemqtn1').val(data.itemqtn1);


}
function getdata1()
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
        $('#recid').focus();
    }



}
function getnm()
{
    var obj = GetitemID_AsJsonobj();
    var getrequest = createGET_BY_KEYRequest(connToken, empDBName, 'ITEMS', obj, createTime, updateTime);
    jQuery.ajaxSetup({async: false});
    var res = executeCommandAtGivenBaseUrl(getrequest, "http://api.login2explore.com:5577", "/api/irl");

    jQuery.ajaxSetup({async: true});
    if (res.status === 400)
    {
        alert("Item not present");
        $('#itemnm').val("");
        $('#itemid').val("");
        $('#itemid').focus();

        $('#save').prop('disabled', true);

        $('#reset').prop('disabled', false);

    } else if (res.status === 200)
    {
        var data = JSON.parse(res.data).record;
        $('#itemnm').prop('disabled', false);
        $('#itemnm').val(data.itemname);
        $('#change').prop('disabled', false);
        $('#save').prop('disabled', true);
        $('#edit').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#recid').focus();
    }



}
function getqtn()
{
    var obj = GetitemID_AsJsonobj();
    var getrequest = createGET_BY_KEYRequest(connToken, empDBName, 'INWARD', obj, createTime, updateTime);
    jQuery.ajaxSetup({async: false});
    var res = executeCommandAtGivenBaseUrl(getrequest, "http://api.login2explore.com:5577", "/api/irl");

    jQuery.ajaxSetup({async: true});
    if (res.status === 400)
    {
        alert("Enter Item-ID correctly! ");
        $('#itemnm').val("");
        $('#itemid').val("");
        $('#itemid').focus();

        $('#save').prop('disabled', true);

        $('#reset').prop('disabled', false);

    } else if (res.status === 200)
    {
        var data = JSON.parse(res.data).record;
        var qtn = data.itemqtn;
       
        var curr_qtn = $('#itemqtn1').val();
        if (curr_qtn <= qtn)
        {
            $('#save').prop('disabled', false);

        } else if (curr_qtn > qtn) {
            alert("Quantity entered is more than available");
            $('#save').prop('disabled', true);
            $('#itemqtn1').val("");
            $('#itemqtn1').focus();
        }


    }



}
function changeqtn()
{
    var cur_qtn = $('#itemqtn1').val();
    var obj = GetitemID_AsJsonobj();
    var getrequest = createGET_BY_KEYRequest(connToken, empDBName, 'INWARD', obj, createTime, updateTime);
    jQuery.ajaxSetup({async: false});
    var res = executeCommandAtGivenBaseUrl(getrequest, "http://api.login2explore.com:5577", "/api/irl");

    jQuery.ajaxSetup({async: true});
    var data = JSON.parse(res.data).record;
    var qtn = data.itemqtn;
    var final_qtn = qtn - cur_qtn;

    var jsonchg = chgData(final_qtn);
    var updateRequest = createUPDATERecordRequest(connToken, jsonchg, empDBName, 'INWARD', getCurrRecNoFromLS());
    jQuery.ajaxSetup({async: false});
    var res = executeCommandAtGivenBaseUrl(updateRequest, "http://api.login2explore.com:5577", "/api/iml");
    jQuery.ajaxSetup({async: true});
    alert("Transaction Done");


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
    $('#recid').val(data.recid);
    $('#recdate').val(data.recdate);
    $('#itemid').val(data.itemid);
    $('#itemqtn1').val(data.itemqtn1);
    $('#itemnm').val("");

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
    var Eid, Edt, EDA, Esal;
    Eid = $('#recid').val();
    Edt = $('#recdate').val();
    Esal = $('#itemid').val();
    EDA = $('#itemqtn1').val();

    if (Eid === "") {
        alert("Please enter correct Issue Number ");
        $("#recid").focus();
        return "";
    }
    if (Edt === "") {
        alert("Please enter correct Issue Date ");
        $("#recdate").focus();
        return "";
    }

    if (Esal === "") {
        alert("Please enter Item Id");
        $("#itemid").focus();
        return "";
    }
    if (EDA === "") {
        alert("Item quantity is Required Value");
        $("#itemqtn1").focus();
        return "";
    }

    var jsonStrObj = {
        recid: Eid,
        recdate: Edt,

        itemid: Esal,
        itemqtn1: EDA

    };
    return JSON.stringify(jsonStrObj);


}
function newemp()
{
    makeDataFormEmpty();
    disableForm(false);
    $('#recid').focus();
    disableNav(true);
    disableCtrl(true);
    $('#itemnm').val("");
    $('#itemnm').prop('disabled', true);
    $('#save').prop('disabled', false);
    $('#reset').prop('disabled', false);

}
function makeDataFormEmpty()
{
    $('#recid').val("");
    $('#recdate').val("");
    $('#itemid').val("");
    $('#itemqtn1').val("");
    $('#itemnm').val("");

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
    changeqtn();
    alert('Data saved sucessfully');
    $('#itemnm').val("");

    reset();



}
function edit()
{
    disableForm(false);
    $('#recid').prop('disabled', true);
    $('#recdate').focus();
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
    $('#recid').focus();
    $('#edit').focus();
    alert("Data Updated Sucessfully");
}

function reset()
{
    disableCtrl(true);
    disableNav(false);
    makeDataFormEmpty();
    $('#new').prop('disabled', false);
    $('#recid').focus();
    $('#itemnm').prop('disabled', true);
    var getCurRequest = createGET_BY_RECORDRequest(connToken, empDBName, empRelationName, getCurrRecordNoFromLS());
    jQuery.ajaxSetup({async: false});
    var result = executeCommandAtGivenBaseUrl(getCurRequest, "http://api.login2explore.com:5577", irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});
    if (isOnlyOneRecordPresent() || isNoRecordpresentLS())
    {
        disableNav(true);
    }
    $('#new').prop('disabled', false);
    if (isOnlyOneRecordPresent())
    {
        makeDataFormEmpty();


        $('#edit').prop('disabled', true);
    } else
    {
        $('#edit').prop('disabled', false);
    }

    disableForm(true);


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
    $('#recid').prop('disabled', true);
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






