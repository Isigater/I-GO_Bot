// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3030;
const { setTimeout } = require('timers/promises');
import { Client, GatewayIntentBits, Partials, AttachmentBuilder } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages], partials: [Partials.Channel] });
const sharp = require('sharp');

const stringNumberBool = n => typeof n === "string" && n !== "" && !isNaN(n); // int 化できるか

Array.isMatch = function (x) {
    return function (y) {
        if (!Array.isArray(y) || y.length != x.length) return false;
        for (let i = 0; i < x.length; i++) {
            if (x[i] != y[i]) return false;
        }
        return true;
    }
}

// 石を取る関数～
function StoneTrash(left, top, check) {
    let startPointArray = new Array;
    let deleteArray = new Array;
    let yetCheckArray = new Array;
    let alreadyChackArray = new Array;
    let checkColor;
    if (check) checkColor = !nowTurnBool[thisServer];
    else checkColor = nowTurnBool[thisServer];

    if (checkColor) {
        //つながっている黒の石を取得
        if (check) {
            startPointArray.push(blackStoneArray[thisServer].findIndex(Array.isMatch([left, top])));
        }
        else {
            if (top != 1) startPointArray.push(blackStoneArray[thisServer].findIndex(Array.isMatch([left, top - 1])));
            if (top != boardSize[thisServer]) startPointArray.push(blackStoneArray[thisServer].findIndex(Array.isMatch([left, top + 1])));
            if (left != 1) startPointArray.push(blackStoneArray[thisServer].findIndex(Array.isMatch([left - 1, top])));
            if (left != boardSize[thisServer]) startPointArray.push(blackStoneArray[thisServer].findIndex(Array.isMatch([left + 1, top])));
        }
        startPointArray = startPointArray.filter(pos => pos >= 0);

        for (let startPos = 0; startPos < startPointArray.length; startPos++) {
            alreadyChackArray.length = 0;
            yetCheckArray.length = 0;
            yetCheckArray.push(startPointArray[startPos]);

            while (yetCheckArray.length != 0) {

                for (let num = yetCheckArray.length - 1; num >= 0;) {
                    let topPos = blackStoneArray[thisServer][yetCheckArray[num]][1];
                    let leftPos = blackStoneArray[thisServer][yetCheckArray[num]][0];
                    alreadyChackArray.push(yetCheckArray[num]);
                    yetCheckArray.splice(num, 1);
                    if (topPos != 1) {
                        let index = blackStoneArray[thisServer].findIndex(Array.isMatch([leftPos, topPos - 1]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    if (topPos != boardSize[thisServer]) {
                        let index = blackStoneArray[thisServer].findIndex(Array.isMatch([leftPos, topPos + 1]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    if (leftPos != 1) {
                        let index = blackStoneArray[thisServer].findIndex(Array.isMatch([leftPos - 1, topPos]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    if (leftPos != boardSize[thisServer]) {
                        let index = blackStoneArray[thisServer].findIndex(Array.isMatch([leftPos + 1, topPos]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    yetCheckArray = yetCheckArray.filter(pos => pos >= 0);
                    num = yetCheckArray.length - 1;
                }
            }

            let deleteBool = true;
            let connetctArray = blackStoneArray[thisServer].concat(whiteStoneArray[thisServer]);

            for (let num = 0; num < alreadyChackArray.length; num++) {
                let thisCheckTopPos = blackStoneArray[thisServer][alreadyChackArray[num]][1];
                let thisCheckLeftPos = blackStoneArray[thisServer][alreadyChackArray[num]][0];
                if (thisCheckLeftPos != 1 && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos - 1, thisCheckTopPos])) == -1) { deleteBool = false; break; }
                if (thisCheckLeftPos != boardSize[thisServer] && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos + 1, thisCheckTopPos])) == -1) { deleteBool = false; break; }
                if (thisCheckTopPos != 1 && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos, thisCheckTopPos - 1])) == -1) { deleteBool = false; break; }
                if (thisCheckTopPos != boardSize[thisServer] && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos, thisCheckTopPos + 1])) == -1) { deleteBool = false; break; }
            }
            if (deleteBool) {
                deleteArray = deleteArray.concat(alreadyChackArray);
            }
        }
        return Array.from(new Set(deleteArray));
    }
    else {
        //つながっている白の石を取得
        if (check) {
            startPointArray.push(whiteStoneArray[thisServer].findIndex(Array.isMatch([left, top])));
        }
        else {
            if (top != 1) startPointArray.push(whiteStoneArray[thisServer].findIndex(Array.isMatch([left, top - 1])));
            if (top != boardSize[thisServer]) startPointArray.push(whiteStoneArray[thisServer].findIndex(Array.isMatch([left, top + 1])));
            if (left != 1) startPointArray.push(whiteStoneArray[thisServer].findIndex(Array.isMatch([left - 1, top])));
            if (left != boardSize[thisServer]) startPointArray.push(whiteStoneArray[thisServer].findIndex(Array.isMatch([left + 1, top])));
        }
        startPointArray = startPointArray.filter(pos => pos >= 0);
        for (let startPos = 0; startPos < startPointArray.length; startPos++) {
            alreadyChackArray.length = 0;
            yetCheckArray.length = 0;
            yetCheckArray.push(startPointArray[startPos]);
            while (yetCheckArray.length != 0) {
                for (let num = yetCheckArray.length - 1; num >= 0;) {
                    let topPos = whiteStoneArray[thisServer][yetCheckArray[num]][1];
                    let leftPos = whiteStoneArray[thisServer][yetCheckArray[num]][0];
                    alreadyChackArray.push(yetCheckArray[num]);
                    yetCheckArray.splice(num, 1);
                    if (topPos != 1) {
                        let index = whiteStoneArray[thisServer].findIndex(Array.isMatch([leftPos, topPos - 1]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    if (topPos != boardSize[thisServer]) {
                        let index = whiteStoneArray[thisServer].findIndex(Array.isMatch([leftPos, topPos + 1]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    if (leftPos != 1) {
                        let index = whiteStoneArray[thisServer].findIndex(Array.isMatch([leftPos - 1, topPos]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    if (leftPos != boardSize[thisServer]) {
                        let index = whiteStoneArray[thisServer].findIndex(Array.isMatch([leftPos + 1, topPos]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    yetCheckArray = yetCheckArray.filter(pos => pos >= 0);
                    num = yetCheckArray.length - 1;
                }
            }

            let deleteBool = true;
            let connetctArray = whiteStoneArray[thisServer].concat(blackStoneArray[thisServer]);
            for (let num = 0; num < alreadyChackArray.length; num++) {
                let thisCheckTopPos = whiteStoneArray[thisServer][alreadyChackArray[num]][1];
                let thisCheckLeftPos = whiteStoneArray[thisServer][alreadyChackArray[num]][0];
                if (thisCheckLeftPos != 1 && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos - 1, thisCheckTopPos])) == -1) { deleteBool = false; break; }
                if (thisCheckLeftPos != boardSize[thisServer] && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos + 1, thisCheckTopPos])) == -1) { deleteBool = false; break; }
                if (thisCheckTopPos != 1 && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos, thisCheckTopPos - 1])) == -1) { deleteBool = false; break; }
                if (thisCheckTopPos != boardSize[thisServer] && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos, thisCheckTopPos + 1])) == -1) { deleteBool = false; break; }
            }
            if (deleteBool) {
                deleteArray = deleteArray.concat(alreadyChackArray);
            }
        }
        return Array.from(new Set(deleteArray));
    }
}
// ～石を取る関数

