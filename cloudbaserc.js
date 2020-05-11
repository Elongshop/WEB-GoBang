module.exports = {
  envId: "云开发环境ID",
  functionRoot: "./cloudfunctions",
  functions: [
    // 此函数配置仅供参考，你需要创建一个 app 函数
    {
      name: "gobangdelete",
      config: {
        // 超时时间
        timeout: 60,
        // 环境变量
        envVariables: {},
        runtime: "Nodejs8.9",
      },
      triggers: [
        {
          name: "delete",
          type: "timer",
          config: "0 0/30 * * * * *",
        },
      ],
      handler: "index.main",
    },
  ],
};
