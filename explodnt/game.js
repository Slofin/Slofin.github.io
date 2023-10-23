import { Checkboxland } from '../checkboxtetris/checkBox.js';

//簡化這些炸彈
//就可以 Bomb[0].classList.add("red");
var bomb = [document.getElementById("divBomb1"),
document.getElementById("divBomb2"),
document.getElementById("divBomb3"),
document.getElementById("divBomb4"),
document.getElementById("divBomb5"),
document.getElementById("divBomb6"),];

var bombTimer = [];     // 當炸彈有時間執行參數時，會被放在這裡
var bombId = [];        // 用來存放各種 bombQuest
var randomOrder = [];   // 用來存放0~5，不重複數字的隨機陣列
var bombIdCount = 0;    // 用來存放id

// 一個炸彈由以下五個值組合：
class bombQuest {
    constructor(id, question, answer, whereBomb, bombType) {
        this.id = id;                   // id
        this.question = question;       // 問題
        this.answer = answer;           // 答案
        this.whereBomb = whereBomb;     // 炸彈的位置
        this.bombType = bombType;       // 炸彈的類型，只有
    }
}

// 藉由 Id 抓 html 改變 css 樣式的方便代碼
function setStyle(objId, propertyObject) {
    var elem = document.getElementById(objId);
    for (var property in propertyObject)
        elem.style[property] = propertyObject[property];
}

// 跳過開場動畫，Debug用
function skipIntro() {
    // 我不寫這個會可能等Intro等到死掉

    setStyle("divBackground", { 'animation': 'fade-out 0.1s', 'animation-fill-mode': 'forwards' });
    setStyle("divRightBottomButton", { 'visibility': 'hidden' });
    setStyle("divRightBottomButtonText", { 'visibility': 'hidden' });
    setStyle("initButton", { 'visibility': 'hidden' });
    setStyle("startText", { 'animation': 'fadeInAndOut 0.1s', 'animation-fill-mode': 'forwards' });

    setTimeout(function () {
        setStyle("divBomb", { 'animation': 'fade-in 0.1s', 'visibility': 'visible' });
    }, 200);

}

// 開始按鈕被按下之後
function gameStartButton() {

    // 這裡你按下了開始按鈕
    // FACT : animation-fill-mode 只會在動畫執行中有作用，而不是套用以後的動畫
    setStyle("divBackground", { 'animation': 'fade-out 2s', 'animation-fill-mode': 'forwards' });
    setStyle("divRightBottomButton", { 'visibility': 'hidden' });
    setStyle("divRightBottomButtonText", { 'visibility': 'hidden' });
    setStyle("initButton", { 'visibility': 'hidden' });
    setStyle("startText", { 'animation': 'fadeInAndOut 5s', 'animation-fill-mode': 'forwards' });

    //有延遲的動畫
    setTimeout(function () {
        setStyle("divBomb", { 'animation': 'fade-in 5s', 'visibility': 'visible' });
    }, 4000);

}

