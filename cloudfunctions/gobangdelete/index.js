const cloud = require("tcb-admin-node");
cloud.init({
  env: "云开发环境ID",
});
const db = cloud.database();
exports.main = async (event, context) => {
  let date = new Date(new Date().getTime() - 30 * 60 * 1000);
  const remove = await db
    .collection("gobang")
    .where({
      date: db.command.lt(date),
    })
    .remove();
  return remove;
};