// 画像合成関数～
async function JoinStone() {
    let image;
    let nextPlayer;
    if (boardSize[thisServer] == 9) image = sharp("IGo_Board_9.png");
    else if (boardSize[thisServer] == 13) image = sharp("IGo_Board_13.png");
    else if (boardSize[thisServer] == 19) image = sharp("IGo_Board_19.png");
    let connetctArray = blackStoneImageArray[thisServer].concat(whiteStoneImageArray[thisServer]);
    await image.composite(connetctArray).catch(error => console.error(error.message));
    if (nowTurnBool[thisServer]) nextPlayer = playerBlack[thisServer].user.toString();
    else nextPlayer = playerWhite[thisServer].user.toString();
    turnNum[thisServer]++;
    thisChannel.bulkDelete(2);
    let file = new AttachmentBuilder(image);
    thisChannel.send({
        embeds: [{
            title: "対局中",
            description: turnNum[thisServer] + "手目",
            image: {
                url: "attachment://image.extension"
            },
            fields: [
                {
                    name: "アゲハマ",
                    value: "黒: " + blackAgehama[thisServer] + ",  白: " + whiteAgehama[thisServer]
                }, {
                    name: "次の手番は",
                    value: nextPlayer
                }
            ]
        }],
        files: [file]
    }).catch((error) => thisChannel.send("もう一度やり直してください"));

}
// ～画像合成関数

