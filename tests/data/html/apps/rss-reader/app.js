/*
 * Copyright (C) 2013 Adnane Belmadiaf <daker@ubuntu.com>
 * License granted by Canonical Limited
 *
 * This file is part of ubuntu-html5-theme.
 *
 * This package is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as 
 * published by the Free Software Foundation; either version 3 of the 
 * License, or
 * (at your option) any later version.
 
 * This package is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 
 * You should have received a copy of the GNU Lesser General Public 
 * License along with this program. If not, see 
 * <http://www.gnu.org/licenses/>.
 */

var FEED_LOCAL_STORAGE_KEY = "my-data-feeds";

var UI = new UbuntuUI();

var data_feeds = {
    'this.is.a.feed': {entries: [
	{title: 'My feed content', link: 'http://www.ubuntu.com', content: 'This is my feed'},
	{title: 'My feed content2', link: 'http://www.ubuntu.com', content: 'This is my feed2'},
	{title: 'My feed content3', link: 'http://www.ubuntu.com', content: 'This is my feed3'}
    ]},
    'this.is.another.feed': {entries: [
	{title: 'My other feed content', link: 'http://www.ubuntu.com', content: 'This is my other feed'},
	{title: 'My other feed content2', link: 'http://www.ubuntu.com', content: 'This is my other feed2'},
	{title: 'My other feed content3', link: 'http://www.ubuntu.com', content: 'This is my other feed3'}
    ]}
};

function Feed(url) {
    this.url = url;
}
Feed.prototype = {
    setNumEntries: function (count) {},
    load: function(callback) {
	callback({feed: data_feeds[this.url]});
    }
}


$(document).ready(function () {

    UI.init();
    UI.pagestack.push("main");

    if (typeof localStorage[FEED_LOCAL_STORAGE_KEY] == "undefined") {
        restoreDefault();
    }
    //load local storage feeds
    var feeds = eval(localStorage[FEED_LOCAL_STORAGE_KEY]);
    var myfeeds = null;
    if (feeds !== null) {
        myfeeds = "<header>My feeds</header><ul>";
        for (var i = 0; i < feeds.length; i++) {
            myfeeds += '<li><a href="#" onclick="loadFeed(\'' + feeds[i] + '\');">' + feeds[i] + '</a></li>';
        }
        myfeeds += "</ul>";
        $("#yourfeeds").html(myfeeds);
    }

    UI.button('yes').click(function (e) {
        var url = $("#rssFeed").val();
        if (url === "") {
            if (!$("#addfeeddialog section").hasClass("shake")) {
                $("#addfeeddialog section").addClass("shake");
            } else {
                $('#addfeeddialog section').css('animation-name', 'none');
                $('#addfeeddialog section').css('-moz-animation-name', 'none');
                $('#addfeeddialog section').css('-webkit-animation-name', 'none');

                setTimeout(function () {
                    $('#addfeeddialog section').css('-webkit-animation-name', 'shake');
                }, 0);
            }
        } else {
            var feeds = eval(localStorage[FEED_LOCAL_STORAGE_KEY]);
            feeds.push(url);
            localStorage.setItem(FEED_LOCAL_STORAGE_KEY, JSON.stringify(feeds));
            window.location.reload();
        }
    });

    UI.button('addfeed').click(function () {
        $('#addfeeddialog').show();
    });

    UI.button('no').click(function () {
        $('#addfeeddialog').hide();
    });
});

//FUNCS

function restoreDefault() {
    localStorage.clear();
    var feeds = [];
    for (var feed in data_feeds) {
	if (data_feeds.hasOwnProperty(feed)) {
	    feeds.push(feed);
	}
    }
    try {
        localStorage.setItem(FEED_LOCAL_STORAGE_KEY, JSON.stringify(feeds));
        window.location.reload();
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            console.log("Error: Local Storage limit exceeds.");
        } else {
            console.log("Error: Saving to local storage.");
        }
    }
}

function loadFeed(url) {
    UI.pagestack.push("results");

    UI.dialog("loading").show();

    var feed = new Feed(url);
    feed.setNumEntries(30);
    feed.load(function (result) {
        if (!result.error) {
            myfeeds_items = "<header>" + result.feed.title + "</header><ul>";
            for (var i = 0; i < result.feed.entries.length; i++) {
                myfeeds_items += '<li><a href="#" onclick=\'showArticle("' + escape(result.feed.entries[i].title) + '","' + escape(result.feed.entries[i].link) + '","' + escape(result.feed.entries[i].content) + '")\'>' + result.feed.entries[i].title.replace(/"/g, "'") + '</a></li>';
            }
            myfeeds_items += "</ul>";
            UI.dialog("loading").hide();
            $("#resultscontent").html(myfeeds_items);
        } else
            alert('feed error');
    });
}

function showArticle(title, url, desc) {
    UI.pagestack.push("article");

    if (typeof desc == "undefined")
        desc = "(No description provided)";
    $("#articleinfo").html("<p>" + unescape(title) + "</p><p>" + unescape(desc) + "</p><p><a target=\"_blank\" href=\"" + unescape(url) + "\">" + unescape(url) + "</a></p>");

}

