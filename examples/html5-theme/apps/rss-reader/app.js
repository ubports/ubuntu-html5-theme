/*
 * Copyright (C) 2013 Adnane Belmadiaf <daker@ubuntu.com>
 * License granted by Canonical Limited
 *
 * This file is part of ubuntu-html5-ui-toolkit.
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
 * <http://www.gnu.org/licenses/>
 */

var UI = new UbuntuUI();

$(document).ready(function () {

    UI.init();
    UI.pagestack.push("main");

    if (typeof localStorage["feeds"] == "undefined") {
        restoreDefault();
    }
    //load local storage feeds
    var feeds = eval(localStorage["feeds"]);
    if (feeds !== null) {
	var feeds_list = UI.list('#yourfeeds');
	feeds_list.removeAllItems();
	feeds_list.setHeader('My feeds');

        for (var i = 0; i < feeds.length; i++) {
            feeds_list.append(feeds[i],
			      null,
			      null,
			      function (target, thisfeed) { loadFeed(thisfeed); },
			      feeds[i]);
        }
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
            var feeds = eval(localStorage["feeds"]);
            feeds.push(url);
            localStorage.setItem("feeds", JSON.stringify(feeds));
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
    feeds.push("http://daker.me/feed.xml");
    feeds.push("http://www.omgubuntu.co.uk/feed");
    feeds.push("http://hespress.com/feed/index.rss");
    feeds.push("http://rss.slashdot.org/Slashdot/slashdot");
    feeds.push("http://www.reddit.com/.rss");
    try {
        localStorage.setItem("feeds", JSON.stringify(feeds));
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

    var feed = new google.feeds.Feed(url);
    feed.setNumEntries(30);

    feed.load(function (result) {
        if (!result.error) {
            UI.dialog("loading").hide();

	    var results_list = UI.list('#resultscontent');
	    results_list.removeAllItems();
	    results_list.setHeader(result.feed.title);

            for (var i = 0; i < result.feed.entries.length; i++) {
		results_list.append(result.feed.entries[i].title.replace(/"/g, "'"),
				    null,
				    null,
				    function (target, result_infos) { showArticle.apply(null, result_infos); },
				    [escape(result.feed.entries[i].title), escape(result.feed.entries[i].link), escape(result.feed.entries[i].content)] );
            }
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

google.load("feeds", "1");
