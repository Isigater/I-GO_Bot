// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { Client, Intents, Channel } from 'discord.js';
const client = new Client({ intents: Object.keys(Intents.FLAGS) });
const sharp = require('sharp');

const stringNumberBool = n => typeof n === "string" && n !== "" && !isNaN(n); // int 化できるか

// 石を取る関数～
function StoneTrash(left, top, check) {
    let subYetCheckArray = new Array;
    let alreadyChackArray = new Array;
    let checkColor;
    if (check) checkColor = nowTurnBool;
    else checkColor = !nowTurnBool;

    console.log("debug2" + checkColor);

    if (checkColor) {
        console.log("debug3");
        //つながっている黒の石を取得
        if (check) {
            subYetCheckArray.push(blackStoneArray.indexOf([left, top]));
        }
        else {
            if (top != 1) subYetCheckArray.push(blackStoneArray.indexOf([left, top - 1]));
            if (top != boardSize) subYetCheckArray.push(blackStoneArray.indexOf([left, top + 1]));
            if (left != 1) subYetCheckArray.push(blackStoneArray.indexOf([left - 1, top]));
            if (left != boardSize) subYetCheckArray.push(blackStoneArray.indexOf([left + 1, top]));
        }
        console.log(subYetCheckArray);
        subYetCheckArray = subYetCheckArray.filter(pos => pos > 0);
        while (subYetCheckArray.length != 0) {
            for (let num = subYetCheckArray.length - 1; num >= 0; num--) {
                let topPos = blackStoneArray[subYetCheckArray[num]][1];
                let leftPos = blackStoneArray[subYetCheckArray[num]][0];
                alreadyChackArray.push(subYetCheckArray[num]);
                subYetCheckArray.splice(num, 1);
                if (topPos != 1) {
                    let index = blackStoneArray.indexOf([leftPos, topPos - 1]);
                    if (index == -1) subYetCheckArray.push(index);
                }
                if (topPos != boardSize) {
                    let index = blackStoneArray.indexOf([leftPos, topPos + 1]);
                    if (index == -1) subYetCheckArray.push(index);
                }
                if (leftPos != 1) {
                    let index = blackStoneArray.indexOf([leftPos - 1, topPos]);
                    if (index == -1) subYetCheckArray.push(index);
                }
                if (leftPos != boardSize) {
                    let index = blackStoneArray.indexOf([leftPos + 1, topPos]);
                    if (index == -1) subYetCheckArray.push(index);
                }
            }
        }
        console.log("debug4  " + toString(alreadyChackArray.length));

        let connetctArray = blackStoneArray.concat(whiteStoneArray);
        for (let num = 0; num < alreadyChackArray.length; num++) {
            let thisCheckTopPos = blackStoneArray[alreadyChackArray[num]][1];
            let thisCheckLeftPos = blackStoneArray[alreadyChackArray[num]][0];
            if (thisCheckLeftPos != 1 && !connetctArray.includes([thisCheckLeftPos - 1, thisCheckTopPos])) return [];
            if (thisCheckLeftPos != boardSize && !connetctArray.includes([thisCheckLeftPos + 1, thisCheckTopPos])) return [];
            if (thisCheckLeftPos != 1 && !connetctArray.includes([thisCheckLeftPos, thisCheckTopPos - 1])) return [];
            if (thisCheckLeftPos != boardSize && !connetctArray.includes([thisCheckLeftPos, thisCheckTopPos + 1])) return [];
        }
        subYetCheckArray.sort(function (first, second) {
            if (first > second) return 1;
            else if (first < second) return -1;
            else return 0;
        });
        return subYetCheckArray;
    }
    else {
        //つながっている黒の石を取得
        if (check) {
            subYetCheckArray.push(whiteStoneArray.indexOf([left, top]));
        }
        else {
            if (top != 1) subYetCheckArray.push(whiteStoneArray.indexOf([left, top - 1]));
            if (top != boardSize) subYetCheckArray.push(whiteStoneArray.indexOf([left, top + 1]));
            if (left != 1) subYetCheckArray.push(whiteStoneArray.indexOf([left - 1, top]));
            if (left != boardSize) subYetCheckArray.push(whiteStoneArray.indexOf([left + 1, top]));
        }
        subYetCheckArray = subYetCheckArray.filter(pos => pos > 0);
        while (subYetCheckArray.length != 0) {
            for (let num = subYetCheckArray.length - 1; num >= 0; num--) {
                let topPos = whiteStoneArray[subYetCheckArray[num]][1];
                let leftPos = whiteStoneArray[subYetCheckArray[num]][0];
                alreadyChackArray.push(subYetCheckArray[num]);
                subYetCheckArray.splice(num, 1);
                if (topPos != 1) {
                    let index = whiteStoneArray.indexOf([leftPos, topPos - 1]);
                    if (index == -1) subYetCheckArray.push(index);
                }
                if (topPos != boardSize) {
                    let index = whiteStoneArray.indexOf([leftPos, topPos + 1]);
                    if (index == -1) subYetCheckArray.push(index);
                }
                if (leftPos != 1) {
                    let index = whiteStoneArray.indexOf([leftPos - 1, topPos]);
                    if (index == -1) subYetCheckArray.push(index);
                }
                if (leftPos != boardSize) {
                    let index = whiteStoneArray.indexOf([leftPos + 1, topPos]);
                    if (index == -1) subYetCheckArray.push(index);
                }
            }
        }

        let connetctArray = whiteStoneArray.concat(whiteStoneArray);
        for (let num = 0; num < alreadyChackArray.length; num++) {
            let thisCheckTopPos = whiteStoneArray[alreadyChackArray[num]][1];
            let thisCheckLeftPos = whiteStoneArray[alreadyChackArray[num]][0];
            if (thisCheckLeftPos != 1 && !connetctArray.includes([thisCheckLeftPos - 1, thisCheckTopPos])) return [];
            if (thisCheckLeftPos != boardSize && !connetctArray.includes([thisCheckLeftPos + 1, thisCheckTopPos])) return [];
            if (thisCheckLeftPos != 1 && !connetctArray.includes([thisCheckLeftPos, thisCheckTopPos - 1])) return [];
            if (thisCheckLeftPos != boardSize && !connetctArray.includes([thisCheckLeftPos, thisCheckTopPos + 1])) return [];
        }
        subYetCheckArray.sort(function (first, second) {
            if (first > second) return 1;
            else if (first < second) return -1;
            else return 0;
        });
        return subYetCheckArray;
    }
}
// ～石を取る関数

