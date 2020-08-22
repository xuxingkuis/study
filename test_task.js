


const $iosrule = iosrule();//声明必须

const app = "趣看天下";

var readUrl = $iosrule.read("readUrl");
var searchUrl = $iosrule.read("searchUrl");
var searchBody = $iosrule.read("searchBody");


main();




function main() {

    setTimeout(function () {
        //qktx_read();
        console.log("[readUrl]:"+readUrl);
    }, 0.5 * 1000);


    setTimeout(function () {
        //qktx_ss();
        //$iosrule.notify(app, "[远程测试]", "[远程测试弹窗]" + app);
        console.log("[searchUrl]:"+searchUrl);
        console.log("[searchBody]:"+searchBody);
    }, 2 * 1000);


}




function qktx_read() {


    const url = { url: readUrl, headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 NetType/WIFI Qktx" }, timeout: 60 };

    $iosrule.get(url, function (error, response, data) {
        if (data != null) {

            var obj = JSON.parse(data);
            if (obj.result == 1) {
                console.log("[阅读文章奖励]" + obj.data.coinCount);
                $iosrule.notify(app, "[阅读文章]", "[阅读文章奖励]" + obj.data.coinCount);
            }
        } else {
            console.log("[阅读文章失败]" + obj.mes);
            $iosrule.notify(app, "[阅读文章]", "[阅读文章失败]" + obj.mes);
        }
    })

}


function qktx_ss() {

    const url = { url: searchUrl, headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 NetType/WIFI Qktx" }, body:searchBody,timeout: 60 };

    $iosrule.post(url, function (error, response, data) {
        if (data != null) {

            var obj = JSON.parse(data);
            if (obj.result == 1) {
                console.log("[搜索文章奖励]" + obj.data.coinCount);
                $iosrule.notify(app, "[搜索文章]", "[搜索文章奖励]" + obj.data.coinCount);
            }
        } else {
            console.log("[搜索文章失败]" + obj.mes);
            $iosrule.notify(app, "[搜索文章]", "[搜索文章失败]" + obj.mes);
        }
    })


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