// 設定一個炸彈
function setBomb(bombDiv, bombType) {
    var bombText = "";
    switch (bombType) {
        case 0: {//炸彈模塊【計時器】 TODO
            // -----------------------------------------------------------

            //
            // 炸彈模塊【計時器】
            // 你知道嗎？我做了三個炸彈之後才做了計時器。
            //

            // -----------------------------------------------------------
        }

        case 1: {//炸彈模塊【"E"生在哪】

            // -----------------------------------------------------------

            // 炸彈模塊 【"E"生在哪】
            // 這裡有好多1...E..小寫e? 
            //
            // 規則：
            // 
            // 該模塊會有兩個被 "e","E","1" 填滿的文字方塊
            // 要成功拆除這個模組，就需要根據條件改變字串
            // 兩個字串都必須答對才會拆除，若答錯就會重置該區塊。
            // 
            // 條件：                                          應對：
            // 如果該字串長度為 8，                            刪除該字串所有的 E。               
            // 否則，如果該字串有兩個相連的 E，                 該字串所有的 e 更換為 E。
            // 否則，如果該字串的 e, E, 1 三者只有其中兩種，    將該字串尾端新增一個缺失的字。(如果只有 e 和 E，新增一個1在尾端)。
            // 否則，如果該字串的數字跟字母一樣多(字母包含E和e)，如果開頭是數字，將該字串所有 E 和 e 刪除。否則刪除該字串所有數字。
            // 否則，                                          將該字串刪除。

            // -----------------------------------------------------------

            // 這一段生成由 "e","E","1" 組成，長度為 5~8 的字串的陣列[0,1,2]
            // 這會顯示在文字方塊上作為提示。   

            var questions = [];
            for (var k = 0; k <= 1; k++) {
                var question = '';
                var loop = Math.floor(Math.random() * 4) + 5; // 5~8
                var choice;
                for (var i = 1; i <= loop; i++) {
                    choice = Math.floor(Math.random() * 3) + 1; // 1~3
                    if (choice == 1) {
                        question += "e";
                    }
                    else if (choice == 2) {
                        question += "E";
                    }
                    else {
                        question += "1";
                    }
                }
                questions[k] = question;
            }

            //這裡生成解答
            var answers = [];
            for (var k = 0; k <= 1; k++) {

                //答案向下覆蓋
                var answer = ""; // 否則，將該字串刪除。 優先度 5

                //如果該字串的數字跟字母一樣多 優先度 4
                var questionNumCounts = questions[k].match(/(1)/g);
                var questionFontCounts = questions[k].match(/(e|E)/g);

                //如果沒有0或Ee他會null
                if (questionNumCounts == null) {
                    questionNumCounts = 0;
                }

                if (questionFontCounts == null) {
                    questionFontCounts = 0;
                }

                if (questionNumCounts.length == questionFontCounts.length) {
                    if (questions[k].match(/^(e|E)/)) {
                        answer = questions[k].replace(/1/g, '');
                    }
                    else if (questions[k].match(/^1/)) {
                        answer = questions[k].replace(/(E|e)/g, '');
                    }
                    else {
                        alert("可能哪裡出錯了");
                    }
                }

                // 如果該字串的 e, E, 1 三者只有其中兩種 優先度 3
                // 用 Set 抓唯一值，並驗證缺失了其中一種
                var questionSet = Array.from(new Set(questions[k]));
                if (questionSet[2] == undefined) {
                    var lost = "Ee1";
                    questionSet.forEach(e => {
                        lost = lost.replace(e, '');
                    });
                    answer = questions[k] + lost;
                }


                //如果該字串有兩個相連的 E 優先度 2
                if (questions[k].match(/E{2}/)) {
                    answer = questions[k].replace(/e/g, 'E'); // 這裡用 /e/g ，正規表示式會抓到全部的小寫e
                }

                //如果該字串長度為 8 優先度 1
                if (questions[k].match(/^(e|E|1){8}$/)) {
                    answer = questions[k].replace(/E/g, ''); //  刪除該字串所有的 E。
                }

                answers[k] = answer;
            }

            //設定這個炸彈的數值與答案
            bombId.push(new bombQuest(bombIdCount, questions[0], answers[0], bombDiv, bombType));
            bombId.push(new bombQuest(bombIdCount + 1, questions[1], answers[1], bombDiv, -1));
            // bombId.push(new bombQuest(bombIdCount + 2, questions[2], answers[2], bombDiv, bombType));

            //這裡寫入炸彈的 html，這沒辦法換行。
            bombText = `<div class="divInsidebomb" style="left:9%; top:20%; width:80%; height: 10%; text-align: center;"> <input type="text" id="${bombIdCount}" value="${questions[0]}" style="font-size: 20px;width:100%;height: 100%;text-align: center;"> </div> <div class="divInsidebomb" style="left:9%; top:28%; width:80%; height: 10%; text-align: center;"> <input type="text" id="${(bombIdCount + 1)}" value="${questions[1]}" style="font-size: 20px;width:100%;height: 100%;text-align: center;"> </div> <div class="divInsidebomb" style="left:33%; top:45%; width:29%; text-align: center;"> <button style="font-size:24px; width:120%" id="bombbutton${bombIdCount}">提交</button> </div>`;


            bomb[bombDiv].innerHTML = bombText;

            $("#bombbutton" + bombIdCount).bind('click', function () {
                submitBomb(bombDiv);
            })

            // bombText = '<div class="divInsidebomb" style="left:9%; top:20%; width:80%; height: 10%; text-align: center;"> <input type="text" id="' + bombIdCount + '" value="' + questions[0] + '" style="font-size: 20px;width:100%;height: 100%;text-align: center;"> </div> <div class="divInsidebomb" style="left:9%; top:28%; width:80%; height: 10%; text-align: center;"> <input type="text" id="' + (bombIdCount + 1) + '" value="' + questions[1] + '" style="font-size: 20px;width:100%;height: 100%;text-align: center;"> </div> <div class="divInsidebomb" style="left:9%; top:36%; width:80%; height: 10%; text-align: center;"> <input type="text" id="' + (bombIdCount + 2) + '" value="' + questions[2] + '" style="font-size: 20px;width:100%;height: 100%;text-align: center;"> </div> <div class="divInsidebomb" style="left:33%; top:45%; width:29%; text-align: center;"> <button onclick="submitBomb(' + bombDiv + ')" style="font-size:24px; width:120%;">提交</button> </div>';

            //把 bombIdCount 往前推避免重疊
            bombIdCount += 2;

            break; //好不容易寫完了，但別忘了這裡是在 switch case 裡面
        }

        case 2: {//炸彈模塊【按鈕】

            // -----------------------------------------------------------

            //
            // 炸彈模塊 【按鈕】
            // 只要是炸彈那就少不了按鈕的，接受現實吧。
            // 
            // 如果上面沒有字，按兩次。
            // 否則，如果上面有數字且是偶數，依照上面的數字按下按鈕數次。若是奇數，按一次。
            // 否則，如果按鈕是藍色，按鈕上每有一個字就按一次。
            // 否則，如果按鈕上面若有人稱代名詞（你、我、他），按六次。
            // 否則，按一次。 
            // 

            // -----------------------------------------------------------


            var questions = [];

            //這裡是按鈕上面的字，隨機挑一個
            const question0List =
                ["按鈕", "藍色", "紅色", "綠色", "黃色",
                    "不知道", "我不知道", "你說什麼", "按我", "爆炸",
                    "", "", "按下", Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1];
            questions[0] = question0List[Math.floor(Math.random() * question0List.length)];

            //這裡是按鈕上面的顏色，隨機挑一個
            const question1List = ["Blue", "Red", "Green", "Yellow"];
            questions[1] = question1List[Math.floor(Math.random() * question1List.length)];

            //這裡寫答案，預設為按一下
            var answer = 1;

            //避免程式爆掉，外面套了typeof
            if (typeof questions[0] == 'string') {
                if (questions[0].match(/(你|我|他)/g)) {
                    answer = 6;
                }
            }

            if (questions[1] == "Blue") {
                answer = questions[0].length;
            }

            if (typeof questions[0] == 'number') {
                questions[0] % 2 == 0 ? answer = questions[0] : answer = 1;
            }

            if (questions[0] == '') {
                answer = 2;
            }

            //設定這個炸彈的數值與答案
            bombText += `<button id="bombbutton${bombIdCount}" class="roundButton roundButton${questions[1]}">${questions[0]}</button>`;
            bombId.push(new bombQuest(bombIdCount, questions[0], answer, bombDiv, bombType));
            bombId.push(new bombQuest(bombIdCount + 1, questions[1], 0, bombDiv, -1));

            bomb[bombDiv].innerHTML = bombText;

            $("#bombbutton" + bombIdCount).bind('click', function () {
                submitBomb(bombDiv);
            })


            bombIdCount += 2;
            break;
        }

        case 3: {//炸彈模塊【打勾方塊】 TODO

            // -----------------------------------------------------------

            //
            //  Feat.Checkboxland 行欄列行不行？
            //
            //  該模塊為 6x6 的打勾方塊陣列
            //  必須在按兩次內，將圖形按成以下的其中一個就可以拆除：
            //  [附件：九種可能的答案]
            //  *若一開始顯示的就是答案，在某一格上點兩下就可以拆除。
            //  *技術上問題所以沒辦法生成兩個以上的該模塊
            //

            // -----------------------------------------------------------

            bombText += `<div class="checkboxlandBox"><div id="checkboxland"></div></div>`;
            bomb[bombDiv].innerHTML = `${bombText}`;
            const cbl = new Checkboxland({ dimensions: '6x6' });

            const heart = [
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
            ];


            cbl.setData(heart);

            break;
        }

        default: {
            console.log("朋友你忘記放break了");
            break;
        }
    }
    // $(`#${bomb[bombDiv].id}`).html(bombText);
    // bomb[bombDiv].innerHTML = bombText;
}

