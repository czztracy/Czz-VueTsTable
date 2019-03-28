// 测试地址
const api = () => {
  if (judgeUrl() === '003') {
    return 'http://47.104.98.71:8780/costmanagement/';
    // return 'http://dbs.haier.net/reportmanagement/';
  } else if (judgeUrl() === '002') {
    return 'http://dbs.haier.net/reportmanagement/';
  } else if (judgeUrl() === '001') {
    return 'http://47.104.98.71:8680/costmanagement/';
  }
  // return 'http://47.104.98.71:8780/costmanagement/';
  // return "http://costp2.qdct-lsb.haier.net/timermanagement/";
  // return "http://dbs.haier.net/reportmanagement/";
};

// 上传pdf id103
// pdf 注册 id140
// pdf 签章 id137
export const signatureUrl = () => {
  // return "http://costp2.qdct-lsb.haier.net/timermanagement/file/";
  // return 'http://dbs.haier.net/reportmanagement/';
  return 'http://dbs.haier.net/timermanagement/';
  // return "http://10.163.2.19:80/haiercostsupport/";
};

// 判断是否本地地址 是本地 返回true  不是返回false
// code   001演示  002 正式  003 本地
const judgeUrl = () => {
  const url = window.location.href;
  if (typeof url === 'string') {
    if (url.indexOf('http://localhost') !== -1) {
      const code = '003';
      return code;
    } else if (url.indexOf('http://dbs.haier.net') !== -1) {
      const code = '002';
      return code;
    } else {
      const code = '001';
      return code;
    }
  }
};
// 插件版本号 更新插件时需手动更新
const tableVersion  = "^0.1.29";
export { tableVersion, judgeUrl, api };