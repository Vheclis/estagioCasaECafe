function render_page(url) {
	console.log('render_page');
	if(url == '/plans'){
		console.log('call render_table');
		render_table(url);
	}
	else if (url == '/payment') {
		console.log('call render_form');
		render_form();
	}
}

function render_form()	{
	let div_content = document.getElementById('content');
	//	Testando se o conteúdo está vazio, caso não esteja eu o esvazio
	if(div_content.innerHTML != '') {
		div_content.innerHTML = '';
		div_content.className = '';
	}
	$.ajax({
		url				: './payment.html',
		datatype	: 'HTML',
		success		: (data) => {
			div_content.innerHTML = data;
			document.getElementById('header').className = 'jumbotron text-center bg-answear-default'
			document.getElementById('header-title').innerHTML = 'Novo Pagamento'
			document.getElementById('header-text').innerHTML 	= ''
		}
	})
}

function render_table (render_url) {
	let div_content = document.getElementById('content');
	//	Testando se o conteúdo está vazio, caso não esteja eu o esvazio
	if(div_content.innerHTML != '') {
		div_content.innerHTML = '';
		div_content.className = '';	
	}

	render_url = 'http://localhost:8080' + render_url;
	console.log(render_url);
	$.ajax({
		url 			: render_url,
		type			: 'GET',
		datatype	: 'JSON',
		success		: (data) => {
			let columns 		= [];
			//	Pegando  os diferentes planos, para poder me mover no JSON
			let plan_names 	= Object.keys(data);
			//	Pegando os campos de cada plano
			let headers 		= Object.keys(data[plan_names[0]]);
			//	Criando a tabela
			let table 			= document.createElement('table');
			//	Criando a primeira linha (que irá conter os headers)
			let tr 					= table.insertRow(-1);
			
			//	Colocando cada um dos headers na primeira linha
			for(i in headers)	{
				let th 				= document.createElement('th');
				th.innerHTML 	= headers[i];

				tr.appendChild(th);
			}

			/*
			 *	Tenho que fazer esse append a parte, assim como as rows dos nomes dos produtos,
			 *	pois os estou usando como chaves no meu arquivo JSON.
			 */
			th 						=	document.createElement('th');
			th.innerHTML 	= 'product';
			tr.className	=	'success text-center';
			tr.appendChild(th);

			/*
			 *	Agora, para cada um dos planos, eu pego todos os seus dados e populo a tabela. Usando
			 *	plan_names para me mover entre os planos e headers para me mover entre os campos.
			 */
			for(i in plan_names)	{
				tr = table.insertRow(-1);

				for(j in headers)		{
					let tab_content 			= tr.insertCell(-1);
					tab_content.innerHTML = data[plan_names[i]][headers[j]];
				}
				tab_content 					= tr.insertCell(-1);
				tab_content.innerHTML = plan_names[i];
			}
			//	Inserindo a tabela
			table.className 			= 'table table-striped table-hover table-bordered'
			div_content.className = 'table-responsive';
			div_content.appendChild(table);

			//	Alterando o header
			document.getElementById('header').className = 'jumbotron text-center bg-answear-success'
			document.getElementById('header-title').innerHTML	= 'Planos'
			document.getElementById('header-text').className 	=	'lead text-center' 
			document.getElementById('header-text').innerHTML 	= 'Aqui são exibidos todos os planos pré cadastrados nas <code>configurações</code>.'
		}
	})
}
