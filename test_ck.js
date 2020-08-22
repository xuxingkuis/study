//console.log(`远程测试`);
//$notification.post('title标题title标题', 'subTitle子标题subTitle子标题subTitle子标题','body内容body内容body内容body内容body内容body内容') //用于通知栏提醒
///$done({});

const $iosrule = iosrule();//声明必须

const app = "趣看天下";



if ($iosrule.isRequest) {

    qktx_writeck();

}

$iosrule.end();


function qktx_writeck() {


    if ($request.headers) {

        var urlVal = $request.url;
        var headVal = $request.headers;
        var bdVal = $request.body;

        console.log(`当前抓到的url是:${urlVal}`);

        if (urlVal.indexOf("addCoin?") != -1) {

                console.log(`已经进入addCoin页面`);
            
            var ok = $iosrule.write(urlVal, "readUrl"); //阅读文章好后金币url和参数保存下来,因为是get的 
            if (ok == true) {
                $iosrule.notify(app, "[阅读文章]", "写入阅读文章数据成功");
                console.log(`写入阅读文章数据成功`);
            }
            

        }
        else if (urlVal.indexOf("addCoinSearch") != -1) {

            console.log(`已经进入addCoinSearch页面`);
            
            var ok1 = $iosrule.write(urlVal, "searchUrl"); //因为是post的 
            var ok2 = $iosrule.write(bdVal, "searchBody");
            if (ok1 == true && ok2 == true) {
                $iosrule.notify(app, "[搜索文章]", "写入搜索文章数据成功");
                console.log(`写入搜索文章数据成功`);
            }
            

        }


    }


}






//适合surge,圈x,loon三个通用写法
function iosrule() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, callback)
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, get, post, end }
};







