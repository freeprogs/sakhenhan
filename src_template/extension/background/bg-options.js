/*
 * This file is a part of __PROGRAM_NAME__ __PROGRAM_VERSION__
 *
 * __PROGRAM_COPYRIGHT__ __PROGRAM_AUTHOR__ __PROGRAM_AUTHOR_EMAIL__
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

"use strict";

(function () {

    const DEFAULT_OPTION_FORUM_ENABLE_POST_LIKES = true;
    const DEFAULT_OPTION_FORUM_UNHIDE_BOT_MESSAGES = true;
    const DEFAULT_OPTION_FORUM_UNHIDE_AUTHOR_MESSAGES = true;
    const DEFAULT_OPTION_FORUM_UNHIDE_USERS_MESSAGES = true;

    const DEFAULT_OPTION_VIDEO_REPLACE_PLAYER_SAKHALIN_INFO = true;
    const DEFAULT_OPTION_VIDEO_REPLACE_PLAYER_SAKHALIN_TV = true;
    const DEFAULT_OPTION_VIDEO_REPLACE_PLAYER_AFISHA_SAKH_COM = true;

    var ports = {};

    function setGetOptionHandler(port) {
        port.onMessage.addListener((message) => {
            if (message.command == "getoption") {
                function onError(error) {
                    console.log(`Error: ${error}`);
                }
                function onGot(item) {
                    port.postMessage({
                        command: "setoption",
                        name: message.name,
                        value: item[message.name]
                    });
                }
                var getting = browser.storage.local.get(message.name);
                getting.then(onGot, onError);
            }
        });
        return port;
    }

    function setSetGetOptionHandler(port) {
        port.onMessage.addListener((message) => {
            if (message.command == "getoption") {
                function onError(error) {
                    console.log(`Error: ${error}`);
                }
                function onGot(item) {
                    port.postMessage({
                        command: "setoption",
                        name: message.name,
                        value: item[message.name]
                    });
                }
                var getting = browser.storage.local.get(message.name);
                getting.then(onGot, onError);
            }
            else if (message.command = "setoption") {
                var dict = {};
                dict[message.name] = message.value;
                browser.storage.local.set(dict);
            }
        });
        return port;
    }

    function setConnectHandler() {
        browser.runtime.onConnect.addListener((port) => {
            if (port.name == "background-options-settings-page") {
                ports.settingsPage = setSetGetOptionHandler(port);
            }
            else if (port.name == "background-options-forumold-likes") {
                ports.contentForumOldLikes = setGetOptionHandler(port);
            }
            else if (port.name == "background-options-forumold-bot") {
                ports.contentForumOldBot = setGetOptionHandler(port);
            }
            else if (port.name == "background-options-forumold-author") {
                ports.contentForumOldAuthor = setGetOptionHandler(port);
            }
            else if (port.name == "background-options-forumold-users") {
                ports.contentForumOldUsers = setGetOptionHandler(port);
            }
            else if (port.name == "background-options-video-sakhalin-info") {
                ports.contentVideoSakhalinInfo = setGetOptionHandler(port);
            }
            else if (port.name == "background-options-video-sakhalin-tv") {
                ports.contentVideoSakhalinTv = setGetOptionHandler(port);
            }
            else if (port.name == "background-options-video-sakhalin-tv-embed") {
                ports.contentVideoSakhalinTvEmbed = setGetOptionHandler(port);
            }
            else if (port.name == "background-options-video-afisha") {
                ports.contentVideoAfisha = setGetOptionHandler(port);
            }
        });
    }

    function setDefaultOptionValues() {
        browser.storage.local.set({
            OptionForumEnablePostLikes:
                DEFAULT_OPTION_FORUM_ENABLE_POST_LIKES,
            OptionForumUnhideBotMessages:
                DEFAULT_OPTION_FORUM_UNHIDE_BOT_MESSAGES,
            OptionForumUnhideAuthorMessages:
                DEFAULT_OPTION_FORUM_UNHIDE_AUTHOR_MESSAGES,
            OptionForumUnhideUsersMessages:
                DEFAULT_OPTION_FORUM_UNHIDE_USERS_MESSAGES,
            OptionVideoReplacePlayerSakhalinInfo:
                DEFAULT_OPTION_VIDEO_REPLACE_PLAYER_SAKHALIN_INFO,
            OptionVideoReplacePlayerSakhalinTv:
                DEFAULT_OPTION_VIDEO_REPLACE_PLAYER_SAKHALIN_TV,
            OptionVideoReplacePlayerAfishaSakhCom:
                DEFAULT_OPTION_VIDEO_REPLACE_PLAYER_AFISHA_SAKH_COM
        });
    };

    function tryFirstRun() {
        function onError(error) {
            console.log(`Error: ${error}`);
        }
        function onGot(item) {
            if (!item.WasFirstRun) {
                browser.storage.local.set({
                    WasFirstRun: true
                });
                setDefaultOptionValues();
            }
        }
        var getting = browser.storage.local.get("WasFirstRun");
        getting.then(onGot, onError);
    }

    setConnectHandler();

    tryFirstRun();

})();
