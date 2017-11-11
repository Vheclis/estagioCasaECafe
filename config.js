let Plans =  {
      //coloquei os products como chaves e o campo 'name' para que a chave não tivesse espaço
      'gold_plan' :
        {
          name : 'Plano Gold', price : 'R$ 59,90', description : 'plano pago gold'
        },
      'platinum_plan' :
        {
          name : 'Plano Platinum', price : 'R$ 79,90', description : 'premium platinum'
        },
      'super_premium_plan' :
        {
          name : 'Plano Super Premium', price : 'R$ 129,90', description : ' o melhor plano de todos'
        },
      'max_discount' : '50.00'
    };


module.exports = Plans;