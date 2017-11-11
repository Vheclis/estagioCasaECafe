const { body, validationResult } = require('express-validator/check');
let express = require('express'),
     app = express(),
     port = 8080;

let body_parser = require('body-parser');

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

let Payment = require('./db.js')
let Plans = require('./config.js');

app.get('/plans', (req, res) => {
    res.contentType('application/json');
    let answer = [ {
      //coloquei os products como chaves e o campo 'name' para que a chave não tivesse espaço
      'gold_plan' :
        {
          name : Plans.gold_plan['name'], price : Plans.gold_plan['price'] , description : Plans.gold_plan['description']
        },
      'platinum_plan' :
        {
          name : Plans.platinum_plan['name'], price : Plans.platinum_plan['price'] , description : Plans.platinum_plan['description']
        },
      'super_premium_plan' :
        {
          name : Plans.super_premium_plan['name'] , price : Plans.super_premium_plan['price'] , description : Plans.super_premium_plan['description']
        }
    } ]
    res.status(200);
    res.json(answer);
  }
)

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
              if(!validationResult(req).isEmpty())
                return res.status(400).send("ERRO: Todos os campos devem ser preenchidos");
              /* Regex feito para conseguir pegar um número real sem me importar
               * com Strings que acompanhem esse dado.
               */
              let realNumber = new RegExp('(\\d*[.])?\\d+');

              /* Nas próximas duas variáveis eu transformei as ',' em '.' para
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


              let max_discount = Plans.max_discount;
              if (discount > max_discount)
                return res.status(400).send("ERRO: O desconto oferecido não pode ser superior a " + max_discount + "%");

              switch(product)
              {
                case 'gold_plan':
                let price_gold = Plans.gold_plan['price'].replace(',','.').match(realNumber)[0];
                if(product_price != price_gold)
                    return res.status(400).send("ERRO: O preço do produto não é compativel com o produto, deveria ser R$" + price_gold)

                break;
                case 'platinum_plan':
                let platinum_price = Plans.platinum_plan['price'].replace(',','.').match(realNumber)[0];
                if(product_price != platinum_price)
                    return res.status(400).send("ERRO: O preço do produto não é compativel com o produto, deveria ser R$" + platinum_price)

                break;
                case 'super_premium_plan':
                let super_premium_price = Plans.super_premium_plan['price'].replace(',','.').match(realNumber)[0];
                if(product_price != super_premium_price)
                    return res.status(400).send("ERRO: O preço do produto não é compativel com o produto, deveria ser R$" + super_premium_price)

                break;
                default:
                  return res.status(400).send("ERRO: O produto deve exisir. Deve ser um dos seguintes:\ngold_plan\nplatinum_plan\nsuper_premium_plan")
              }
              let product_price_f = parseFloat(product_price);
              let discount_f = parseFloat(discount);
              let price = product_price_f - ( (discount_f/100)*product_price_f );
              

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
              
            }
)

app.listen(port);
