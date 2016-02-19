function generateDashboard(data,geom){
    var map = new lg.map('#map').geojson(geom).nameAttr('CNTRY_NAME').joinAttr('Iso_Code').zoom(3).center([50,30]);

    var grid = new lg.grid('#grid')
        .data(data)
        .width($('#grid').width())
        .height(1200)
        .nameAttr('#country+code')
        .joinAttr('#country+code')
        .hWhiteSpace(4)
        .vWhiteSpace(4)
        .margins({top: 200, right: 20, bottom: 30, left: 50})
        .columns(['#refugees+2015_2016','#capacity+volunteers','#capacity+staff','#beneficiary+num','#shelter+permanent','#shelter+temporary','#activity+distribution+relief_kits','#activity+distribution+hygiene_kits','#activity+distribution+food_parcels','#activity+distribution+meals','#activity+distribution+water_bottles','#activity+distribution+hot_cold_drinks','#activity+distribution+blankets','#activity+distribution+clothing','#activity+connectivity+provision','#activity+medical_care+provision','#activity+first_aid+provision','#activity+provision+psychosocial_support','#activity+rfl','#activity+reunified+rfl']);

    lg.init();

    $("#map").width($("#map").width());
}

function stickydiv(){
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    if (window_top > div_top){
        $('#map-container').addClass('sticky');
    }
    else{
        $('#map-container').removeClass('sticky');
    }
};

function hxlProxyToJSON(input,headers){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();                    
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
            console.log(keys);
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}

function cleanData(data){
    data.forEach(function(r,i){
        r.forEach(function(d,i2){
            if(d=='-99'){
                data[i][i2]='Not Provding Service';
            } else if (d=='-999'){
                data[i][i2]='Not Available';
            } else if (d=='-9999'){
                data[i][i2]='No Response';
            }
        });
    });
    return data;
}

$(window).scroll(function(){
    stickydiv();
}); 

//load data

var dataCall = $.ajax({ 
    type: 'GET', 
    url: 'https://proxy.hxlstandard.org/data.json?url=https%3A//docs.google.com/spreadsheets/d/1iGYFGpfaA5RBJnJxFZkpRkGkrWSTKsRAi4q7ahTSTNg/pub%3Fgid%3D23218541%26single%3Dtrue%26output%3Dcsv&select-query01-01=%23date%3D15-Feb-2016&filter01=select&strip-headers=on', 
    dataType: 'json',
});

//load geometry

var geomCall = $.ajax({ 
    type: 'GET', 
    url: 'data/geom.json', 
    dataType: 'json',
});

//when both ready construct dashboard

$.when(dataCall, geomCall).then(function(dataArgs, geomArgs){
    var geom = topojson.feature(geomArgs[0],geomArgs[0].objects.geom);
    var data = cleanData(dataArgs[0]);
    data = hxlProxyToJSON(data);
    generateDashboard(data,geom);
});