// 画像合成関数～
async function JoinStone(white, leftNum, topNum) {
    if (white) {
        if (boardSize == 9) {
            whiteStoneArray.push({
                input: "I-Go_Bot/WhiteStone.png",
                blend: "over",
                top: topNum * 40 - 20,
                left: leftNum * 40 - 20
            });
        }
        else if (boardSize == 13) {
            whiteStoneArray.push({
                input: "I-Go_Bot/WhiteStone.png",
                blend: "over",
                top: topNum * 40 - 20,
                left: leftNum * 40 - 20
            });
        }
        else if (boardSize == 19) {
            whiteStoneArray.push({
                input: "I-Go_Bot/WhiteStone.png",
                blend: "over",
                top: topNum * 40 - 20,
                left: leftNum * 40 - 20
            });
        }
    }
    else {
        if (boardSize == 9) {
            blackStoneArray.push({
                input: "I-Go_Bot/BlackStone.png",
                blend: "over",
                top: topNum * 40 - 20,
                left: leftNum * 40 - 20
            });
        }
        else if (boardSize == 13) {
            blackStoneArray.push({
                input: "I-Go_Bot/BlackStone.png",
                blend: "over",
                top: topNum * 40 - 20,
                left: leftNum  * 40 - 20
            });
        }
        else if (boardSize == 19) {
            blackStoneArray.push({
                input: "I-Go_Bot/BlackStone.png",
                blend: "over",
                top: topNum * 40 - 20,
                left: leftNum * 40 - 20
            });
        }
    }
    let image;
    if (boardSize == 9) image = sharp("I-Go_Bot/IGo_Board_9.png");
    else if (boardSize == 13) image = sharp("I-Go_Bot/IGo_Board_13.png");
    else if (boardSize == 19) image = sharp("I-Go_Bot/IGo_Board_19.png");
    let connetctArray = blackStoneArray.concat(whiteStoneArray);
    await image.composite(connetctArray);
    //await image.composite(whiteStoneArray);
    thisChannel.send({ files: [image] });
}
// ～画像合成関数

