
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.listen(3000, () => {
  console.log('STARTED');
});
process.on("unhandledRejection", error => {
  return;
});
process.on("unhandledRejection", error => {
  return;
});
process.on("unhandledRejection", error => {
  return;
});


const Discord = require('discord.js');
const client = new Discord.Client({
    intents: ['GUILDS', 'GUILD_MESSAGES']
});
const db = require("pro.db")
const cooldown = new Set()
var isHexcolor = require('is-hexcolor')
const isImageURL = require('is-img')
const moment = require("moment");
require("moment-duration-format");
const synchronizeSlashCommands = require('discord-sync-commands');
synchronizeSlashCommands(client, [
    {
        name: 'share',
        description: 'To Share Your Server'
    }, 
     {
        name: 'set-channel',
        description: 'To Set Channel Share', 
       options:[
       {
         name:"channel", 
         description:"The Share Channel", 
         channelTypes:["GUILD_TEXT"], 
         required:true, 
         type:"CHANNEL"
        }, 
        {
         name:"description", 
         description:"The Description you want", 
         required:true, 
         type:"STRING"
        }
       ] 
    }, 
    
    {
      name:"color", 
      description:"To Set Color Of Embed", 
      options:[
              {
         name:"color", 
         description:"(hex Color)", 
         required:true, 
         type:"STRING"
        }
      ]
    }, 
    
    {
      name:"banner", 
      description:"To Set Banner Of Embed", 
      options:[
              {
         name:"link", 
         description:"The link banner", 
         required:true, 
         type:"STRING"
        }
      ]
    }, 
{
    name:"help", 
    description:"To See All Commands"
}, 
{
    name:"invite", 
    description:"To Invite The Bot"
}, 
{
    name:"preview", 
    description:"To See Preview Embed of Your Server"
}, 
{
    name:"ping", 
    description:"To See Ping Bot"
}, 
{
    name:"botinfo", 
    description:"To See Info bot"
}
], {
    debug: true
});

client.on('ready', () => {
    console.log('Ready!');
    client.user.setActivity(`/help | ${client.guilds.cache.size} Servers`, {type:"PLAYING"})
    
});

