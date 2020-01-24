
"use strict";

(function () {

    function OptionsFacade() {
        this.optionsUsers = {};
        this.ports = {};
    }

    OptionsFacade.prototype.createConnection = function () {
        var port = browser.runtime.connect({name: "background-options-forumold-users"});
        port.onMessage.addListener((message) => {
            if (message.command == "setoption") {
                this.optionsUsers.unhideUsersMessages = message.value;
            }
        });
        this.ports.optionsStorage = port;
        return this;
    };

    OptionsFacade.prototype.update = function () {
        this.ports.optionsStorage.postMessage({
            "command": "getoption",
            "name": "OptionForumUnhideUsersMessages"
        });
        return this;
    };

    OptionsFacade.prototype.optionUnhideUsersMessagesIsEnabled = function () {
        return this.optionsUsers.unhideUsersMessages;
    };

    function PostFacade(node) {
        this.node = node;
    }

    PostFacade.prototype.unhideUsersMessage = function () {
        if (this.node.isProcessed_unhideUsersMessage) {
            return true;
        }
        else {
            this.node.isProcessed_unhideUsersMessage = true;
        }
        var colNode = this.node.querySelector("td");
        var spanNodes = colNode.querySelectorAll("span");

        if (spanNodes.length > 1
            && spanNodes[1].querySelector("i")
            .innerText.includes("скрыто пользователями")) {
            spanNodes[0].style.display = "block";
            spanNodes[1].style.display = "none";

            (function addUsersMark(node) {
                var colNode = node.querySelectorAll("tr")[1]
                    .querySelector("td");
                var newSpan = document.createElement("span");
                var newImage = document.createElement("img");

                newSpan.classList.add("usersmark");
                newSpan.style.paddingLeft = "1em";

                newImage.src = browser.runtime.getURL("icons/sakhcom_enhancer-usersmark.svg");
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
            if (options.optionUnhideUsersMessagesIsEnabled()) {
                i.unhideUsersMessage();
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
