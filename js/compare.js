const blockElements = document.getElementsByClassName('comparison-block'); //arrow,before-img,after-imgを囲む要素
const elements = document.getElementsByClassName('comparison-arrow'); //ドラッグできる境界線の要素
const beforeImages = document.getElementsByClassName('comparison-before-img'); //変更前の画像を囲むdivタグ要素
let device = ''; // デバイス
let move_start_x = 0; // 境界線のX線上の初期値
let move_flg = false; // マウスダウンをしているかどうかのbool値
let dragMoveFunc = ''; // mouseDrag関数を格納するための変数
let preventEvent = ''; // スクロール禁止の関数を格納するための変数
let startEvent = ''; // ドラッグ開始イベント
let moveEvent = ''; // ドラッグ中のイベント
let endEvent = ''; // ドラッグ終了のイベント

//UAによるデバイス判定
if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Windows Phone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0) {
  device = 'smt';
} else {
  device = 'pc';
}

//イベントの種類を設定
if (device == 'smt') {
  //スマホ時のイベントの種類
  startEvent = 'touchstart';
  moveEvent = 'touchmove';
  endEvent = 'touchend';
} else {
  //パソコン時のイベントの種類
  startEvent = 'mousedown';
  moveEvent = 'mousemove';
  endEvent = 'mouseup';
}

//マウスダウン、タッチスタート時の関数
function dragStart(e) {
  let event = '';
  if (device === 'smt') {
    event = e.changedTouches[0];
  } else {
    event = e;
  }
  move_flg = true;
  let for_flag = false;
  let targetElement = ''; //arrow要素

  //PCとスマホでは「startEvent」の対象要素が違うため、arrow要素を取得するためにそれぞれ違う処理を行う
  if (device == 'smt') {
    for (let childEle of this.children) {
      for (let childEleClass of childEle.classList) {
        if (childEleClass == 'comparison-arrow') {
          move_start_x = event.pageX - childEle.offsetLeft;
          targetElement = childEle;
          break;
          for_flag = true;
        }
      }
      if (for_flag) {
        break;
      }
    }
  } else {
    move_start_x = event.pageX - this.offsetLeft;
    targetElement = this;
  }
  dragMoveFunc = function (e) {
    dragMove(e, targetElement)
  } //イベントの解除を有効にするためにdragMoveを一度dragMoveFuncに格納
  document.body.addEventListener(moveEvent, dragMoveFunc, false); //dragMoveFuncを実行
}

//マウスムーブ、タッチムーブ時の関数
function dragMove(e, ele) {
  let event = '';
  if (device === 'smt') {
    event = e.changedTouches[0];
  } else {
    event = e;
  }

  //スクロール禁止にする
  preventEvent = function (event) {
    event.preventDefault();
  }
  // move_flgは mouseDownを通るとtrueになり、mouseUpを通るとfalseになる
  if (move_flg) {
    let arrowElement = ele;
    let blockElement = ele.parentNode;
    let for_flag = false;
    let beforeImgElement = '';
    // イベントが発火した blockElements の子要素の「.comparison-before-img」を取得
    for (let childEle of blockElement.children) {
      for (let childEleClass of childEle.classList) {
        if (childEleClass == 'comparison-before-img') {
          beforeImgElement = childEle;
          break;
          for_flag = true;
        }
      }
      if (for_flag) {
        break;
      }
    }
    let X = event.clientX - move_start_x;
    let maxX = blockElement.clientWidth;
    // arrow要素が全体を囲んでいる要素からはみ出さないように移動の下限、上限を設定
    if (X < 0) {
      arrowElement.style.left = '0px'; //arrow要素のx値
      beforeImgElement.style.width = '0px'; //before-imgのwidth
    } else if (X > maxX) {
      arrowElement.style.left = `${maxX}px`; //arrow要素のx値
      beforeImgElement.style.width = `${maxX}px`; //before-imgのwidth
    } else {
      arrowElement.style.left = `${X}px`; //arrow要素のx値
      beforeImgElement.style.width = `${X}px`; //before-imgのwidth
    }
  }
}

//マウスアップ、タッチエンド時の関数
function dragEnd() {
  move_flg = false;
  // dragMoveFuncを解除する
  document.body.removeEventListener(moveEvent, dragMoveFunc, false);
  // スクロール禁止を解除
  document.body.removeEventListener(moveEvent, preventEvent, false);
}

//ロード時の関数
function loadFunc() {
  for (let i = 0; i < elements.length; i++) {
    let w = blockElements[i].clientWidth;
    // 「.before-img」のwidthを親要素の半分にする
    beforeImages[i].style.width = `${w/2}px`;
    // 「.before-img」の子要素の画像サイズを変換
    beforeImages[i].children[0].style.width = `${w}px`;
  }
}

//リサイズ時の関数
function resizeFunc() {
  for (let i = 0; i < elements.length; i++) {
    let w = blockElements[i].clientWidth;
    // arrow要素を全体の真ん中の位置に移動させる
    elements[i].style.left = `${w/2}px`;
    // 「.before-img」のwidthを親要素の半分にする
    beforeImages[i].style.width = `${w/2}px`;
    // 「.before-img」の子要素の画像サイズを変換
    beforeImages[i].children[0].style.width = `${w}px`;
  }
}


//関数の実行
if (device == 'smt') {
  for (let i = 0; i < elements.length; i++) {
    //スマホ時はユーザビリティ向上の為、イベント発火の対象はarrow部分でなく、画像を囲む要素
    blockElements[i].addEventListener(startEvent, dragStart, false);
  }
} else {
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener(startEvent, dragStart, false);
  }
}
document.body.addEventListener(endEvent, dragEnd, false);
window.addEventListener("load", loadFunc, false);
window.addEventListener("resize", resizeFunc, false);


/*
*
scroll-anim
*
*/

document.addEventListener('DOMContentLoaded', function() {

  var markerText = document.querySelectorAll('.comparison-arrow'); // 監視対象を選択
  var markerTextArr = Array.prototype.slice.call(markerText); // 監視対象をArrayに変換（IE対策）

  /* IntersectionObserverに渡すコールバック関数 */
  var cb = function(entries, observer) {
    entries.forEach((entry) => {

      if(entry.isIntersecting) {
        /* 監視対象が画面内に入ったときのアクション */
        entry.target.classList.add('inview'); // 画面内に入った要素にinviewクラスを付与
        observer.unobserve(entry.target); // 1度発火した後監視を止める
      }
    });
  }
  
  /* IntersectionObserverに渡すコールバック関数 */
  var options = {
    rootMargin: "-10px 0px"
  }

  /* IntersectionObserver初期化 */
  var io = new IntersectionObserver(cb, options);
  io.POLL_INTERVAL = 100; // Polyfillの設定

  markerTextArr.forEach(el => {
    io.observe(el);
  });

});