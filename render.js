function render_page(url) {
	console.log('render_page');
	if(url == '/plans'){
		console.log('call render_table');
		render_table(url);
	}
	//else if (url == '/payment')

}


function render_table (render_url) {
	let div_content = document.getElementById('content');
	if(div_content.innerHTML != '')
		div_content.innerHTML = '';

	render_url = 'http://localhost:8080' + render_url;
	console.log(render_url);
	$.ajax({
		url 			: render_url,
		type			: 'GET',
		datatype	: 'JSON',
		success		: (data) => {
			let columns = [];
			let plan_names = Object.keys(data);
			let headers = Object.keys(data[plan_names[0]]);

			let table = document.createElement('table');
			let tr 		= table.insertRow(-1);


			for(i in headers)	{
				let th = document.createElement('th');
				th.innerHTML = headers[i];
				tr.appendChild(th);
			}

			/*
			 *	Tenho que fazer esse append a parte, assim como as rows dos nomes dos produtos,
			 *	pois os estou usando como chaves no meu arquivo JSON.
			 */
			th = document.createElement('th');
			th.innerHTML = 'product';
			tr.appendChild(th);

			for(i in plan_names)	{
				tr = table.insertRow(-1);

				for(j in headers)		{
					let tab_content = tr.insertCell(-1);
					tab_content.innerHTML = data[plan_names[i]][headers[j]];
				}
				tab_content = tr.insertCell(-1);
				tab_content.innerHTML = plan_names[i];
			}

			table.className = 'table table-striped table-hover'

			
			div_content.className = 'table-responsive';
			div_content.appendChild(table);
		}
	})
}