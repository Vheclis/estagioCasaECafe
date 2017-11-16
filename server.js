const { body, validationResult } = require('express-validator/check');
let express = require('express'),
     app = express(),
     port = 8080;

let http = require('http');
let fs = require('fs');

let render = require('./render.js')

app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
  res.redirect('/index.html');
})

let body_parser = require('body-parser');

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

let Payment = require('./db.js')
const Config = require('./config.js');
let plan_names = Object.keys(Config.plans)

/*  
 *  A linha seguinte faz uma cópia do que está no Config.plans
 *  de uma forma que alterar get_answear não alterará Config.plans.
 */
let get_answear = JSON.parse(JSON.stringify(Config.plans));
for (let i in plan_names)
      get_answear[plan_names[i]].price = 'R$ ' + get_answear[plan_names[i]].price.toString()



app.get('/plans', (req, res) => {
    res.contentType('application/json'); 
    res.status(200);
    console.log('ESTAMOS NO GET');
    res.send(get_answear);
  }
)

 /*
  * Para checar se todas as variáveis foram preenchidas eu faço uso 
  * do express-validator, na função abaixo. Podemos ver que eu coloco
  * uma regra de que deve existir cada um dos atributos no req.body
  * através dos comandos body(<variavel>).exists().
  */

app.post('/payment',
          [
            body('payment_date').exists(),
            body('payment_type').exists(),
            body('product').exists(),
            body('product_price').exists(),
            body('discount').exists(),
            body('transaction_id').exists()
          ],
          (req, res) => {
               /*
                * A próxima linha faz o teste se todas as regras inseridas no 
                * express-validator foram respeitadas, validationResult é vazio
                * se todas as regras forem respeitadas.
                */
              if(!validationResult(req).isEmpty())
                return res.status(400).send("ERRO: Todos os campos devem ser preenchidos");
              /* 
               * Regex feito para conseguir pegar um número real sem me importar
               * com Strings que acompanhem esse dado.
               */
              let realNumber = new RegExp('(\\d*[.])?\\d+');

              /* 
               * Nas próximas duas variáveis eu transformei as ',' em '.' para
               * poder usar parseFloat corretamente e usei o RegExp para
               * conseguir pegar o número, independente de como foi feita a
               * input.
               */
              let product_price = req.body.product_price.replace(',','.').match(realNumber)[0];
              let discount = req.body.discount.replace(',','.').match(realNumber)[0];
              let payment_date = req.body.payment_date
              let payment_type = req.body.payment_type;
              let product = req.body.product;
              let transaction_id = req.body.transaction_id;


              let max_discount = Config.max_discount;
              if (discount > max_discount)
                return res.status(400).send("ERRO: O desconto oferecido não pode ser superior a " + max_discount + "%");


              let right_plan = plan_names.find((element) => {return element == product})

              if(right_plan)
              {
                let right_price = Config.plans[right_plan]['price']
                let product_price_f = parseFloat(product_price);
                if(product_price_f != right_price)
                  return res.status(400).send("ERRO: O preço do produto não é compativel com o produto, deveria ser R$ " + right_price);
                let discount_f = parseFloat(discount);
                let price = right_price - ( (discount_f/100)*right_price );
                let payment = Payment({
                  db_payment_date   : payment_date,
                  db_payment_type   : payment_type,
                  db_product        : product,
                  db_product_price  : product_price,
                  db_discount       : discount,
                  db_transaction_id : transaction_id
                })

                payment.save(function(err){
                  if(err) return res.status(500).send("ERRO: Erro ao inserir dados no banco de dados");

                  res.status(200).send("Pagamento registrado com sucesso")
                })
                return ;
              }
              
              let err_answear = "ERRO: O produto deve exisir. Deve ser um dos seguintes:\n";
              for (let i in plan_names)
                err_answear += plan_names[i] + "\n"
              return res.status(400).send(err_answear);
              
            }
)

app.listen(port);
