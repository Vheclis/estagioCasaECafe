const { body, validationResult } = require('express-validator/check');
var express = require('express'),
  app = express(),
  port = 8080;

var body_parser = require('body-parser');

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

Payment = require('./db.js')



app.get('/plans', function(req, res)
  {
    res.contentType('application/json');
    var answer = [ {
      'Plano Gold' :
        {
          product : 'gold_plan', price : 'R$ 59,90', description : 'plano pago gold'
        },
      'Plano Platinum' :
        {
          product : 'platinum_plan', price : 'R$ 79,90', description : 'premium platinum'
        },
      'Plano Super Premium' :
        {
          product : 'super_premium_plan', price : 'R$ 129,90', description : ' o melhor plano de todos'
        }
    } ]
    res.status(200);
    res.send(JSON.stringify(answer, null, '\t'));
  }
)

app.post('/payment',
          [
            body('payment_date').exists(),
            body('payment_type').exists(),
            body('product').exists(),
            body('product_price').exists(),
            body('discount').exists(),
            body('price').exists(),
            body('transaction_id').exists()
          ],
          function(req, res)
            {
              if(!validationResult(req).isEmpty())
                return res.status(406).send("ERRO: Todos os campos devem ser preenchidos");
              /* Regex feito para conseguir pegar um número real sem me importar
               * com Strings que acompanhem esse dado.
               */
              var realNumber = new RegExp('(\\d*[.])?\\d+');

              /* Nas próximas três variáveis eu transformei as ',' em '.' para
               * poder usar parseFloat corretamente e usei o RegExp para
               * conseguir pegar o número, independente de como foi feita a
               * input.
               */
              var product_price = req.body.product_price.replace(',','.').match(realNumber)[0];
              var discount = req.body.discount.replace(',','.').match(realNumber)[0];
              var price = req.body.price.replace(',','.').match(realNumber)[0];
              var payment_date = req.body.payment_date
              var payment_type = req.body.payment_type;
              var product = req.body.product;
              var transaction_id = req.body.transaction_id;



              if (discount > 50.00)
                return res.status(406).send("ERRO: O desconto oferecido não pode ser superior a 50%");

              switch(product)
              {
                case 'gold_plan':

                if(product_price != 59.90)
                    return res.status(406).send("ERRO: O preço do produto não é compativel com o produto, deveria ser R$59,90")

                break;
                case 'platinum_plan':
                if(product_price != 79.90)
                    return res.status(406).send("ERRO: O preço do produto não é compativel com o produto, deveria ser R$79,90")

                break;
                case 'super_premium_plan':
                if(product_price != 129.90)
                    return res.status(406).send("ERRO: O preço do produto não é compativel com o produto, deveria ser R$129,90")

                break;
                default:
                  return res.status(406).send("ERRO: O produto deve exisir. Deve ser um dos seguintes:\ngold_plan\nplatinum_plan\nsuper_premium_plan")
              }

              var payment_price = parseFloat(product_price) - ( (parseFloat(discount)/100)*parseFloat(product_price) );
              if (payment_price != price)
                return res.status(406).send("ERRO: Valor a ser pago pelo cliente inserido incorretamente. 'price' deve valer: " + payment.toString() );

              var payment = Payment({
                db_payment_date   : payment_date,
                db_payment_type   : payment_type,
                db_product        : product,
                db_product_price  : product_price,
                db_discount       : discount,
                db_price          : price,
                db_transaction_id : transaction_id
              })

              payment.save(function(err){
                if(err) return res.status(500).send("ERRO: Erro ao inserir dados no banco de dados");

                res.status(200).send("Pagamento registrado com sucesso")
              })

            }
)
app.listen(port);
