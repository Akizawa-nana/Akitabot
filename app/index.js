const { Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const token = "MTM5MjQ2NjQ1OTQwNTU4NjQ5Mg.Gt4W17.ZUMs9VWO3gNN6H7HUrbBE9jFAeY9lykARC_CcU";
const clientId = "1392466459405586492"; // BotのクライアントID

// スラッシュコマンド登録
const commands = [
  new SlashCommandBuilder()
    .setName('municipality')
    .setDescription('市区町村検知機能のON/OFFを切り替えるんご！多分動くんご')
    .addStringOption(option => 
      option.setName('action')
        .setDescription('on または off')
        .setRequired(false) // ここを true から false に
        .addChoices(
          { name: 'on', value: 'on' },
          { name: 'off', value: 'off' },
        )
    )
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(token);
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages],
});

let enableMunicipalityDetection = false;

client.once(Events.ClientReady, () => {
  console.log(`AKITABOT起動!!!! (${client.user.tag})`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'municipality') {
    const action = interaction.options.getString('action');

    // 引数なし時：状態確認
    if (!action) {
      const status = enableMunicipalityDetection ? 'ON' : 'OFF';
      await interaction.reply(`現在の市区町村検知モードは **${status}** です`);
      return;
    }

    // on/off切り替え
    if (action === 'on') {
      enableMunicipalityDetection = true;
      await interaction.reply('市区町村検知モード、**ON** ！');
    } else if (action === 'off') {
      enableMunicipalityDetection = false;
      await interaction.reply('市区町村検知モード、**OFF** ！');
    }
  }
});

client.on(Events.MessageCreate, message => {
  if (message.author.bot) return;
  const content = message.content.trim();

  if (content === "秋田は飽きた") {
    message.channel.send("くだらな");
    return;
  }

   const akitaPlaces = {
        "秋田市": "ゆるキャラあんまいないけど、秋麻呂くんとか？(No.0053)",
        "横手市": "やきそばの妖精(?)みたいなので、やきっピ",
        "大館市": "忠犬ハチ公で、ハチくん",
        "男鹿市": "本当は秋田県全域だけど、なまはげだからんだっチ(No.0052)",
        "湯沢市": "特産美少女紀行の稲川みなせ(No.0006)",
        "鹿角市": "きりたんぽ発祥の地で、たんぽ小町ちゃん",
        "由利本荘市": "殿堂入り、ゆりほん娘(No.0002)",
        "潟上市": "天王グリーンランドのスサのん",
        "大仙市": "大曲の花火のまるびちゃん(No.0038)",
        "北秋田市": "バター餅のキャラ、バタもっち",
        "にかほ市": "マスコットキャラクター、にかほっぺん",
        "仙北市": "うーん、田沢湖のおもてなし三兄弟？",
        "美郷町": "六郷の清水から生まれた、美郷のミズモ(No.0008)",
        "羽後町": "殿堂入り。たくさんありすぎて逆にむずいけど、うご野いちごちゃん？",
        "東成瀬村": "仙人のキャラ、なる仙くん",
        "三種町": "かっぱのキャラクター、じゅんくんとさいちゃん",
        "八峰町": "まったくなかったので、しらかみ三兄弟ということにしときます(No.0054)",
        "五城目町": "道の駅五城目のキャラ、ユキちゃん",
        "井川町": "まったくゆるキャラがいませんでした。スギッチってことにしときます(No.0001)",
        "大潟村": "まったくゆるキャラがいませんでした。スギッチってことにしときます(No.0001)",
        "小坂町": "歌舞伎なのかな？かぶきん",
        "藤里町": "白神山地のキャラ？駒之助だそうです"
    };

  // --- 市町村検出（ON時のみ） ---
  if (enableMunicipalityDetection) {
    for (const [place, reply] of Object.entries(akitaPlaces)) {
      if (content.includes(place)) {
        message.channel.send(`${place}：${reply}`);
        return;
      }
    }
  }

  const akitaVariants = ["秋田", "あきた", "アキタ", "AKITA", "ｱｷﾀ", "akita"];
  const foundAkita = akitaVariants.filter(word => content.includes(word));

  if (foundAkita.length === akitaVariants.length) {
    message.channel.send("シックス秋田検知！おめでとう！");
  } else if (foundAkita.length > 0) {
    message.channel.send("秋田を検知しました。");
  }
});

client.login(token);
