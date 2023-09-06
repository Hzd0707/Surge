let obj = JSON.parse($response.body);

    obj.result.vip_expired_at = 4075798974,
    obj.result.is_xy_vip = true,
    obj.result.xy_vip_expire = 0,
    obj.result.is_vip = true

$done({body: JSON.stringify(obj)});
#Surge #模块 #Reddit 过滤推广, 关 NSFW 提示
小脚本小模块就不放 GitHub 了

① reddit.sgmodule
#!name=Reddit
#!desc=过滤推广, 关 NSFW 提示 @xream

[Script]
Reddit = type=http-response,pattern=^https?:\/\/gql\.reddit\.com,requires-body=1,max-size=0,timeout=30,script-path=reddit.js

[MITM]
hostname = %APPEND%, gql.reddit.com
② reddit.js
let modified;
let body;
try {
  body = JSON.parse($response.body.replace(/\"isNsfw\"/gi, '"_isNsfw"'));
  if (body?.data?.subredditInfoByName?.elements?.edges) {
    body.data.subredditInfoByName.elements.edges =
      body.data.subredditInfoByName.elements.edges.filter(
        i => i?.node?.__typename !== 'AdPost'
      );
    modified = true;
  } else if (body?.data?.home?.elements?.edges) {
    body.data.home.elements.edges = body.data.home.elements.edges.filter(
      i => i?.node?.__typename !== 'AdPost'
    );
    modified = true;
  } else if (body?.data?.homeV3?.elements?.edges) {
    body.data.homeV3.elements.edges = body.data.homeV3.elements.edges.filter(
      i => !i?.node?.cells?.some(j => j?.__typename === 'AdMetadataCell')
    );
    modified = true;
  } else if ($response.body.includes('"isNsfw"')) {
    modified = true;
  }
} catch (e) {
  console.log(e)
} finally {
  $done(modified ? { body: JSON.stringify(body) } : {});
}

相关: 如何使用 Gist 创建私有脚本/模块
