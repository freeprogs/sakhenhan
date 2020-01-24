
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
        var postTables = Array.filter(allTables, (i) => {
            var cond1 = /^t_rep_a_id/.test(i.id);
            var cond2 = !i.querySelector("span.gr");
            return cond1 && cond2;
        });
        var wrappedPosts = Array.map(postTables, (i) => {
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
