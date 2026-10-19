// server.js (для Render.com / Railway)
const { Client } = require('@donationalerts/api');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('ТВОЙ_SUPABASE_URL', 'ТВОЙ_SERVICE_ROLE_KEY');
const da = new Client('ТВОЙ_DA_APP_ID', 'ТВОЙ_DA_SECRET', 'ТВОЙ_DA_REDIRECT_URL');

da.on('donation', async (data) => {
  const email = data.message.trim(); // Юзер пишет почту в сообщении
  const amount = data.amount; // Сумма в рублях
  
  console.log(`Донат от ${email} на ${amount} руб.`);
  
  // Ищем юзера по email и пополняем баланс
  const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).single();
  if (profile) {
    const { data: current } = await supabase.from('profiles').select('balance').eq('id', profile.id).single();
    const newBalance = (current.balance || 0) + amount;
    await supabase.from('profiles').update({ balance: newBalance }).eq('id', profile.id);
    console.log(`Баланс ${email} пополнен до ${newBalance}`);
  }
});

da.connect();
