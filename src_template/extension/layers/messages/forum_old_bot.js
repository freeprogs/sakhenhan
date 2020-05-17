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

    function OptionsFacade() {
        this.optionsBot = {};
        this.ports = {};
    }

    OptionsFacade.prototype.createConnection = function () {
        var port = browser.runtime.connect({name: "background-options-forumold-bot"});
        port.onMessage.addListener((message) => {
            if (message.command == "setoption") {
                this.optionsBot.unhideBotMessages = message.value;
            }
        });
        this.ports.optionsStorage = port;
        return this;
    };

    OptionsFacade.prototype.update = function () {
        this.ports.optionsStorage.postMessage({
            "command": "getoption",
            "name": "OptionForumUnhideBotMessages"
        });
        return this;
    };

    OptionsFacade.prototype.optionUnhideBotMessagesIsEnabled = function () {
        return this.optionsBot.unhideBotMessages;
    };

    function PostFacade(node) {
        this.node = node;
    }

    PostFacade.prototype.unhideBotMessage = function () {
        if (this.node.isProcessed_unhideBotMessage) {
            return true;
        }
        else {
            this.node.isProcessed_unhideBotMessage = true;
        }
        var colNode = this.node.querySelector("td");
        var spanNodes = colNode.querySelectorAll("span");
        if (spanNodes.length > 1
            && spanNodes[1].querySelector("i span")
            .title.startsWith("Программа или человек")) {
            spanNodes[0].style.display = "block";
            spanNodes[1].style.display = "none";

            (function addBotMark(node) {
                var colNode = node.querySelectorAll("tr")[1]
                    .querySelector("td");
                var newSpan = document.createElement("span");
                var newImage = document.createElement("img");

                newSpan.classList.add("botmark");
                newSpan.style.paddingLeft = "1em";

                newImage.src = browser.runtime.getURL("icons/__PROGRAM_NAME__-botmark.svg");
                newImage.style.width = "0.7em";

                newSpan.appendChild(newImage);
                colNode.appendChild(newSpan);
                return true;
            })(this.node);

        }
        return true;
    }

    function processPosts(options) {
        var allTables = document.getElementsByTagName("table");
        var postTables = Array.from(allTables).filter((i) => {
            var cond1 = /^t_rep_a_id/.test(i.id);
            var cond2 = !i.querySelector("span.gr");
            return cond1 && cond2;
        });
        var wrappedPosts = Array.from(postTables).map((i) => {
            return new PostFacade(i);
        });
        wrappedPosts.forEach((i) => {
            if (options.optionUnhideBotMessagesIsEnabled()) {
                i.unhideBotMessage();
            }
        });
    }

    var options = (new OptionsFacade()).createConnection();

    setInterval(() => {
        options.update();
        setTimeout(() => {
            processPosts(options);
        }, 100);
    }, 100);

})();
