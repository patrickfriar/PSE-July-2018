var vmaps={vars:{'id':{},'market':'','list':[],'buff':{}}};
vmaps.head=function(ops)
{
var dfs={'key':'AIzaSyCHk1k1Xj_gzxjh10jN873yGvzxxF6qXbI'};
ops=$.extend({},dfs,ops);
ops.s="<script type='text/javascript' src='https://maps.googleapis.com/maps/api/js?key="+ops.key+"&sensor=false&v=3&libraries=geometry'></script>";
$('head').eq(0).append(ops.s);
}

vmaps.calc_space=function(latLngA, latLngB)
{
	return google.maps.geometry.spherical.computeDistanceBetween(latLngA, latLngB);
}
vmaps.createMaps=function(ops)
{
	var dfs={'id_get':'maps','id':'0','position':{'x':'37.4419','y':'-122.1419'},'zoom':6,'type':'ROADMAP'};
	ops=$.extend({},dfs,ops);
	

	if(!vmaps.vars.id[ops.id])
	{
		
	if(ops.width || ops.height)
	{
		var ob=$('#'+ops.id_get);
		if(ops.width)$(ob).css({'width':ops.width});
		if(ops.height)$(ob).css({'height':ops.height});
	}			
		
	var map = new google.maps.Map(document.getElementById(ops.id_get),{
		'center':new google.maps.LatLng(ops.position.x,ops.position.y ),
		'zoom':ops.zoom,
		'type':google.maps.MapTypeId[ops.type]
	});
    vmaps.vars.id[ops.id]=map;
	
	}
	
}
vmaps.viewpos=function(ops)
{
	var dfs={'id':'0','location':'','position':'','only':true,'center':true,'info_onclick':'','icon':''};
	var ops=$.extend({},dfs,ops);
	var mk={'map':ops.map};
	if(!mk.map)
		{
		vmaps.createMaps({'id':ops.id});
		mk.map=vmaps.vars.id[ops.id];
		}
	if(ops.position)mk.position=new google.maps.LatLng(ops.position.x,ops.position.y);
	if(ops.location)mk.position=ops.location;
	if(ops.center)
	{
		mk.map.setCenter(mk.position);
		
	}
	if(!ops.only)
	{
		var marker = new google.maps.Marker(mk);
		if(ops.info_onclick)
		{
			marker.infowindow = new google.maps.InfoWindow({content: ops.info_onclick});//infowindow.open(mk.map,marker);
			marker.status = false;
			google.maps.event.addListener(marker, 'click', function() {marker.status=!marker.status;if(marker.status)marker.infowindow.open(mk.map,marker);else marker.infowindow.close(); });	
		}	
		if(ops.icon){marker.setIcon(ops.icon);}
	}
	else
		{
			if(vmaps.vars.market)vmaps.vars.market.setMap(null);
			vmaps.vars.market=new google.maps.Marker(mk);
			if(ops.icon){vmaps.vars.market.setIcon(ops.icon);}
		}
	//vmaps.vars.list.push(mk.position);
}
vmaps.showAddress=function(ops) {
	var dfs={'search':'','id':'0','only':true};
	ops=$.extend({},dfs,ops);
	vmaps.createMaps(ops);	
	
     if (vmaps.vars.id[ops.id]) {
		var geocoder=new google.maps.Geocoder();
        geocoder.geocode(
		{'address':ops.search},
          function(results, status) {
             if (status != google.maps.GeocoderStatus.OK)  {
              alert(ops.search + " not found");
            } else {
			
			vmaps.viewpos({'map':vmaps.vars.id[ops.id],'location':results[0].geometry.location});

            }
          }
        );
      }
    }
	
vmaps.search_near=function(string,callback)
{
	var a=null;
	var rt=-1;
	var geocoder=new google.maps.Geocoder();
	geocoder.geocode({'address':string},function(results, status){
		if (status != google.maps.GeocoderStatus.OK)
			{alert(string + " not found");}
		else {
			a=results[0].geometry.location;
			if(a && vmaps.vars.list.length)
			{
				var min=vmaps.calc_space(a,vmaps.vars.list[0]);
				var c=0;rt=0;
			for(var i=1;i<vmaps.vars.list.length;i++)
				{
					c=vmaps.calc_space(a,vmaps.vars.list[i]);
					if(min>c){min=c;rt=i;}
					//vmaps.viewpos(vmaps.list[i]);
				}

			}
			callback(rt);
			//return rt;			
		}
	});

}