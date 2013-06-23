$(document).ready(function () {
    if (typeof localStorage["feeds"] == "undefined") {
        restoreDefault();
    }
    //load local storage feeds
    var feeds = eval(localStorage["feeds"]);
    var myfeeds = null;
    if (feeds !== null) {
        myfeeds = "<header>My feeds</header><ul>";
        for (var i = 0; i < feeds.length; i++) {
            var feed = new google.feeds.Feed(feeds[i]);
            myfeeds += '<li><a href="#" onclick="loadFeed(\'' + feeds[i] + '\');">' + feeds[i] + '</a></li>';
        }
        myfeeds += "</ul>";
        $("#yourfeeds").html(myfeeds);
    }
});

//FUNCS

function restoreDefault() {
    localStorage.clear();
    var feeds = [];
    feeds.push("http://daker.me/feed.xml");
    feeds.push("http://www.omgubuntu.co.uk/feed");
    feeds.push("http://hespress.com/feed/index.rss");
    feeds.push("http://rss.slashdot.org/Slashdot/slashdot");
    feeds.push("http://www.reddit.com/.rss");

    localStorage.setItem("feeds", JSON.stringify(feeds));
    window.location.reload();
}

function loadFeed(url) {
    var rnd = Math.floor(Math.random() * 10000000);
    var feed = new google.feeds.Feed(url);
    feed.setNumEntries(30);
    feed.load(function (result) {
        if (!result.error) {
            myfeeds_items = "<header>" + result.feed.title + "</header><ul>";
            for (var i = 0; i < result.feed.entries.length; i++) {
                myfeeds_items += '<li><a href="#" onclick=\'showArticle("' + escape(result.feed.entries[i].title) + '","' + escape(result.feed.entries[i].link) + '","' + escape(result.feed.entries[i].content) + '")\'>' + result.feed.entries[i].title.replace(/"/g, "'") + '</a></li>';
            }
            myfeeds_items += "</ul>";
            $("#resultscontent").html(myfeeds_items);
        } else
            alert('feed error');
    });
}

function showArticle(title, url, desc) {
    if (typeof desc == "undefined")
        desc = "(No description provided)";
    $("section.articleinfo").html("<p>" + unescape(title) + "</p><p>" + unescape(desc) + "</p><p><a target=\"_blank\" href=\"" + unescape(url) + "\">" + unescape(url) + "</a></p>");
}

//google feeds api
google.load("feeds", "1");

function OnLoad() {}
google.setOnLoadCallback(OnLoad);