export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const ADMIN_ID = process.env.ADMIN_ID;
  const WEBAPP_URL = 'https://colorpaisabot07.vercel.app';
  const tgApi = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  if (req.method !== 'POST') return res.status(200).send('Color Paisa Bot Active!');

  const body = req.body || {};

  // 1. Withdrawal Notification from Game to Admin Phone
  if (body.type === 'withdraw') {
    const msg = `💸 *NEW WITHDRAWAL REQUEST!*\n\n👤 *User ID:* \`${body.userId}\`\n📛 *Name:* ${body.name}\n💰 *Amount:* ₹${body.amount}\n🏦 *Method:* ${body.method}\n🆔 *Details:* \`${body.payoutId}\``;
    await fetch(tgApi, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: ADMIN_ID, text: msg, parse_mode: 'Markdown' })
    });
    return res.status(200).json({ ok: true });
  }

  // 2. Telegram Bot Webhook (/start & Menu Buttons)
  if (body.message) {
    const chatId = body.message.chat.id;
    const text = body.message.text || '';

    if (text.startsWith('/start')) {
      const welcome = `🧪 *Welcome to Color Paisa!*\n\n💧 Sort colors, complete levels, and earn real rewards!\n💰 *1,000 Gems = ₹1.00* (Instant Cloud Save)\n\n👇 Tap *Play Game* below to start earning!\n\n🎮 *More Earning Games:*\n👉 https://t.me/TapToPaisa_Official_bot?start=${chatId}\n👉 https://t.me/BlockPaisa_bot?start=${chatId}`;

      await fetch(tgApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: welcome,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🎮 Play Game', web_app: { url: WEBAPP_URL } }],
              [
                { text: '📜 Transaction History', callback_data: 'history' },
                { text: '👥 Refer and Earn', callback_data: 'refer' }
              ],
              [{ text: '🎧 Customer Support', url: 'https://t.me/ColorPaisaSupport' }]
            ]
          }
        })
      });
    }
  }

  // 3. Inline Button Clicks (Refer & History)
  if (body.callback_query) {
    const chatId = body.callback_query.message.chat.id;
    const data = body.callback_query.data;
    let reply = '';
    if (data === 'refer') {
      reply = `👥 *Refer & Earn!*\n\nShare your link with friends. When 1 friend joins & reaches Level 10, your ₹10 withdrawal unlocks!\n\n🔗 *Your Link:*\n\`https://t.me/ColorPaisaBot?start=ref_${chatId}\``;
    } else if (data === 'history') {
      reply = `📜 *Transaction History*\n\nOpen the game and check the *Wallet* tab to view your Gems, Withdrawal status & Loyalty Bonus!`;
    }
    if (reply) {
      await fetch(tgApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: reply, parse_mode: 'Markdown' })
      });
    }
  }

  return res.status(200).json({ ok: true });
}
