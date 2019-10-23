// 导入所有当前目录下以export导出的model
const models = {};
const req = require.context('./', true, /^(?!\.\/index).*\.js$/);
req.keys().forEach(key => {
  const moduleName = key.replace('./', '').replace('.js', '');
  const obj = req(key).default;
  models[moduleName] = obj;
});

export default models;
