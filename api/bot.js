export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const ADMIN_ID = process.env.ADMIN_ID;
  const WEBAPP_URL = 'https://colorpaisabot07.vercel.app';
  const tgApi = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  if (req.method !== 'POST') return res.status(200).send('Color Paisa Bot Active!');

  const body = req.body || {};

  if (body.type === 'withdraw') {
    const msg = `💸 <b>NEW WITHDRAWAL REQUEST!</b>\n\n👤 <b>User ID:</b> <code>${body.userId}</code>\n📛 <b>Name:</b> ${body.name}\n💰 <b>Amount:</b> ₹${body.amount}\n🏦 <b>Method:</b> ${body.method}\n🆔 <b>Details:</b> <code>${body.payoutId}</code>`;
    await fetch(tgApi, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: ADMIN_ID, text: msg, parse_mode: 'HTML' })
    });
    return res.status(200).json({ ok: true });
  }

  if (body.message) {
    const chatId = body.message.chat.id;
    const text = body.message.text || '';

    if (text.startsWith('/start')) {
      const welcome = `🧪 <b>Welcome to Color Paisa!</b>\n\n💧 Sort colors, complete levels, and earn real rewards!\n💰 <b>1,000 Gems = ₹1.00</b> (Instant Cloud Save)\n\n👇 Tap <b>Play Game</b> below to start earning!\n\n🎮 <b>More Earning Games:</b>\n👉 https://t.me/TapToPaisa_Official_bot?start=${chatId}\n👉 https://t.me/BlockPaisa_bot?start=${chatId}`;

      await fetch(tgApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: welcome,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🎮 Play Game', web_app: { url: WEBAPP_URL } }],
              [
                { text: '📜 Transaction History', callback_data: 'history' },
                { text: '👥 Refer and Earn', callback_data: 'refer' }
              ],
              [{ text: '🎧 Customer Support', url: 'https://t.me/ColorPaisaBot' }]
            ]
          }
        })
      });
    }
  }

  if (body.callback_query) {
    const chatId = body.callback_query.message.chat.id;
    const data = body.callback_query.data;
    let reply = '';
    if (data === 'refer') {
      reply = `👥 <b>Refer & Earn!</b>\n\nShare your link with friends. When 1 friend joins & reaches Level 10, your ₹10 withdrawal unlocks!\n\n🔗 <b>Your Link:</b>\n<code>https://t.me/ColorPaisaBot?start=ref_${chatId}</code>`;
    } else if (data === 'history') {
      reply = `📜 <b>Transaction History</b>\n\nOpen the game and check the <b>Wallet</b> tab to view your Gems, Withdrawal status & Loyalty Bonus!`;
    }
    if (reply) {
      await fetch(tgApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: reply, parse_mode: 'HTML' })
      });
    }
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: body.callback_query.id })
    });
    
  }

  return res.status(200).json({ ok: true });
}