// 驗證某顆炸彈，由按鈕使用觸發
function submitBomb(bombDivForSolveCheck) {
    var correct = true;
    //用 forEach 找到按鈕觸發的所有問題
    bombId.forEach(e => {
        //先抓是哪一顆炸彈被觸發解答了
        if (e.whereBomb == bombDivForSolveCheck) {

            // console.log(`題目為:${e.question}`);
            // console.log(`答案為:${e.answer}`);
            switch (e.bombType) {
                case 1: {
                    if (bombId[e.id].answer == document.getElementById(e.id).value &&
                        bombId[e.id + 1].answer == document.getElementById(e.id + 1).value) {
                        console.log("答對");
                        bombTrigger(true, bombDivForSolveCheck);
                    }
                    else {
                        console.log("答錯");
                        bombTrigger(false, bombDivForSolveCheck);
                    }
                    break;
                }

                case 2: {
                    //每按一次，變數+1，且重置按鈕觸發的時間
                    bombId[e.id + 1].answer++;
                    console.log(bombId[e.id + 1].answer);

                    clearTimeout(bombTimer[e.id]);
                    bombTimer[e.id] = setTimeout(function () {
                        if (e.answer == bombId[e.id + 1].answer) {
                            console.log("答對");
                            bombTrigger(true, bombDivForSolveCheck);
                        }
                        else {
                            console.log("答錯");
                            bombTrigger(false, bombDivForSolveCheck);
                        }
                    }, 1000);
                    break;
                }

                default: {
                    break;
                }
            }

        }
    });




}

