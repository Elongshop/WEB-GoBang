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
function cloudinit(success) {
  auth
    .anonymousAuthProvider()
    .signIn()
    .then((res) => {
      console.log("初始化成功！");
      success();
    })
    .catch((err) => {
      alert("初始化失败！请稍后再试");
      console.log(err);
    });
}