const FirstPut_19 = [/*1*/[[4, 16]], /*2*/[[4, 16], [16, 4]], /*3*/[[4, 16], [16, 4], [16, 16]], /*4*/[[4, 16], [16, 4], [16, 16], [4, 4]],
    /*5*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 10]], /*6*/[[4, 16], [16, 4], [16, 16], [4, 4], [16, 10], [4, 10]], /*7*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 16], [10, 4], [10, 10]],
    /*8*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 16], [10, 4], [4, 10], [16, 10]], /*9*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 16], [10, 4], [4, 10], [16, 10], [10, 10]]];
const FirstPut_13 = [/*1*/[[4, 10]], /*2*/[[4, 10], [10, 4]], /*3*/[[4, 10], [10, 4], [10, 10]], /*4*/[[4, 10], [10, 4], [10, 10], [4, 4]]];

let server = [];
let thisServer;
let boardSize = []; // 盤の大きさ(9,13,19)
let nowPlayingBool = []; //今プレイ中かどうか
let nowTurnBool = []; //今の手番　false => 黒、true => 白
let playerBlack = [], playerWhite = []; //対戦しているユーザー
let blackAgehama = []; //黒のアゲハマの個数
let whiteAgehama = []; //白のアゲハマの個数
let blackStoneImageArray = []; //黒石の位置の配列
let whiteStoneImageArray = []; //白石の位置の配列
let blackStoneArray = []; //黒石の画像合成用の配列
let whiteStoneArray = []; //白石の画像合成用の配列
let thisChannel;
let turnNum = [];

client.on('ready', () => {
    console.log("hello,discord!");
    console.log(`LogInAs${client.user.tag}`);
})

