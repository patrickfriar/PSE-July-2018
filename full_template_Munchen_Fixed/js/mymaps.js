		var gja=[
				[9.834431,105.296184],
				[10.765258,106.603854],
				[21.036237,105.790583]
				];
		gja=poa.datamap;
		function goog_search(ops)
			{
			var m=gja	
			var mk={'only':false},ln;
			vmaps.vars.mlist=[];
			poa.mclick={};
			for(var i=0;i<m.length;i++)
				{
				dd=poa.data[i];
				mk.info_onclick='';
				mk.position={x:m[i][0],y:m[i][1]};
				mk.info_onclick='<h2>'+dd.name+'</h2>'+dd.address+'<br><b>Phone: '+dd.phone+'</b>';
				mk.icon=poa.icon;
				vmaps.viewpos(mk);
				ln=new google.maps.LatLng(m[i][0],m[i][1]);
				vmaps.vars.list.push(ln);
				
				}	
			
			}
		function maps_search()
			{
			function ab(stt)
				{
				vmaps.vars.id[0].setCenter(vmaps.vars.list[stt]);
				var ob=$('.div_contact_1 ul li');
				$(ob).removeClass('selected');
				$(ob).eq(stt).addClass('selected');
				}
			vmaps.search_near($('#haha').val(),ab);
			}
		goog_search();
		$('.itext').bind('keyup',function(e){
			if(e.keyCode == 13)
			{
			maps_search();	
			}
			
		});