var connToken = "90938077|-31949268713321395|90953047";
var empDBName = "RAW_DB";
var empRelationName = "INWARD";
var createTime = false;
var updateTime = false;
var jpdbIRL = '/api/irl';



function GetitemID_AsJsonobj(itemid)
{
    var itemid = itemid;
    var jsonStr = {
        itemid: itemid
    };
    return JSON.stringify(jsonStr);
}



function GetempID_AsJsonobj()
{
    
    var recId = $('#recid').val();   
    var jsonStr = {
        recid: recId
    };
    return JSON.stringify(jsonStr);
}



function fillTable() {


    let table = document.getElementById("myTable");
  
    let row = table.insertRow(-1); // We are adding at the end

    // Create table cells
    let c1 = row.insertCell(0);
    let c2 = row.insertCell(1);
    let c3 = row.insertCell(2);
    var obj = GetempID_AsJsonobj();
    var getrequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, obj, createTime, updateTime);
   
    jQuery.ajaxSetup({async: false});
    var res = executeCommandAtGivenBaseUrl(getrequest, "http://api.login2explore.com:5577", "/api/irl");
   
    jQuery.ajaxSetup({async: true});
    var data = JSON.parse(res.data).record;
    var id = data.itemid;
    var stk = data.itemqtn;
    if (res.status === 400)
    {
        alert("Data not available");
    } else if (res.status === 200)
    {
      
        // Add data to c1 and c2
        c1.innerText = id;
        var obj = GetitemID_AsJsonobj(id);
        var getrequest = createGET_BY_KEYRequest(connToken, empDBName, 'ITEMS', obj, createTime, updateTime);
        jQuery.ajaxSetup({async: false});
        var res = executeCommandAtGivenBaseUrl(getrequest, "http://api.login2explore.com:5577", "/api/irl");
        var data1 = JSON.parse(res.data).record;
        c2.innerText = data1.itemname;
        c3.innerText = stk;
    }
}


 