// 觸發某顆炸彈
function bombTrigger(correct, bombDivForSolveCheck) {
    if (correct) {   // 回答正確
        //動畫：炸彈被拆除之後掉落
        var styleSelector = "divBomb" + (bombDivForSolveCheck + 1).toString();
        setStyle(styleSelector, {
            "animation": "bombDrop 1.5s",
            "pointer-events": "none",
            "animation-fill-mode": "forwards"
        });
        //刪除掉炸彈
        setTimeout(function () {
            bomb[bombDivForSolveCheck].innerHTML = '';
        }, 2000);
    }
    else {  // 回答錯誤
        //重骰該題目
        var bombTypeTemp;

        bombId.forEach(e => {
            if (e.whereBomb == bombDivForSolveCheck) {
                if (e.bombType != -1) {
                    bombTypeTemp = e.bombType;
                }
                bombId[e.id].whereBomb = -1;
            }
        })

        bomb[bombDivForSolveCheck].innerHTML = '';
        setBomb(bombDivForSolveCheck, bombTypeTemp);

        var styleSelector = "divBomb" + (bombDivForSolveCheck + 1).toString();
        setStyle(styleSelector, {
            "animation": "bombShake 0.5s",
            "animation-fill-mode": "none",
        });
        setTimeout(function () { setStyle(styleSelector, { "animation": "" }); }, 500);

    }

    correct ? console.log("沒炸") : console.log("炸了");
}

// 用來生產0~5，但不重複數字的隨機陣列
function Bag() {
    var nums = [0, 1, 2, 3, 4, 5],
        ranNums = [],
        i = nums.length,
        j = 0;
    if (randomOrder.length <= 6) {
        while (i--) {
            j = Math.floor(Math.random() * (i + 1));
            ranNums.push(nums[j]);
            nums.splice(j, 1);
        }
        ranNums.forEach(e => randomOrder.push(e));
    }
}

//跳過開場
skipIntro();

//生產0~5，不重複數字的隨機陣列，用來擺放不重複位置的炸彈
Bag();






//放炸彈

setBomb(randomOrder[0], 1);
setBomb(randomOrder[1], 2);
setBomb(randomOrder[3], 2);
setBomb(randomOrder[2], 3);


$(".divInitButton>Button").bind('click', function () {
    gameStartButton();
});