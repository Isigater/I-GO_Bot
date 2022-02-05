// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { setTimeout } = require('timers/promises');
import { Client, Intents, Channel, MessageAttachment, MessageEmbed, CategoryChannel, VoiceChannel } from 'discord.js';
const client = new Client({ intents: Object.keys(Intents.FLAGS) });
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
    if (check) checkColor = !nowTurnBool;
    else checkColor = nowTurnBool;

    console.log("debug2" + checkColor);

    if (checkColor) {
        console.log("debug3");
        //つながっている黒の石を取得
        if (check) {
            console.log(blackStoneArray);
            console.log(left + ", " + top);
            startPointArray.push(blackStoneArray.findIndex(Array.isMatch([left, top])));
        }
        else {
            console.log(blackStoneArray);
            if (top != 1) startPointArray.push(blackStoneArray.findIndex(Array.isMatch([left, top - 1])));
            if (top != boardSize) startPointArray.push(blackStoneArray.findIndex(Array.isMatch([left, top + 1])));
            if (left != 1) startPointArray.push(blackStoneArray.findIndex(Array.isMatch([left - 1, top])));
            if (left != boardSize) startPointArray.push(blackStoneArray.findIndex(Array.isMatch([left + 1, top])));
        }
        console.log(startPointArray);
        startPointArray = startPointArray.filter(pos => pos >= 0);
        console.log(startPointArray);

        for (let startPos = 0; startPos < startPointArray.length; startPos++) {
            alreadyChackArray.length = 0;
            yetCheckArray.length = 0;
            yetCheckArray.push(startPointArray[startPos]);
            while (yetCheckArray.length != 0) {
                for (let num = yetCheckArray.length - 1; num >= 0;) {
                    console.log(num);
                    let topPos = blackStoneArray[yetCheckArray[num]][1];
                    let leftPos = blackStoneArray[yetCheckArray[num]][0];
                    alreadyChackArray.push(yetCheckArray[num]);
                    yetCheckArray.splice(num, 1);
                    if (topPos != 1) {
                        let index = blackStoneArray.findIndex(Array.isMatch([leftPos, topPos - 1]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    if (topPos != boardSize) {
                        let index = blackStoneArray.findIndex(Array.isMatch([leftPos, topPos + 1]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    if (leftPos != 1) {
                        let index = blackStoneArray.findIndex(Array.isMatch([leftPos - 1, topPos]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    if (leftPos != boardSize) {
                        let index = blackStoneArray.findIndex(Array.isMatch([leftPos + 1, topPos]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    yetCheckArray = yetCheckArray.filter(pos => pos >= 0);
                    num = yetCheckArray.length - 1;
                }
            }
            console.log("debug4  " + alreadyChackArray);

            let deleteBool = true;
            let connetctArray = blackStoneArray.concat(whiteStoneArray);
            for (let num = 0; num < alreadyChackArray.length; num++) {
                let thisCheckTopPos = blackStoneArray[alreadyChackArray[num]][1];
                let thisCheckLeftPos = blackStoneArray[alreadyChackArray[num]][0];
                if (thisCheckLeftPos != 1 && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos - 1, thisCheckTopPos])) == -1) { deleteBool = false; break; }
                if (thisCheckLeftPos != boardSize && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos + 1, thisCheckTopPos])) == -1) { deleteBool = false; break; }
                if (thisCheckTopPos != 1 && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos, thisCheckTopPos - 1])) == -1) { deleteBool = false; break; }
                if (thisCheckTopPos != boardSize && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos, thisCheckTopPos + 1])) == -1) { deleteBool = false; break; }
            }
            if (deleteBool) {
                console.log(alreadyChackArray);
                deleteArray = deleteArray.concat(alreadyChackArray);
            }
        }
        return Array.from(new Set(deleteArray));
    }
    else {
        //つながっている白の石を取得
        if (check) {
            startPointArray.push(whiteStoneArray.findIndex(Array.isMatch([left, top])));
        }
        else {
            if (top != 1) startPointArray.push(whiteStoneArray.findIndex(Array.isMatch([left, top - 1])));
            if (top != boardSize) startPointArray.push(whiteStoneArray.findIndex(Array.isMatch([left, top + 1])));
            if (left != 1) startPointArray.push(whiteStoneArray.findIndex(Array.isMatch([left - 1, top])));
            if (left != boardSize) startPointArray.push(whiteStoneArray.findIndex(Array.isMatch([left + 1, top])));
        }
        startPointArray = startPointArray.filter(pos => pos >= 0);
        for (let startPos = 0; startPos < startPointArray.length; startPos++) {
            alreadyChackArray.length = 0;
            yetCheckArray.length = 0;
            yetCheckArray.push(startPointArray[startPos]);
            while (yetCheckArray.length != 0) {
                for (let num = yetCheckArray.length - 1; num >= 0;) {
                    let topPos = whiteStoneArray[yetCheckArray[num]][1];
                    let leftPos = whiteStoneArray[yetCheckArray[num]][0];
                    alreadyChackArray.push(yetCheckArray[num]);
                    yetCheckArray.splice(num, 1);
                    if (topPos != 1) {
                        let index = whiteStoneArray.findIndex(Array.isMatch([leftPos, topPos - 1]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    if (topPos != boardSize) {
                        let index = whiteStoneArray.findIndex(Array.isMatch([leftPos, topPos + 1]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    if (leftPos != 1) {
                        let index = whiteStoneArray.findIndex(Array.isMatch([leftPos - 1, topPos]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    if (leftPos != boardSize) {
                        let index = whiteStoneArray.findIndex(Array.isMatch([leftPos + 1, topPos]));
                        if (index != -1 && !alreadyChackArray.includes(index)) yetCheckArray.push(index);
                    }
                    yetCheckArray = yetCheckArray.filter(pos => pos >= 0);
                    num = yetCheckArray.length - 1;
                }
            }

            let deleteBool = true;
            let connetctArray = whiteStoneArray.concat(blackStoneArray);
            for (let num = 0; num < alreadyChackArray.length; num++) {
                let thisCheckTopPos = whiteStoneArray[alreadyChackArray[num]][1];
                let thisCheckLeftPos = whiteStoneArray[alreadyChackArray[num]][0];
                if (thisCheckLeftPos != 1 && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos - 1, thisCheckTopPos])) == -1) { deleteBool = false; break; }
                if (thisCheckLeftPos != boardSize && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos + 1, thisCheckTopPos])) == -1) { deleteBool = false; break; }
                if (thisCheckTopPos != 1 && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos, thisCheckTopPos - 1])) == -1) { deleteBool = false; break; }
                if (thisCheckTopPos != boardSize && connetctArray.findIndex(Array.isMatch([thisCheckLeftPos, thisCheckTopPos + 1])) == -1) { deleteBool = false; break; }
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
    if (boardSize == 9) image = sharp("I-Go_Bot/IGo_Board_9.png");
    else if (boardSize == 13) image = sharp("I-Go_Bot/IGo_Board_13.png");
    else if (boardSize == 19) image = sharp("I-Go_Bot/IGo_Board_19.png");
    let connetctArray = blackStoneImageArray.concat(whiteStoneImageArray);
    await image.composite(connetctArray);
    if (nowTurnBool) nextPlayer = playerBlack.user.toString();
    else nextPlayer = playerWhite.user.toString();
    turnNum++;
    thisChannel.bulkDelete(2);
    let file = new MessageAttachment(image);
    thisChannel.send({
        embeds: [{
            title: "対局中",
            description: turnNum + "手目",
            image: {
                url: "attachment://image"
            },
            fields: [
                {
                    name: "アゲハマ",
                    value: "黒: " + blackAgehama + ",  白: " + whiteAgehama
                }, {
                    name: "次の手番は",
                    value: nextPlayer
                }
            ]
        }],
        files: [file]
    });
}
// ～画像合成関数

const FirstPut_19 = [/*1*/[[4, 16]], /*2*/[[4, 16], [16, 4]], /*3*/[[4, 16], [16, 4], [16, 16]], /*4*/[[4, 16], [16, 4], [16, 16], [4, 4]],
    /*5*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 10]], /*6*/[[4, 16], [16, 4], [16, 16], [4, 4], [16, 10], [4, 10]], /*7*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 16], [10, 4], [10, 10]],
    /*8*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 16], [10, 4], [4, 10], [16, 10]], /*9*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 16], [10, 4], [4, 10], [16, 10], [10, 10]]];
const FirstPut_13 = [/*1*/[[4, 10]], /*2*/[[4, 10], [10, 4]], /*3*/[[4, 10], [10, 4], [10, 10]], /*4*/[[4, 10], [10, 4], [10, 10], [4, 4]]];

let boardSize; // 盤の大きさ(9,13,19)
let nowPlayingBool = false; //今プレイ中かどうか
let nowTurnBool = false; //今の手番　false => 黒、true => 白
let playerBlack = null, playerWhite = null; //対戦しているユーザー
let blackAgehama = 0; //黒のアゲハマの個数
let whiteAgehama = 0; //白のアゲハマの個数
let blackStoneImageArray = []; //黒石の位置の配列
let whiteStoneImageArray = []; //白石の位置の配列
let blackStoneArray = []; //黒石の画像合成用の配列
let whiteStoneArray = []; //白石の画像合成用の配列
let thisChannel;
let turnNum;

client.on('ready', () => {
    console.log(`LogInAs${client.user.tag}`);
})

client.on('messageCreate', async msg => { //メッセージの取得
    if (msg.channel.name != "bot") { console.log("ret"); return; }
    if (msg.author.bot) return; // bot の発言は無視
    let text = msg.content;

    if (!msg.mentions.users.has(client.user.id)) {
        await msg.delete();
        return;
    } //メンションされなければ終了

    //メンション部分を除く
    if (text[0] === '<') text = text.split(" ").join("").split(">")[1];
    else if (text[text.length - 1] === '>') text = text.split(" ").join("").split("<")[0];

    let board; //盤の画像
    thisChannel = msg.channel;
    await msg.delete();

    //手番の設定
    if (!nowPlayingBool) {
        if (text === "black" || text === "Black") {
            //if (playerWhite == msg.author) playerWhite = "";
            playerBlack = msg.member; //発言したユーザーを黒番に設定
            let blackName;
            let whiteName;
            if (playerBlack == null) blackName = "";
            else blackName = playerBlack.displayName;
            if (playerWhite == null) whiteName = "";
            else whiteName = playerWhite.displayName;
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
            playerWhite = msg.member; //発言したユーザーを白番に設定
            let blackName;
            let whiteName;
            if (playerBlack == null) blackName = "";
            else blackName = playerBlack.displayName;
            if (playerWhite == null) whiteName = "";
            else whiteName = playerWhite.displayName;
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
        if (blackStoneArray.some(function (value) {
            return value[0] === Number(boardPlace[0]) && value[1] === Number(boardPlace[1]);
        }) || whiteStoneArray.some(function (value) {
            return value[0] === Number(boardPlace[0]) && value[1] === Number(boardPlace[1]);
        })) {
            const reply = await thisChannel.send("選択された場所には既に石があります。別の場所を指定してください");
            await setTimeout(2500);
            await reply.delete();
            return;
        }

        let keepBlackStone = Array.from(blackStoneArray);
        let keepWhiteStone = Array.from(whiteStoneArray);

        if (nowTurnBool) whiteStoneArray.push([Number(boardPlace[0]), Number(boardPlace[1])]);
        else blackStoneArray.push([Number(boardPlace[0]), Number(boardPlace[1])]);

        console.log("debug1");

        let delArray = StoneTrash(Number(boardPlace[0]), Number(boardPlace[1]), false);
        delArray.sort(function (first, second) {
            return first - second;
        });
        console.log("debug  " + delArray);
        if (nowTurnBool) {
            for (num = delArray.length - 1; num >= 0; num--) {
                await blackStoneArray.splice(delArray[num], 1);
            }
        }
        else {
            for (num = delArray.length - 1; num >= 0; num--) {
                await whiteStoneArray.splice(delArray[num], 1);
            }
        }

        if (delArray.length == 0) {
            let checkArray = StoneTrash(Number(boardPlace[0]), Number(boardPlace[1]), true);
            if (checkArray.length != 0) {
                console.log("着手禁止点");
                console.log(keepBlackStone);
                console.log(blackStoneArray);
                blackStoneArray = keepBlackStone;
                whiteStoneArray = keepWhiteStone;
                console.log(blackStoneArray);
                const reply = await thisChannel.send("着手禁止点です");
                await setTimeout(2500);
                await reply.delete();
                return;
            }
        }

        if (nowTurnBool) {
            console.log("whiteAgehama" + delArray.length);
            whiteAgehama += delArray.length;
            for (num = delArray.length - 1; num >= 0; num--) {
                await blackStoneImageArray.splice(delArray[num], 1);
            }
        }
        else {
            console.log("whiteAgehama" + delArray.length);
            blackAgehama += delArray.length;
            for (num = delArray.length - 1; num >= 0; num--) {
                await whiteStoneImageArray.splice(delArray[num], 1);
            }
        }

        console.log("black: " + blackAgehama + "    white: " + whiteAgehama);

        if (nowTurnBool) {
            if (boardSize == 9) {
                whiteStoneImageArray.push({
                    input: "I-Go_Bot/WhiteStone_9.png",
                    blend: "over",
                    top: Number(boardPlace[1]) * 88 - 38,
                    left: Number(boardPlace[0]) * 88 - 38
                });
            }
            else if (boardSize == 13) {
                whiteStoneImageArray.push({
                    input: "I-Go_Bot/WhiteStone_13.png",
                    blend: "over",
                    top: Number(boardPlace[1]) * 61 - 27,
                    left: Number(boardPlace[0]) * 61 - 27
                });
            }
            else if (boardSize == 19) {
                whiteStoneImageArray.push({
                    input: "I-Go_Bot/WhiteStone.png",
                    blend: "over",
                    top: Number(boardPlace[1]) * 44 + 25,
                    left: Number(boardPlace[0]) * 44 + 25
                });
            }
        }
        else {
            if (boardSize == 9) {
                blackStoneImageArray.push({
                    input: "I-Go_Bot/BlackStone_9.png",
                    blend: "over",
                    top: Number(boardPlace[1]) * 88 - 38,
                    left: Number(boardPlace[0]) * 88 - 38
                });
            }
            else if (boardSize == 13) {
                blackStoneImageArray.push({
                    input: "I-Go_Bot/BlackStone_13.png",
                    blend: "over",
                    top: Number(boardPlace[1]) * 61 - 27,
                    left: Number(boardPlace[0]) * 61 - 27
                });
            }
            else if (boardSize == 19) {
                blackStoneImageArray.push({
                    input: "I-Go_Bot/BlackStone.png",
                    blend: "over",
                    top: Number(boardPlace[1]) * 44 + 25,
                    left: Number(boardPlace[0]) * 44 + 25
                });
            }
        }

        if (boardSize === 9) board = sharp("I-Go_Bot/IGo_Board_9.png");
        else if (boardSize === 13) board = sharp("I-Go_Bot/IGo_Board_13.png");
        else if (boardSize === 19) board = sharp("I-Go_Bot/IGo_Board_19.png");
        await JoinStone();

        nowTurnBool = !nowTurnBool;
    }



    //対局開始
    let startText = text.split(',');
    if ((startText[0] === "start" || startText[0] === "Start")) {
        if (startText.length <= 1) {
            const reply = await thisChannel.send("対局を始めるには```@I-Go_Bot start,盤の大きさ(,置き石の数)```と入力してください");
            await setTimeout(2500);
            await reply.delete();
            return;
        }
        if (startText.length == 2) startText.push("0");

        if (!stringNumberBool(startText[1]) || !stringNumberBool(startText[2])) {
            const reply = await thisChannel.send("対局を始めるには```@I-Go_Bot start,盤の大きさ(,置き石の数)```と入力してください");
            await setTimeout(2500);
            await reply.delete();
            return;
        }

        if (playerBlack !== null && playerWhite !== null) {
            boardSize = Number(startText[1]);
            console.log("start");
            if (startText[2] > 1) nowTurnBool = true;
            else nowTurnBool = false;

            if (startText[2] == 1) startText[2] = 0;

            var debugCount = 0;
            if (boardSize == 9) {
                board = sharp("I-Go_Bot/IGo_Board_9.png");
            }
            else if (boardSize == 13) {
                board = sharp("I-Go_Bot/IGo_Board_13.png");
                if (startText[2] > 4 || startText[2] < 0) {
                    const reply = await thisChannel.send("置き石の数が正しくありません");
                    await setTimeout(2500);
                    await reply.delete();
                    return;
                }
                else if (startText[2] != 0) {
                    for (var num = 0; num < startText[2]; num++) {
                        blackStoneArray.push(FirstPut_13[startText[2] - 1][num]);
                        blackStoneImageArray.push({
                            input: "I-Go_Bot/BlackStone_13.png",
                            blend: "over",
                            left: FirstPut_13[startText[2] - 1][num][0] * 61 - 27,
                            top: FirstPut_13[startText[2] - 1][num][1] * 61 - 27
                        });
                    }
                    await board.composite(blackStoneImageArray);
                }
            }
            else if (boardSize == 19) {
                board = sharp("I-Go_Bot/IGo_Board_19.png");
                if (startText[2] > 9 || startText[2] < 0) {
                    const reply = await thisChannel.send("置き石の数が正しくありません");
                    await setTimeout(2500);
                    await reply.delete();
                    return;
                }
                else if (startText[2] != 0) {
                    for (var num = 0; num < startText[2]; num++) {
                        blackStoneArray.push(FirstPut_19[startText[2] - 1][num]);
                        blackStoneImageArray.push({
                            input: "I-Go_Bot/BlackStone.png",
                            blend: "over",
                            left: FirstPut_19[startText[2] - 1][num][0] * 44 + 25,
                            top: FirstPut_19[startText[2] - 1][num][1] * 44 + 25
                        });
                    }
                    await board.composite(blackStoneImageArray);
                }
            }
            else {
                const reply = await thisChannel.send("番の大きさには 9, 13, 19 が指定できます");
                await setTimeout(2500);
                await reply.delete();
                return;
            }
            await thisChannel.bulkDelete(5);
            //thisChannel.send({ files: [board] });
            let file = new MessageAttachment(board);
            await thisChannel.send({
                embeds: [{
                    title: "対局中",
                    description: "0手目",
                    image: {
                        url: "attachment://board"
                    },
                    fields: [
                        {
                            name: "アゲハマ",
                            value: "黒: " + blackAgehama + ",  白: " + whiteAgehama
                        }
                    ]
                }],
                files: [file]
            });

            nowPlayingBool = true;
            turnNum = 0;
        }
        else {
            const reply = await thisChannel.send("プレイヤーが揃っていません");
            await setTimeout(2500);
            await reply.delete();
        }
    }
    //対局開始

    //対局終了
    if (text === "finish" || text === "Finish") {
        let beforeMessage = await thisChannel.messages.fetch({ before: msg.id, limit: 1 })
            .then(messages => messages.first())
            .catch(console.error);
        beforeMessage.edit({
            embeds: [{
                title: "対局終了",
                description: "0手目",
                image: {
                    url: "attachment://board"
                },
                fields: [
                    {
                        name: "アゲハマ",
                        value: "黒: " + blackAgehama + ",  白: " + whiteAgehama
                    }
                ]
            }]
        });
        nowPlayingBool = false;
        nowTurnBool = false;
        playerBlack = null;
        playerWhite = null;
        blackAgehama = 0;
        whiteAgehama = 0;
        blackStoneImageArray.length = 0;
        whiteStoneImageArray.length = 0;
        blackStoneArray.length = 0;
        whiteStoneArray.length = 0;
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

client.login('ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.c1FUc9tNF1BRlsG6cL0gAUYa_h0');
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.fVYjQc9msXYuQiroX8GMCQFUrhM
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.Cv_xMP8kmM3_0B8HnQYi1QFh-eA
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.7dORqTnhCcDx_EiwOECr7mlLQVU
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.n_I9Pymd6kR7V-y0PwOxyK-Pvk0
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.c1FUc9tNF1BRlsG6cL0gAUYa_h0
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.c1FUc9tNF1BRlsG6cL0gAUYa_h0
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