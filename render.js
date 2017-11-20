/*
 *	Como não foi pedida nenhuma especificação sobre a transaction ID
 *	eu irei iniciar ela aqui, fazendo ela reiniciar a cada leitura do arquivo
 *	só para não deixar na mão do usuário esse tipo de input.
 */
let transaction_id = 0;

$(document).ready(function() {

	
	$('#payment-nav').click( function (event) {
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
				document.getElementById('header-title').innerHTML = 'Novo Pagamento'
				document.getElementById('header-text').innerHTML 	= 'Aqui são inseridos os novos pagamentos. '+
				'Os descontos não devem passar de 50% e os produtos devem ser correspondentes com seus preços.'
			}
		})
	});

	$('#plans-nav').click( function (event) {
		let div_content = document.getElementById('content');
		//	Testando se o conteúdo está vazio, caso não esteja eu o esvazio
		if(div_content.innerHTML != '') {
			div_content.innerHTML = '';
			div_content.className = '';	
		}

		let render_url = 'http://localhost:8080/plans';
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
					th.innerHTML 	= headers[i].charAt(0).toUpperCase() + headers[i].slice(1);;
					th.className	= 'text-center';
					tr.appendChild(th);
				}

				/*
				 *	Tenho que fazer esse append a parte, assim como as rows dos nomes dos produtos,
				 *	pois os estou usando como chaves no meu arquivo JSON.
				 */
				th 				=	document.createElement('th');
				th.innerHTML 	= 'Product';
				th.className	= 'text-center';
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
				table.className 			= 'table table-hover table-bordered'
				div_content.className = 'table-responsive';
				div_content.appendChild(table);

				//	Alterando o header
				document.getElementById('header-title').innerHTML	= 'Planos'
				document.getElementById('header-text').className 	=	'lead text-center' 
				document.getElementById('header-text').innerHTML 	= 'Aqui são exibidos todos os planos pré-cadastrados nas configurações.'
			}
		})
	});

})

$(document).on('submit', 'form' , function (event) {
		event.preventDefault();
		let request_data = $(this).serialize();
		request_data += '&transaction_id='+transaction_id;
		transaction_id += 1;
		console.log(request_data);
		let answear = document.getElementById('answer');
		$.ajax({
			url			: '/payment',
			type		: 'POST',
			data 		: request_data,
			success		: (data) => {
				answear.innerHTML = data;
				answear.className = 'bg-answear-success answer-box text-center'
			},
			error		: (xhr, status, error) => {
				answear.innerHTML = xhr.responseText;
				answear.className = 'bg-answear-error answer-box text-center'
			}
		});

		/*let request = {};
		let data = JSON.parse(JSON.stringify(jQuery(this).serializeArray()))
		for ( i in data){
			request[data[i]['name']] = data[i]['value'];
		}
		*/

	});