const FirstPut_19 = [/*1*/[[4, 16]], /*2*/[[4, 16], [16, 4]], /*3*/[[4, 16], [16, 4], [16, 16]], /*4*/[[4, 16], [16, 4], [16, 16], [4, 4]],
    /*5*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 10]], /*6*/[[4, 16], [16, 4], [16, 16], [4, 4], [16, 10], [4, 10]], /*7*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 16], [10, 4], [10, 10]],
    /*8*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 16], [10, 4], [4, 10], [16, 10]], /*9*/[[4, 16], [16, 4], [16, 16], [4, 4], [10, 16], [10, 4], [4, 10], [16, 10], [10, 10]]];
const FirstPut_13 = [/*1*/[[4, 10]], /*2*/[[4, 10], [10, 4]], /*3*/[[4, 10], [10, 4], [10, 10]], /*4*/[[4, 10], [10, 4], [10, 10], [4, 4]]];
const blackStone = sharp("I-Go_Bot/BlackStone.png");
const whiteastone = sharp("I-Go_Bot/WhiteStone.png");

let boardSize; // 盤の大きさ(9,13,19)
let nowPlayingBool = false; //今プレイ中かどうか
let nowTurnBool = false; //今の手番　false => 黒、true => 白
let playerBlack = "", playerWhite = ""; //対戦しているユーザー
let nowBrackStone = new Array; //黒い碁石の位置 (配列)
let nowWhiteStone = new Array; //白い碁石の位置 (配列)
let blackAgehama = 0; //黒のアゲハマの個数
let whiteAgehama = 0; //白のアゲハマの個数
let blackStoneArray = new Array; //黒石の画像合成用の配列
let whiteStoneArray = new Array; //白石の画像合成用の配列
let thisChannel;

client.on('ready', () => {
    console.log(`LogInAs${client.user.tag}`)
})

