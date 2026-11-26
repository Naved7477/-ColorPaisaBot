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

    const bottomMenu = {
      keyboard: [
        [{ text: '🎮 Play Game', web_app: { url: WEBAPP_URL } }],
        [{ text: '📜 Transaction History' }, { text: '👥 Refer and Earn' }],
        [{ text: '🎧 Customer Support' }]
      ],
      resize_keyboard: true,
      is_persistent: true
    };

    if (text.startsWith('/start')) {
            const refCode = text.slice(7).trim();
      if (refCode.startsWith('ref_')) {
        const referrerId = refCode.slice(4);
        if (referrerId && referrerId !== String(chatId)) {
          await fetch(`https://colourpaisabot-default-rtdb.asia-southeast1.firebasedatabase.app/users/${chatId}/referredBy.json`, {
            method: 'PUT',
            body: JSON.stringify(referrerId)
          });
        }
      }
      const welcome = `🧪 <b>Welcome to Color Paisa!</b>\n\n💧 Sort colors, complete levels, and earn real rewards!\n💰 <b>1,000 Gems = ₹1.00</b> (Instant Cloud Save)\n\n👇 Tap <b>Play Game</b> below to start earning!\n\n🎮 <b>More Earning Games:</b>\n👉 https://t.me/TapToPaisa_Official_bot?start=${chatId}\n👉 https://t.me/BlockPaisaGame_bot?start=${chatId}`;
      await fetch(tgApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: welcome, parse_mode: 'HTML', reply_markup: bottomMenu })
      });
    } else if (text === '👥 Refer and Earn') {
      const reply = `👥 <b>Refer & Earn!</b>\n\nShare your link with friends. When 1 friend joins & reaches Level 10, your ₹10 withdrawal unlocks!\n\n🔗 <b>Your Link:</b>\n<code>https://t.me/ColorPaisaBot?start=ref_${chatId}</code>`;
      await fetch(tgApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: reply, parse_mode: 'HTML', reply_markup: bottomMenu })
      });
    } else if (text === '📜 Transaction History') {
      const reply = `📜 <b>Transaction History</b>\n\nOpen <b>Play Game</b> and check the <b>Wallet</b> tab to view your Gems, Withdrawal status & Loyalty Bonus!`;
      await fetch(tgApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: reply, parse_mode: 'HTML', reply_markup: bottomMenu })
      });
    } else if (text === '🎧 Customer Support') {
      const reply = `🎧 <b>Customer Support</b>\n\nNeed help with payouts or referrals? Message us at @ColorPaisaBot or check your Wallet tab inside the game!`;
      await fetch(tgApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: reply, parse_mode: 'HTML', reply_markup: bottomMenu })
      });
    }
  }

  return res.status(200).json({ ok: true });
}