client.on('interactionCreate', async (interaction) => {

    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'share') {
if (cooldown.has(interaction.guild.id)) {
interaction.reply({embeds:[
new Discord.MessageEmbed()
.setColor('#454DCE')
.setDescription("Wait an 1 hour to Share your server")
],ephemeral:true});
    } else {
if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({embeds:[
  new Discord.MessageEmbed()
     .setColor('#454DCE')
.setDescription(`You Don't Have \`\`ADMINISTRATOR\`\` premission`)
   ], ephemeral:true})
if(!db.has(`share_${interaction.guild.id}`)){
interaction.reply({embeds:[
  new Discord.MessageEmbed()
     .setColor('#454DCE')
.setDescription(`I can't find the Share Channel, please make the Share room using \`\`/set-share\`\` `)
   ], ephemeral:true})
}else{
const invite = await interaction.channel.createInvite()

client.guilds.cache.forEach((guild) => {
let data = db.get(`share_${guild.id}`);
if (data == null) return;
if (guild.id == null) return;
let your = db.get(`share_${interaction.guild.id}`)

let row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setLabel(`${interaction.guild.name}`)
					.setURL(`${invite}`)
					.setStyle('LINK'),
                        				new Discord.MessageButton()
                .setCustomId("111")
                .setLabel(`Boosts: ${interaction.guild.premiumSubscriptionCount || '0'}`)
                .setStyle("PRIMARY"),
					);

let e = new Discord.MessageEmbed()
.setAuthor({name:interaction.guild.name,icon_url:interaction.guild.iconURL()})
.setThumbnail(interaction.guild.iconURL({inline: true}))
.setColor(db.get(`color_${interaction.guild.id}`))
.addField('**📝 __Description__:**' , `${your.desc} `)
.addField('**📅 __Created At__:**' , `<t:${~~(interaction.guild.createdTimestamp / 1000)}:d> `,true)
.addField('**👥 __Members__**:' , `${interaction.guild.memberCount}`,true)
.addField('**🗂 __Channels__**:' , `${interaction.guild.channels.cache.size}`,true)
.setImage(db.get(`banner_${interaction.guild.id}`))
client.channels.cache.get(data?.ChannelID)?.send({content: `invite : ${invite}`,embeds:[e], components:[row]})
})

interaction.reply({embeds:[new Discord.MessageEmbed()
     .setColor('#454DCE')
.setDescription(" Done Shared Your Server in " + `\`\`${client.guilds.cache.size} server \`\``)
   ], ephemeral:true})
      cooldown.add(interaction.guild.id);
        setTimeout(() => {
                    cooldown.delete(interaction.guild.id);
        }, 500 * 30 * 30);
       } 
    }


    }
    ///////
     if (interaction.commandName === 'set-channel') {
if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({embeds:[
  new Discord.MessageEmbed()
     .setColor('#454DCE')
.setDescription(`You Don't Have \`\`ADMINISTRATOR\`\` premission`)
   ], ephemeral:true})
var ch = interaction.options.getChannel("channel");
let ChannelID = ch.id;

var desc = interaction.options.getString("description") 

if(desc.length> 500){
interaction.reply({embeds:[
  new Discord.MessageEmbed()
     .setColor('#454DCE')
.setDescription(`Your Description is So Long`)
   ], ephemeral:true})
}
let co = "#454DCE"
let bnr = "https://cdn.discordapp.com/attachments/1043862126533550120/1091834226472669204/AE6FE6CD-FB7F-4BBA-A3EE-2606E874CA7C.jpg"
 
db.set(`share_${interaction.guild.id}`, {ChannelID, desc})
db.set(`color_${interaction.guild.id}`, co)
db.set(`banner_${interaction.guild.id}`, bnr)

interaction.reply({embeds:[
  new Discord.MessageEmbed()
     .setColor('#454DCE')
.setDescription(`Done Setup Your Servers`)
   ], ephemeral:true})
    }
/////
if (interaction.commandName === 'color') {
if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({embeds:[
  new Discord.MessageEmbed()
     .setColor('#454DCE')
.setDescription(`You Don't Have \`\`ADMINISTRATOR\`\` premission`)
   ], ephemeral:true})

var color = interaction.options.getString("color") 


if(isHexcolor(`${color}`) === false){
interaction.reply({embeds:[
  new Discord.MessageEmbed()
     .setColor('#454DCE')
.setDescription(`Invalid Hex Color Please Try Again`)
   ], ephemeral:true})
}else {
db.set(`color_${interaction.guild.id}`, color)
  

interaction.reply({embeds:[
  new Discord.MessageEmbed()
     .setColor('#454DCE')
.setDescription(`Done Setup Color`)
   ], ephemeral:true})
  
}

    }
 ////
 if (interaction.commandName === 'banner') {
if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({embeds:[
  new Discord.MessageEmbed()
     .setColor('#454DCE')
.setDescription(`You Don't Have \`\`ADMINISTRATOR\`\` premission`)
   ], ephemeral:true})

var banner = interaction.options.getString("link") 

isImageURL(`${banner}`).then(b =>{
if(b === false){
interaction.reply({embeds:[
  new Discord.MessageEmbed()
     .setColor('#454DCE')
.setDescription(`Invalid Image Please Try Again`)
   ], ephemeral:true})
}else {

db.set(`banner_${interaction.guild.id}`, banner)
  

interaction.reply({embeds:[
  new Discord.MessageEmbed()
     .setColor('#454DCE')
.setDescription(`Done Setup Banner`)
   ], ephemeral:true})
} 
})

}
////
if(interaction.commandName === "preview"){
if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({embeds:[
  new Discord.MessageEmbed()
     .setColor('#454DCE')
.setDescription(`You Don't Have \`\`ADMINISTRATOR\`\` premission`)
   ], ephemeral:true})
    
const invite = await interaction.channel.createInvite()

let your = db.get(`share_${interaction.guild.id}`)

let row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setLabel(`${interaction.guild.name}`)
					.setURL(`${invite}`)
					.setStyle('LINK'),
					);