client.on('messageCreate', async msg => { //メッセージの取得
    if (msg.channel.name != "bot") { console.log("ret"); return; }
    if (server.indexOf(msg.guild.id) == -1) {
        server.push(msg.guild.id);
        boardSize.push(0);
        nowPlayingBool.push(false);
        nowTurnBool.push(false);
        blackAgehama.push(0);
        whiteAgehama.push(0);
        blackStoneImageArray.push([]);
        blackStoneArray.push([]);
        whiteStoneImageArray.push([]);
        whiteStoneArray.push([]);
        turnNum.push(0);
    }
    thisServer = server.indexOf(msg.guild.id);
    if (msg.author.bot) return; // bot の発言は無視
    let text = msg.content;

    if (!msg.mentions.users.has(client.user.id)) {
        await msg.delete().catch(error => console.error(error.message));
        return;
    } //メンションされなければ終了

    //メンション部分を除く
    if (text[0] === '<') text = text.split(" ").join("").split(">")[1];
    else if (text[text.length - 1] === '>') text = text.split(" ").join("").split("<")[0];

    let board; //盤の画像
    thisChannel = msg.channel;
    await msg.delete().catch(error => console.error(error.message));

    //手番の設定
    if (!nowPlayingBool[thisServer]) {
        if (text === "black" || text === "Black") {
            //if (playerWhite == msg.author) playerWhite = "";
            playerBlack[thisServer] = msg.member; //発言したユーザーを黒番に設定
            let blackName;
            let whiteName;
            if (playerBlack[thisServer] == null) blackName = "";
            else blackName = playerBlack[thisServer].displayName;
            if (playerWhite[thisServer] == null) whiteName = "";
            else whiteName = playerWhite[thisServer].displayName;
            thisChannel.bulkDelete(1);
            thisChannel.send({
                embeds: [{
                    fields: [
                        {
                            name: "待機中",
                            value: "黒: " + blackName + ",   白: " + whiteName
                        }
                    ]
                }],
            });
        }
        else if (text === "white" || text === "White") {
            //if (playerBlack == msg.author) playerBlack = "";
            playerWhite[thisServer] = msg.member; //発言したユーザーを白番に設定
            let blackName;
            let whiteName;
            if (playerBlack[thisServer] == null) blackName = "";
            else blackName = playerBlack[thisServer].displayName;
            if (playerWhite[thisServer] == null) whiteName = "";
            else whiteName = playerWhite[thisServer].displayName;
            thisChannel.bulkDelete(1);
            thisChannel.send({
                embeds: [{
                    fields: [
                        {
                            name: "待機中",
                            value: "黒: " + blackName + ",   白: " + whiteName
                        }
                    ]
                }],
            });
        }

    }
    //手番の設定


    let boardPlace = text.split('-');
    if (boardPlace[0] != null && boardPlace[1] != null && stringNumberBool(boardPlace[0]) && stringNumberBool(boardPlace[1]) && nowPlayingBool) {

        //選択された場所に既に石が置かれていたら警告だけする
        if (blackStoneArray[thisServer].some(function (value) {
            return value[0] === Number(boardPlace[0]) && value[1] === Number(boardPlace[1]);
        }) || whiteStoneArray[thisServer].some(function (value) {
            return value[0] === Number(boardPlace[0]) && value[1] === Number(boardPlace[1]);
        })) {
            const reply = await thisChannel.send("選択された場所には既に石があります。別の場所を指定してください");
            await setTimeout(2500);
            await reply.delete().catch(error => console.error(error.message));
            return;
        }

        let keepBlackStone = Array.from(blackStoneArray[thisServer]);
        let keepWhiteStone = Array.from(whiteStoneArray[thisServer]);

        if (nowTurnBool[thisServer]) whiteStoneArray[thisServer].push([Number(boardPlace[0]), Number(boardPlace[1])]);
        else blackStoneArray[thisServer].push([Number(boardPlace[0]), Number(boardPlace[1])]);

        try {
            let delArray = StoneTrash(Number(boardPlace[0]), Number(boardPlace[1]), false);
        } catch (e) {
            const reply = await thisChannel.send("エラーが発生しました");
            console.log(e);
        }
        delArray.sort(function (first, second) {
            return first - second;
        });
        if (nowTurnBool[thisServer]) {
            for (num = delArray.length - 1; num >= 0; num--) {
                await blackStoneArray[thisServer].splice(delArray[num], 1);
            }
        }
        else {
            for (num = delArray.length - 1; num >= 0; num--) {
                await whiteStoneArray[thisServer].splice(delArray[num], 1);
            }
        }

        if (delArray.length == 0) {
            try {
                let checkArray = StoneTrash(Number(boardPlace[0]), Number(boardPlace[1]), true);
            } catch (e) {
                const reply = await thisChannel.send("エラーが発生しました");
                console.log(e);
            }
            if (checkArray.length != 0) {
                blackStoneArray[thisServer] = keepBlackStone;
                whiteStoneArray[thisServer] = keepWhiteStone;
                const reply = await thisChannel.send("着手禁止点です");
                await setTimeout(2500);
                await reply.delete().catch(error => console.error(error.message));
                return;
            }
        }

        if (nowTurnBool) {
            whiteAgehama[thisServer] += delArray.length;
            for (num = delArray.length - 1; num >= 0; num--) {
                await blackStoneImageArray[thisServer].splice(delArray[num], 1);
            }
        }
        else {
            blackAgehama[thisServer] += delArray.length;
            for (num = delArray.length - 1; num >= 0; num--) {
                await whiteStoneImageArray[thisServer].splice(delArray[num], 1);
            }
        }


        if (nowTurnBool[thisServer]) {
            if (boardSize[thisServer] == 9) {
                whiteStoneImageArray[thisServer].push({
                    input: "WhiteStone_9.png",
                    blend: "over",
                    top: Number(boardPlace[1]) * 88 - 38,
                    left: Number(boardPlace[0]) * 88 - 38
                });
            }
            else if (boardSize[thisServer] == 13) {
                whiteStoneImageArray[thisServer].push({
                    input: "WhiteStone_13.png",
                    blend: "over",
                    top: Number(boardPlace[1]) * 61 - 27,
                    left: Number(boardPlace[0]) * 61 - 27
                });
            }
            else if (boardSize[thisServer] == 19) {
                whiteStoneImageArray[thisServer].push({
                    input: "WhiteStone.png",
                    blend: "over",
                    top: Number(boardPlace[1]) * 44 + 25,
                    left: Number(boardPlace[0]) * 44 + 25
                });
            }
        }
        else {
            if (boardSize[thisServer] == 9) {
                blackStoneImageArray[thisServer].push({
                    input: "BlackStone_9.png",
                    blend: "over",
                    top: Number(boardPlace[1]) * 88 - 38,
                    left: Number(boardPlace[0]) * 88 - 38
                });
            }
            else if (boardSize[thisServer] == 13) {
                blackStoneImageArray[thisServer].push({
                    input: "BlackStone_13.png",
                    blend: "over",
                    top: Number(boardPlace[1]) * 61 - 27,
                    left: Number(boardPlace[0]) * 61 - 27
                });
            }
            else if (boardSize[thisServer] == 19) {
                blackStoneImageArray[thisServer].push({
                    input: "BlackStone.png",
                    blend: "over",
                    top: Number(boardPlace[1]) * 44 + 25,
                    left: Number(boardPlace[0]) * 44 + 25
                });
            }
        }

        await JoinStone();

        nowTurnBool[thisServer] = !nowTurnBool[thisServer];
    }



    //対局開始
    let startText = text.split(',');
    if ((startText[0] === "start" || startText[0] === "Start")) {
        if (startText.length <= 1) {
            const reply = await thisChannel.send("対局を始めるには```@I-Go_Bot start,盤の大きさ(,置き石の数)```と入力してください");
            await setTimeout(2500);
            await reply.delete().catch(error => console.error(error.message));
            return;
        }
        if (startText.length == 2) startText.push("0");

        if (!stringNumberBool(startText[1]) || !stringNumberBool(startText[2])) {
            const reply = await thisChannel.send("対局を始めるには```@I-Go_Bot start,盤の大きさ(,置き石の数)```と入力してください");
            await setTimeout(2500);
            await reply.delete().catch(error => console.error(error.message));
            return;
        }

        if (playerBlack[thisServer] !== null && playerWhite[thisServer] !== null) {
            boardSize[thisServer] = Number(startText[1]);
            if (startText[2] > 1) nowTurnBool[thisServer] = true;
            else nowTurnBool[thisServer] = false;

            if (startText[2] == 1) startText[2] = 0;

            var debugCount = 0;
            if (boardSize[thisServer] == 9) {
                board = sharp("IGo_Board_9.png");
            }
            else if (boardSize[thisServer] == 13) {
                board = sharp("IGo_Board_13.png");
                if (startText[2] > 4 || startText[2] < 0) {
                    const reply = await thisChannel.send("置き石の数が正しくありません");
                    await setTimeout(2500);
                    await reply.delete().catch(error => console.error(error.message));
                    return;
                }
                else if (startText[2] != 0) {
                    for (var num = 0; num < startText[2]; num++) {
                        blackStoneArray[thisServer].push(FirstPut_13[startText[2] - 1][num]);
                        blackStoneImageArray[thisServer].push({
                            input: "BlackStone_13.png",
                            blend: "over",
                            left: FirstPut_13[startText[2] - 1][num][0] * 61 - 27,
                            top: FirstPut_13[startText[2] - 1][num][1] * 61 - 27
                        });
                    }
                    await board.composite(blackStoneImageArray[thisServer]);
                }
            }
            else if (boardSize[thisServer] == 19) {
                board = sharp("IGo_Board_19.png");
                if (startText[2] > 9 || startText[2] < 0) {
                    const reply = await thisChannel.send("置き石の数が正しくありません");
                    await setTimeout(2500);
                    await reply.delete().catch(error => console.error(error.message));
                    return;
                }
                else if (startText[2] != 0) {
                    for (var num = 0; num < startText[2]; num++) {
                        blackStoneArray[thisServer].push(FirstPut_19[startText[2] - 1][num]);
                        blackStoneImageArray[thisServer].push({
                            input: "BlackStone.png",
                            blend: "over",
                            left: FirstPut_19[startText[2] - 1][num][0] * 44 + 25,
                            top: FirstPut_19[startText[2] - 1][num][1] * 44 + 25
                        });
                    }
                    await board.composite(blackStoneImageArray[thisServer]);
                }
            }
            else {
                const reply = await thisChannel.send("番の大きさには 9, 13, 19 が指定できます");
                await setTimeout(2500);
                await reply.delete().catch(error => console.error(error.message));
                return;
            }
            await thisChannel.bulkDelete(5);
            let nextPlayer;
            if (nowTurnBool[thisServer]) nextPlayer = playerBlack[thisServer].user.toString();
            else nextPlayer = playerWhite[thisServer].user.toString();
            //thisChannel.send({ files: [board] });
            let file = new AttachmentBuilder(board);
            await thisChannel.send({
                embeds: [{
                    title: "対局中",
                    description: "0手目",
                    image: {
                        url: "attachment://board.extension"
                    },
                    fields: [
                        {
                            name: "アゲハマ",
                            value: "黒: " + blackAgehama[thisServer] + ",  白: " + whiteAgehama[thisServer]
                        }, {
                            name: "次の手番は",
                            value: nextPlayer
                        }
                    ]
                }],
                files: [file]
            }).catch((error) => thisChannel.send("もう一度やり直してください"));

            nowPlayingBool[thisServer] = true;
            turnNum[thisServer] = 0;
        }
        else {
            const reply = await thisChannel.send("プレイヤーが揃っていません");
            await setTimeout(2500);
            await reply.delete().catch(error => console.error(error.message));
        }
    }
    //対局開始

    //対局終了
    if (text === "finish" || text === "Finish") {
        let beforeMessage = await thisChannel.messages.fetch({ before: msg.id, limit: 1 })
            .then(messages => messages.first())
            .catch(error => console.error(error.message));
        beforeMessage.edit({
            embeds: [{
                title: "対局終了",
                description: "0手目",
                image: {
                    url: "attachment://board.extension"
                },
                fields: [
                    {
                        name: "アゲハマ",
                        value: "黒: " + blackAgehama[thisServer] + ",  白: " + whiteAgehama[thisServer]
                    }
                ]
            }]
        });
        nowPlayingBool[thisServer] = false;
        nowTurnBool[thisServer] = false;
        playerBlack[thisServer] = null;
        playerWhite[thisServer] = null;
        blackAgehama[thisServer] = 0;
        whiteAgehama[thisServer] = 0;
        blackStoneImageArray[thisServer].length = 0;
        whiteStoneImageArray[thisServer].length = 0;
        blackStoneArray[thisServer].length = 0;
        whiteStoneArray[thisServer].length = 0;
        board = null;
        thisChannel.send({
            embeds: [{
                fields: [
                    {
                        name: "待機中",
                        value: "誰もいない"
                    }
                ]
            }],
        });
    }
    //対局終了

    // ダイスロール
    let dicePlace = text.split('D');   // ＠メンション a D b => aDb のダイスロール
    if (dicePlace[0] != null && dicePlace[1] != null && stringNumberBool(dicePlace[0]) && stringNumberBool(dicePlace[1])) {

        var returnNum = 0;
        for (var num = 0; num < Number(dicePlace[0]); num++) {
            returnNum += Math.floor(Math.random() * Number(dicePlace[1])) + 1;
        }
        thisChannel.send("" + returnNum);

    }
    // ダイスロール

    ////チャンネル作成
    //let makeText = text.split(',');
    //if (makeText[0] == "makeChannel") {
    //    msg.channel.parent.clone().then(cat => {
    //        msg.guild.channels.create('対局', {
    //            type: 'text',
    //            parent: cat.id
    //        })
    //    })
    //}
    ////チャンネル作成

    //最初の処理
    if (text == "firstRun") {
        await thisChannel.send({
            embeds: [{
                fields: [
                    {
                        name: "待機中",
                        value: "黒: ,   白: "
                    }
                ]
            }],
        });
    }
    //最初の処理
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
client.login(process.env.token);
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.fVYjQc9msXYuQiroX8GMCQFUrhM
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.Cv_xMP8kmM3_0B8HnQYi1QFh-eA
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.7dORqTnhCcDx_EiwOECr7mlLQVU
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.n_I9Pymd6kR7V-y0PwOxyK-Pvk0
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.c1FUc9tNF1BRlsG6cL0gAUYa_h0
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.c1FUc9tNF1BRlsG6cL0gAUYa_h0
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.SMpLnoRknXU4ezJlnNZi4MCrn5s
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.SMpLnoRknXU4ezJlnNZi4MCrn5s
////できること
//
// ＠メンション Brack     ==> 発言者を黒番に設定 (対局中以外)
// ＠メンション White     ==> 発言者を白番に設定 (対局中以外)
// ＠メンション Start,num1,num2 ==> 対局開始 (num1路盤,num2子の置き石)
//
//  対局中
//     ＠メンション num1-num2 ==> 左からnum1,上からnum2の位置に石を置く
//
// ＠メンション Finish    ==> 対局終了 (強制)
// ＠メンション aDb  　   ==> aDb のダイスロール
