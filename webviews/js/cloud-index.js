/**
 * 云开发全局对象
 */
var app = tcb.init({
  env: "云开发环境ID", // 请替换为你的环境名
});
/**
 * 云开发全局唯一身份，不要调用多次
 */
var auth = app.auth();
/**
 * 分享的棋局id，默认不分享为null，分享时置为数据库文档_id
 */
var showid = null;

/**
 * 初始化匿名登录
 * 使用云开发匿名登录进行初始化，为后续数据库写操作做准备
 */
function cloudinit() {
  auth
    .anonymousAuthProvider()
    .signIn()
    .then((res) => {
      console.log("初始化成功！");
      createbase();
    })
    .catch((err) => {
      alert("初始化失败！只能以本地形式开局");
      console.log(err);
      startgobang();
    });
}

/**
 * 创建数据文档
 * 为此局新建一个文档用于共享落子数据
 */
function createbase() {
  app
    .database()
    .collection("gobang")
    .add({
      maparr: maparr,
      step: step,
      newstep: null,
      date: new Date(),
    })
    .then((res) => {
      showid = res.id;
      showa.href = "show.html?id=" + showid;
      showa.style = "";
      startgobang();
    });
}

/**
 * 上报函数
 * 此函数是一个埋点函数，在index.js里每一个落子的步骤均主动调用此函数
 * @param {Object} newstep 落子的结构数据
 */
function updatecall(newstep) {
  //开启观看，showid有值时才上报
  if (showid != null) {
    app
      .database()
      .collection("gobang")
      .doc(showid)
      .update({
        maparr: maparr,
        step: step,
        newstep: newstep,
        date: new Date(),
      })
      .then((res) => {
        console.log(res);
        console.log("更新成功！");
      });
  }
}