let e = new Discord.MessageEmbed()
.setAuthor({name:interaction.guild.name,icon_url:interaction.guild.iconURL()})
.setThumbnail(interaction.guild.iconURL({inline: true}))
.setColor(db.get(`color_${interaction.guild.id}`))
.addField('📃 Description:' , `${your.desc} `)
.addField('📆 Created At:' ,  `<t:${~~(interaction.guild.createdTimestamp / 1000)}:d> <t:${~~(interaction.guild.createdTimestamp / 1000)}:R>`)
.addField('💬 Channels:' , `${interaction.guild.channels.cache.size}`)
.addField('👥 Members:' , `${interaction.guild.memberCount}`)
.addField("🔵 Color:", db.get(`color_${interaction.guild.id}`))
.addField("🔗 Share Room:", your.ChannelID)
.setImage(db.get(`banner_${interaction.guild.id}`))
interaction.reply({embeds:[e], components:[row]})

}
////

let sc = new Discord.MessageActionRow()
			.addComponents(
        
                new Discord.MessageButton()
                .setCustomId("1255")
                .setLabel(`${client.ws.ping}`)
                .setStyle("PRIMARY"),
					);
  if (interaction.commandName === "ping") {     
    let embed = new Discord.MessageEmbed()
      .setColor("#454DCE")
      .setDescription(`**My Ping Is** ↙`)
    await interaction.reply({embeds:[embed], components:[sc]})
    

  }

  if (interaction.commandName === "help") {  
  

    let e = new Discord.MessageEmbed()
.setColor('#454DCE') 
  .setAuthor({name:interaction.guild.name ,icon_url:interaction.guild.iconURL()})   
.setDescription(`**Share Commands**

 \`/share \`  **To Share Your Server**
 \`/set-share \`  **To set the Publishing Room and Description**
 \`/banner \`  **To Set The Banner** 
 \`/color \`  **To set Determining The Color Of The Embed**
 \`/preview \`  **Preview Your Advertising**

 **General Commands**

 \`/botinfo \`  **To See Information About The Bot**
 \`/ping \` **To See The Ping Of The Bot**`) 
await interaction.reply({embeds:[e]})

  }
if(interaction.commandName === "botinfo"){
let duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

let embed = new Discord.MessageEmbed()
.setAuthor({name:"Bot Info" ,iconURL:client.user.avatarURL()})
.setThumbnail(client.user.avatarURL())
.addField("✏️ Name:", client.user.tag.toString(), true)
.addField("💳 ID:", client.user.id.toString(), true)
.addField("🗄️ Servers:", client.guilds.cache.size.toString() , true)
.addField("👥 Users:", `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}` , true)
.addField("💬 Rooms:", client.channels.cache.size.toString(), true)
.addField("⚙️ Uptime:", duration , true)

.setColor("#454DCE")
.setTimestamp(new Date())
await interaction.reply({embeds:[embed]})
}
  if (interaction.commandName === "invite") {  
  
  let r = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setLabel("Link")
					.setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=2199023536224&scope=bot%20applications.commands`)
					.setStyle('LINK'),
					);   
    let e = new Discord.MessageEmbed()
.setColor('RANDOM') 
  .setAuthor({name:interaction.guild.name ,icon_url:interaction.guild.iconURL()})   
.setDescription(`**Thank you for adding me, press the button and complete the process**`)
await interaction.reply({embeds:[e], components:[r]})
    

            }
})
    
client.login(process.env.token);