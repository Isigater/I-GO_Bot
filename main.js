// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { Client, Intents, Channel } from 'discord.js';
const client = new Client({ intents: Object.keys(Intents.FLAGS) });
const sharp = require('sharp');

const stringNumberBool = n => typeof n === "string" && n !== "" && !isNaN(n); // int 化できるか

function JoinStone(white, top, left) {
    if(white) {
        await board.composite([{
            input: "I-Go_Bot/BlackStone.png",
            blend: "over",
            top: top * 20,
            left: left * 20,
        }]);
    }
    else {
        await board.composite([{
            input: "I-Go_Bot/WhiteStone.png",
            blend: "over",
            top: top * 20,
            left: left * 20,
        }]);
    }
}

const FirstPut_19 = [/*1*/[[4, 16]], /*2*/[[4, 16], [16, 4]], /*3*/[[4, 16], [16, 4], [16, 16]], /*4*/[[4, 16], [16, 4], [16, 16], [4, 4]],
    /*5*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 10]], /*6*/[[4, 16], [16, 4], [16, 16], [4, 4], [16, 10], [4, 10]], /*7*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 16], [10, 4], [10, 10]],
    /*8*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 16], [10, 4], [4, 10], [16, 10]], /*9*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 16], [10, 4], [4, 10], [16, 10], [10, 10]]];
const FirstPut_13 = [/*1*/[[4, 10]], /*2*/[[4, 10], [10, 4]], /*3*/[[4, 10], [10, 4], [10, 10]], /*4*/[[4, 10], [10, 4], [10, 10], [4, 4]]];
const board_9 = sharp("I-Go_Bot/IGo_Board_9.png");
const board_13 = sharp("I-Go_Bot/IGo_Board_13.png");
const board_19 = sharp("I-Go_Bot/IGo_Board_19.png");
const blackStone = sharp("I-Go_Bot/BlackStone.png");
const whiteastone = sharp("I-Go_Bot/WhiteStone.png");

let board; //盤の画像
let boardSize; // 盤の大きさ(9,13,19)
let nowPlayingBool = false; //今プレイ中かどうか
let nowTurnBool = false; //今の手番　false => 黒、true => 白
let playerBlack = "", playerWhite = ""; //対戦しているユーザー
let nowBrackStone = new Array; //黒い碁石の位置 (配列)
let nowWhiteStone = new Array; //白い碁石の位置 (配列)
let nowBrackAgehama; //黒のアゲハマの個数
let nowWhiteAgehama; //白のアゲハマの個数

client.on('ready', () => {
    console.log(`LogInAs${client.user.tag}`)
})

client.on('messageCreate', async msg => { //メッセージの取得
    if (msg.author.bot) return; // bot の発言は無視
    let text = msg.content;

    if (!msg.mentions.users.has(client.user.id)) return; //メンションされなければ終了
    //メンション部分を除く
    if (text[0] === '<') text = text.split(" ").join("").split(">")[1];
    else if (text[text.length - 1] === '>') text = text.split(" ").join("").split("<")[0];

    let thisChannel = msg.channel;
    console.log(text);

    let boardPlace = text.split('-');
    if (boardPlace[0] != null && boardPlace[1] != null && stringNumberBool(boardPlace[0]) && stringNumberBool(boardPlace[1]) && nowPlayingBool) {
        thisChannel.send(boardPlace[0]);
        thisChannel.send(boardPlace[1]);

        //選択された場所に既に石が置かれていたら警告だけする
        if (nowBrackStone.some(function (value) {
            return value[0] === Number(boardPlace[0]) && value[1] === Number(boardPlace[1]);
        }) || nowWhiteStone.some(function (value) {
            return value[0] === Number(boardPlace[0]) && value[1] === Number(boardPlace[1]);
        })) {
            thisChannel.send("選択された場所には既に石があります。別の場所を指定してください");
            return;
        }

        if (nowTurnBool) nowWhiteStone.push([Number(boardPlace[0]), Number(boardPlace[1])]);
        else nowBrackStone.push([Number(boardPlace[0]), Number(boardPlace[1])]);

        nowTurnBool = !nowTurnBool;
        console.log(nowBrackStone + "" + nowWhiteStone);
    }

    //手番の設定
    if (!nowPlayingBool) {
        if (text === "black" || text === "Black") {
            if (playerWhite == msg.author) playerWhite = "";
            playerBlack = msg.author; //発言したユーザーを黒番に設定
        }
        if (text === "white" || text === "White") {
            if (playerBlack == msg.author) playerBlack = "";
            playerWhite = msg.author; //発言したユーザーを白番に設定
        }
    }
    //手番の設定

    //対局開始
    let startText = text.split(',');
    if ((startText[0] === "start" || startText[0] === "Start") && stringNumberBool(startText[1]) && stringNumberBool(startText[2])) {
        //if (playerBlack !== "" && playerWhite !== "") {
        boardSize = startText[1];
        console.log("start");
        nowPlayingBool = true;
        if (startText[1] == 9) {
            board = board_9;
        }
        else if (startText[1] == 13) {
            board = board_13;
            for (var num = 0; num < startText[2]; num++) {
                JoinStone(nowTurnBool, FirstPut_13[num[0]], FirstPut_13[num[1]]);
            }
        }
        else if (startText[1] == 19) {
            board = board_19;
            for (var num = 0; num < startText[2]; num++) {
                JoinStone(nowTurnBool, FirstPut_19[num[0]], FirstPut_19[num[1]]);
            }
        }

        msg.channel.send({ files: [board] });
        //}
        //else {
        //    msg.channel.send("プレイヤーが揃っていません");
        //}
    }
    //対局開始

    //対局終了
    if (text === "finish" || text === "Finish") {
        nowPlayingBool = false;
        nextTurnBool = false;
        playerBlack = "";
        playerWhite = "";
        nowBrackStone.length = 0;
        nowWhiteStone.length = 0;
        nowBrackAgehama.length = 0;
        nowWhiteAgehama.length = 0;
    }
    //対局終了

    // ダイスロール
    let dicePlace = text.split('D');   // ＠メンション a D b => aDb のダイスロール
    if (dicePlace[0] != null && dicePlace[1] != null && stringNumberBool(dicePlace[0]) && stringNumberBool(dicePlace[1])) {

        var returnNum = 0;
        for (var num = 0; num < Number(dicePlace[0]); num++) {
            returnNum += Math.floor(Math.random() * Number(dicePlace[1])) + 1;
        }
        msg.channel.send("" + returnNum);

    }
    // ダイスロール

})

client.login('ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.fVYjQc9msXYuQiroX8GMCQFUrhM')

////できること
//
// ＠メンション Brack     ==> 発言者を黒番に設定 (対局中以外)
// ＠メンション White     ==> 発言者を白番に設定 (対局中以外)
// ＠メンション Start,num1,num2 ==> 対局開始 (num1路盤,num2子の置き石)
//
//  対局中
//     ＠メンション num1-num2 ==> num1,num2の位置に石を置く
//
// ＠メンション Finish    ==> 対局終了 (強制)
// ＠メンション aDb  　   ==> aDb のダイスロール