client.on('messageCreate', async msg => { //メッセージの取得
    if (msg.author.bot) return; // bot の発言は無視
    let text = msg.content;

    if (!msg.mentions.users.has(client.user.id)) {
        msg.delete;
        return;
    } //メンションされなければ終了

    //メンション部分を除く
    if (text[0] === '<') text = text.split(" ").join("").split(">")[1];
    else if (text[text.length - 1] === '>') text = text.split(" ").join("").split("<")[0];

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

    const board_9 = sharp("I-Go_Bot/IGo_Board_9.png");
    const board_13 = sharp("I-Go_Bot/IGo_Board_13.png");
    const board_19 = sharp("I-Go_Bot/IGo_Board_19.png");
    let board; //盤の画像
    thisChannel = msg.channel;
    msg.delete;

    let boardPlace = text.split('-');
    if (boardPlace[0] != null && boardPlace[1] != null && stringNumberBool(boardPlace[0]) && stringNumberBool(boardPlace[1]) && nowPlayingBool) {
        thisChannel.send(boardPlace[0]);
        thisChannel.send(boardPlace[1]);


        //選択された場所に既に石が置かれていたら警告だけする
        if (blackStoneArray.some(function (value) {
            return value[0] === Number(boardPlace[0]) && value[1] === Number(boardPlace[1]);
        }) || whiteStoneArray.some(function (value) {
            return value[0] === Number(boardPlace[0]) && value[1] === Number(boardPlace[1]);
        })) {
            thisChannel.send("選択された場所には既に石があります。別の場所を指定してください");
            return;
        }

        let keepBlackStone = blackStoneArray;
        let keepWhiteStone = whiteStoneArray;

        console.log("debug1");

        let delArray = StoneTrash(boardPlace[0], boardPlace[1], false);
        console.log("debug  " + delArray);
        if (nowTurnBool) {
            for (num = delArray.length - 1; num >= 0; num--) {
                blackStoneArray = blackStoneArray.splice(num, 1);
            }
        }
        else {
            for (num = delArray.length - 1; num >= 0; num--) {
                whiteStoneArray = whiteStoneArray.splice(num, 1);
            }
        }

        if (delArray.length == 0) {
            let checkArray = StoneTrash(boardPlace[0], boardPlace[1], true);
            if (checkArray.length != 0) {
                blackStoneArray = keepBlackStone;
                whiteStoneArray = keepWhiteStone;
                thisChannel.send("着手禁止点です");
                return;
            }

            if (nowTurnBool) whiteAgehama += delArray.length;
            else blackAgehama += delArray.length;
        }

        console.log("black: " + blackAgehama + "    white: " + whiteAgehama);

        if (boardSize === 9) board = sharp("I-Go_Bot/IGo_Board_9.png");
        else if (boardSize === 13) board = sharp("I-Go_Bot/IGo_Board_13.png");
        else if (boardSize === 19) board = sharp("I-Go_Bot/IGo_Board_19.png");
        await JoinStone(nowTurnBool, boardPlace[0], boardPlace[1], board);

        nowTurnBool = !nowTurnBool;
        console.log(nowBrackStone + "   " + nowWhiteStone);
    }

    

    //対局開始
    let startText = text.split(',');
    if ((startText[0] === "start" || startText[0] === "Start")) {
        if (startText.length <= 1) {
            thisChannel.send("対局を始めるには```@I-Go_Bot start,盤の大きさ(,置き石の数)```と入力してください");
            return;
        }
        if (startText.length == 2) startText.push("0");

        if (!stringNumberBool(startText[1]) || !stringNumberBool(startText[2])) {
            thisChannel.send("対局を始めるには```@I-Go_Bot start,盤の大きさ(,置き石の数)```と入力してください");
            return;
        }

        //if (playerBlack !== "" && playerWhite !== "") {
        boardSize = Number(startText[1]);
        console.log("start");
        if (startText[2] > 1) nowPlayingBool = true;
        else nowPlayingBool = false;

        if (startText[2] == 1) startText[2] = 0;

        var debugCount = 0;
        if (boardSize == 9) {
            board = board_9;
        }
        else if (boardSize == 13) {
            board = board_13;
            if (startText[2] > 4 || startText[2] < 0) {
                thisChannel.send("置き石の数が正しくありません");
                return;
            }
            else if (startText[2] != 0) {
                for (var num = 0; num < startText[2]; num++) {
                    blackStoneArray.push({
                        input: "I-Go_Bot/BlackStone.png",
                        blend: "over",
                        left: FirstPut_13[startText[2] - 1][num][0] * 40 - 20,
                        top: FirstPut_13[startText[2] - 1][num][1] * 40 - 20
                    });
                }
                await board.composite(blackStoneArray);
            }
        }
        else if (boardSize == 19) {
            board = board_19;
            if (startText[2] > 9 || startText[2] < 0) {
                thisChannel.send("置き石の数が正しくありません");
                return;
            }
            else if (startText[2] != 0) {
                for (var num = 0; num < startText[2]; num++) {
                    blackStoneArray.push({
                        input: "I-Go_Bot/BlackStone.png",
                        blend: "over",
                        left: FirstPut_19[startText[2] - 1][num][0] * 40 - 18,
                        top: FirstPut_19[startText[2] - 1][num][1] * 40 - 18
                    });
                }
                await board.composite(blackStoneArray);
            }
        }

        console.log(debugCount);
        thisChannel.send({ files: [board] });
        //}
        //else {
        //    msg.channel.send("プレイヤーが揃っていません");
        //}
    }
    //対局開始

    //対局終了
    if (text === "finish" || text === "Finish") {
        nowPlayingBool = false;
        nowTurnBool = false;
        playerBlack = "";
        playerWhite = "";
        nowBrackStone.length = 0;
        nowWhiteStone.length = 0;
        nowBrackAgehama = 0;
        nowWhiteAgehama = 0;
        blackStoneArray.length = 0;
        whiteStoneArray.length = 0;
        board = null;
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

    if (text == "debug") {
        let board_19let = sharp("I-Go_Bot/IGo_Board_19.png");
        let debugBoard = board_19
        console.log(board_19);
        thisChannel.send({ files: [board_19let] });
    }

})

client.login('ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.7dORqTnhCcDx_EiwOECr7mlLQVU');
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.fVYjQc9msXYuQiroX8GMCQFUrhM
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.Cv_xMP8kmM3_0B8HnQYi1QFh-eA
//ODk2NDI1MjIyODAxMDg0NTA2.YWG7Cw.7dORqTnhCcDx_EiwOECr7mlLQVU
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