
"use strict";

(function () {

    function OptionsFacade() {
        this.optionsLikes = {};
        this.ports = {};
    }

    OptionsFacade.prototype.createConnection = function () {
        var port = browser.runtime.connect({name: "background-options-forumold-likes"});
        port.onMessage.addListener((message) => {
            if (message.command == "setoption") {
                this.optionsLikes.enablePostLikes = message.value;
            }
        });
        this.ports.optionsStorage = port;
        return this;
    };

    OptionsFacade.prototype.update = function () {
        this.ports.optionsStorage.postMessage({
            "command": "getoption",
            "name": "OptionForumEnablePostLikes"
        });
        return this;
    };

    OptionsFacade.prototype.optionLikesIsEnabled = function () {
        return this.optionsLikes.enablePostLikes;
    };

    function TopPostFacade(node) {
        this.node = node;
    }

    TopPostFacade.prototype.addInfoPoint = function () {
        if (this.node.isProcessed_addInfoPoint) {
            return true;
        }
        else {
            this.node.isProcessed_addInfoPoint = true;
        }
        var colNode = this.node.querySelector("td.forummess3");
        var newSpan = document.createElement("span");
        var newImage = document.createElement("img");

        newSpan.classList.add("point");
        newSpan.style.paddingLeft = "1em";

        newImage.src = browser.runtime.getURL("icons/sakhcom_enhancer-circle-pink.svg");
        newImage.style.width = "0.7em";

        newSpan.appendChild(newImage);
        colNode.appendChild(newSpan);
        return true;
    };

    TopPostFacade.prototype.addInfoBar = function () {
        if (this.node.isProcessed_addInfoBar) {
            return true;
        }
        else {
            this.node.isProcessed_addInfoBar = true;
        }
        var tbodyNode = this.node.querySelector("tbody");
        var newRow = document.createElement("tr");
        var newColLeft = document.createElement("td");
        var newColRight = document.createElement("td");

        newColLeft.style.borderTop = "1px solid #ccc";
        newColLeft.style.backgroundColor = "#eee";
        newColLeft.innerHTML =
            '<span class="infobar"'
            + ' style="color: gray; padding-top: 0.5em">'
            + '</span>';

        newColRight.style.borderTop = "1px solid #ccc";
        newColRight.style.backgroundColor = "#eee";

        newRow.appendChild(newColLeft);
        newRow.appendChild(newColRight);
        tbodyNode.appendChild(newRow);
        return true;
    };

    TopPostFacade.prototype.addLikesBarToInfoBar = function () {
        if (this.node.isProcessed_addLikesBarToInfoBar) {
            return true;
        }
        else {
            this.node.isProcessed_addLikesBarToInfoBar = true;
        }
        var infoBarNode = this.node.querySelector(".infobar");
        var likesDivNode = document.createElement("div");
        var likesDivLeftNode = document.createElement("div");
        var likesDivRightNode = document.createElement("div");
        var dislikesDivNode = document.createElement("div");
        var dislikesDivLeftNode = document.createElement("div");
        var dislikesDivRightNode = document.createElement("div");
        var likesImage = document.createElement("img");
        var dislikesImage = document.createElement("img");

        likesDivNode.classList.add("likes");
        dislikesDivNode.classList.add("dislikes");

        likesImage.src = browser.runtime.getURL("icons/sakhcom_enhancer-likes-plus.svg");
        likesImage.style.width = "1.5em";

        dislikesImage.src = browser.runtime.getURL("icons/sakhcom_enhancer-likes-minus.svg");
        dislikesImage.style.width = "1.5em";

        likesDivRightNode.style.color = "black";
        likesDivRightNode.style.maxWidth = "40em";
        likesDivRightNode.style.paddingBottom = "0.5em";
        likesDivRightNode.style.whiteSpace = "nowrap"
        likesDivRightNode.style.overflow = "auto";

        dislikesDivRightNode.style.color = "black";
        dislikesDivRightNode.style.maxWidth = "40em";
        dislikesDivRightNode.style.paddingBottom = "0.5em";
        dislikesDivRightNode.style.whiteSpace = "nowrap"
        dislikesDivRightNode.style.overflow = "auto";

        likesDivLeftNode.appendChild(likesImage);
        dislikesDivLeftNode.appendChild(dislikesImage);
        likesDivNode.appendChild(likesDivLeftNode);
        likesDivNode.appendChild(likesDivRightNode);
        dislikesDivNode.appendChild(dislikesDivLeftNode);
        dislikesDivNode.appendChild(dislikesDivRightNode);
        infoBarNode.appendChild(likesDivNode);
        infoBarNode.appendChild(dislikesDivNode);
        return true;
    };

    TopPostFacade.prototype.bindPointWithInfoBar = function () {
        if (this.node.isProcessed_bindPointWithInfoBar) {
            return true;
        }
        else {
            this.node.isProcessed_bindPointWithInfoBar = true;
        }
        var pointNode = this.node.querySelector(".point");
        var infoBarNode = this.node.querySelector(".infobar");
        infoBarNode.isVisible = false;
        infoBarNode.style.display = "none";
        pointNode.addEventListener("click", (e) => {
            if (infoBarNode.isVisible) {
                infoBarNode.isVisible = false;
                infoBarNode.style.display = "none";
            }
            else {
                infoBarNode.isVisible = true;
                infoBarNode.style.display = "block";
                infoBarNode.dispatchEvent(new Event("asklikes"));
            }
        });
        return true;
    };

    TopPostFacade.prototype.bindInfoBarWithLikesBar = function () {
        if (this.node.isProcessed_bindInfoBarWithLikesBar) {
            return true;
        }
        else {
            this.node.isProcessed_bindInfoBarWithLikesBar = true;
        }
        var infoBarNode = this.node.querySelector(".infobar");

        function getLikesPageUrl(node) {
            var urlPrefix = "https://forum-beta.sakh.com/likes/thread/"
            var postId = node.querySelector("div").id.replace("mhid", "");
            return urlPrefix + postId + "/";
        }

        var likesUrl = getLikesPageUrl(this.node);

        infoBarNode.addEventListener("asklikes", (e) => {
            var likesReq = new XMLHttpRequest();
            likesReq.onload = function () {
                var newDoc = document.createElement("html");
                newDoc.innerHTML = this.responseText;

                var emotionsNode = newDoc.querySelector(".emotions");

                var likesNode = emotionsNode.querySelector(
                    "div.emotion-like ul.emotion-user-list");
                if (likesNode) {
                    var likeNodes = likesNode.querySelectorAll("li");
                    var likeValidNodes = Array.filter(likeNodes, (i) => {
                        return i.querySelector("a");
                    });
                    var likeUsers = Array.map(likeValidNodes, (i) => {
                        var hrefNode = i.querySelector("a");
                        var spanNode = i.querySelector("span");
                        var userName = hrefNode.getAttribute("data-id");
                        var userUrl = hrefNode.getAttribute("href");
                        var userColor;
                        if (spanNode.classList.contains("nick-f")) {
                            userColor = "#c37";
                        }
                        else if (spanNode.classList.contains("nick-m")) {
                            userColor = "#458abb";
                        }
                        else if (spanNode.classList.contains("nick-n")) {
                            userColor = "#555";
                        }
                        var out = '<a href="'
                            + userUrl
                            + '" style="color: '
                            + userColor
                            + '">'
                            + userName
                            + '</a>';
                        return out;
                    });
                    infoBarNode.querySelectorAll(
                        ".likes > div")[1].innerHTML = likeUsers.join("&nbsp;&nbsp;");
                }

                var dislikesNode = emotionsNode.querySelector(
                    "div.emotion-dislike ul.emotion-user-list");
                if (dislikesNode) {
                    var dislikeNodes = dislikesNode.querySelectorAll("li");
                    var dislikeValidNodes = Array.filter(dislikeNodes, (i) => {
                        return i.querySelector("a");
                    });
                    var dislikeUsers = Array.map(dislikeValidNodes, (i) => {
                        var hrefNode = i.querySelector("a");
                        var spanNode = i.querySelector("span");
                        var userName = hrefNode.getAttribute("data-id");
                        var userUrl = hrefNode.getAttribute("href");
                        var userColor;
                        if (spanNode.classList.contains("nick-f")) {
                            userColor = "#c37";
                        }
                        else if (spanNode.classList.contains("nick-m")) {
                            userColor = "#458abb";
                        }
                        else if (spanNode.classList.contains("nick-n")) {
                            userColor = "#555";
                        }
                        var out = '<a href="'
                            + userUrl
                            + '" style="color: '
                            + userColor
                            + '">'
                            + userName
                            + '</a>';
                        return out;
                    });
                    infoBarNode.querySelectorAll(
                        ".dislikes > div")[1].innerHTML = dislikeUsers.join("&nbsp;&nbsp;");
                }
            }
            likesReq.open("get", likesUrl, true);
            likesReq.send();

        });
        return true;
    }

    function PostFacade(node) {
        this.node = node;
    }

    PostFacade.prototype.addInfoPoint = function () {
        if (this.node.isProcessed_addInfoPoint) {
            return true;
        }
        else {
            this.node.isProcessed_addInfoPoint = true;
        }
        var colNode = this.node.querySelectorAll("tr > td")[1];
        var newSpan = document.createElement("span");
        var newImage = document.createElement("img");

        newSpan.classList.add("point");
        newSpan.style.paddingLeft = "1em";

        newImage.src = browser.runtime.getURL("icons/sakhcom_enhancer-circle-pink.svg");
        newImage.style.width = "0.7em";

        newSpan.appendChild(newImage);
        colNode.appendChild(newSpan);
        return true;
    };

    PostFacade.prototype.addInfoBar = function () {
        if (this.node.isProcessed_addInfoBar) {
            return true;
        }
        else {
            this.node.isProcessed_addInfoBar = true;
        }
        var tbodyNode = this.node.querySelector("tbody");
        var newRow = document.createElement("tr");
        var newColLeft = document.createElement("td");
        var newColRight = document.createElement("td");

        newColLeft.style.borderTop = "1px solid #ccc";
        newColLeft.style.backgroundColor = "#eee";
        newColLeft.innerHTML = '<span class="infobar"'
            + ' style="color: gray; padding-top: 0.5em">'
            + '</span>';

        newColRight.style.borderTop = "1px solid #ccc";
        newColRight.style.backgroundColor = "#eee";

        newRow.appendChild(newColLeft);
        newRow.appendChild(newColRight);
        tbodyNode.appendChild(newRow);
        return true;
    };

    PostFacade.prototype.addLikesBarToInfoBar = function () {
        if (this.node.isProcessed_addLikesBarToInfoBar) {
            return true;
        }
        else {
            this.node.isProcessed_addLikesBarToInfoBar = true;
        }
        var infoBarNode = this.node.querySelector(".infobar");
        var likesDivNode = document.createElement("div");
        var likesDivLeftNode = document.createElement("div");
        var likesDivRightNode = document.createElement("div");
        var dislikesDivNode = document.createElement("div");
        var dislikesDivLeftNode = document.createElement("div");
        var dislikesDivRightNode = document.createElement("div");
        var likesImage = document.createElement("img");
        var dislikesImage = document.createElement("img");

        likesDivNode.classList.add("likes");
        dislikesDivNode.classList.add("dislikes");

        likesImage.src = browser.runtime.getURL("icons/sakhcom_enhancer-likes-plus.svg");
        likesImage.style.width = "1.5em";

        dislikesImage.src = browser.runtime.getURL("icons/sakhcom_enhancer-likes-minus.svg");
        dislikesImage.style.width = "1.5em";

        likesDivRightNode.style.color = "black";
        likesDivRightNode.style.maxWidth = "40em";
        likesDivRightNode.style.paddingBottom = "0.5em";
        likesDivRightNode.style.whiteSpace = "nowrap"
        likesDivRightNode.style.overflow = "auto";

        dislikesDivRightNode.style.color = "black";
        dislikesDivRightNode.style.maxWidth = "40em";
        dislikesDivRightNode.style.paddingBottom = "0.5em";
        dislikesDivRightNode.style.whiteSpace = "nowrap"
        dislikesDivRightNode.style.overflow = "auto";

        likesDivLeftNode.appendChild(likesImage);
        dislikesDivLeftNode.appendChild(dislikesImage);
        likesDivNode.appendChild(likesDivLeftNode);
        likesDivNode.appendChild(likesDivRightNode);
        dislikesDivNode.appendChild(dislikesDivLeftNode);
        dislikesDivNode.appendChild(dislikesDivRightNode);
        infoBarNode.appendChild(likesDivNode);
        infoBarNode.appendChild(dislikesDivNode);
        return true;
    };

    PostFacade.prototype.bindPointWithInfoBar = function () {
        if (this.node.isProcessed_bindPointWithInfoBar) {
            return true;
        }
        else {
            this.node.isProcessed_bindPointWithInfoBar = true;
        }
        var pointNode = this.node.querySelector(".point");
        var infoBarNode = this.node.querySelector(".infobar");
        infoBarNode.isVisible = false;
        infoBarNode.style.display = "none";
        pointNode.addEventListener("click", (e) => {
            if (infoBarNode.isVisible) {
                infoBarNode.isVisible = false;
                infoBarNode.style.display = "none";
            }
            else {
                infoBarNode.isVisible = true;
                infoBarNode.style.display = "block";
                infoBarNode.dispatchEvent(new Event("asklikes"));
            }
        });
        return true;
    };

    PostFacade.prototype.bindInfoBarWithLikesBar = function () {
        if (this.node.isProcessed_bindInfoBarWithLikesBar) {
            return true;
        }
        else {
            this.node.isProcessed_bindInfoBarWithLikesBar = true;
        }
        var infoBarNode = this.node.querySelector(".infobar");

        function getLikesPageUrl(node) {
            var urlPrefix = "https://forum-beta.sakh.com/likes/reply/"
            var postId = node.id.replace("t_rep_a_id_", "");
            return urlPrefix + postId;
        }

        var likesUrl = getLikesPageUrl(this.node);

        infoBarNode.addEventListener("asklikes", (e) => {
            var likesReq = new XMLHttpRequest();
            likesReq.onload = function () {
                var newDoc = document.createElement("html");
                newDoc.innerHTML = this.responseText;

                var emotionsNode = newDoc.querySelector(".emotions");

                var likesNode = emotionsNode.querySelector(
                    "div.emotion-like ul.emotion-user-list");
                if (likesNode) {
                    var likeNodes = likesNode.querySelectorAll("li");
                    var likeValidNodes = Array.filter(likeNodes, (i) => {
                        return i.querySelector("a");
                    });
                    var likeUsers = Array.map(likeValidNodes, (i) => {
                        var hrefNode = i.querySelector("a");
                        var spanNode = i.querySelector("span");
                        var userName = hrefNode.getAttribute("data-id");
                        var userUrl = hrefNode.getAttribute("href");
                        var userColor;
                        if (spanNode.classList.contains("nick-f")) {
                            userColor = "#c37";
                        }
                        else if (spanNode.classList.contains("nick-m")) {
                            userColor = "#458abb";
                        }
                        else if (spanNode.classList.contains("nick-n")) {
                            userColor = "#555";
                        }
                        var out = '<a href="'
                            + userUrl
                            + '" style="color: '
                            + userColor
                            + '">'
                            + userName
                            + '</a>';
                        return out;
                    });
                    infoBarNode.querySelectorAll(
                        ".likes > div")[1].innerHTML = likeUsers.join("&nbsp;&nbsp;");
                }

                var dislikesNode = emotionsNode.querySelector(
                    "div.emotion-dislike ul.emotion-user-list");
                if (dislikesNode) {
                    var dislikeNodes = dislikesNode.querySelectorAll("li");
                    var dislikeValidNodes = Array.filter(dislikeNodes, (i) => {
                        return i.querySelector("a");
                    });
                    var dislikeUsers = Array.map(dislikeValidNodes, (i) => {
                        var hrefNode = i.querySelector("a");
                        var spanNode = i.querySelector("span");
                        var userName = hrefNode.getAttribute("data-id");
                        var userUrl = hrefNode.getAttribute("href");
                        var userColor;
                        if (spanNode.classList.contains("nick-f")) {
                            userColor = "#c37";
                        }
                        else if (spanNode.classList.contains("nick-m")) {
                            userColor = "#458abb";
                        }
                        else if (spanNode.classList.contains("nick-n")) {
                            userColor = "#555";
                        }
                        var out = '<a href="'
                            + userUrl
                            + '" style="color: '
                            + userColor
                            + '">'
                            + userName
                            + '</a>';
                        return out;
                    });
                    infoBarNode.querySelectorAll(
                        ".dislikes > div")[1].innerHTML = dislikeUsers.join("&nbsp;&nbsp;");
                }
            }
            likesReq.open("get", likesUrl, true);
            likesReq.send();

        });
        return true;
    }

    function processTopPost(options) {
        var topPostDiv = document.body.querySelector("div.forummess2");
        var wrappedTopPost = new TopPostFacade(topPostDiv);
        if (options.optionLikesIsEnabled()) {
            wrappedTopPost.addInfoPoint();
            wrappedTopPost.addInfoBar();
            wrappedTopPost.addLikesBarToInfoBar();
            wrappedTopPost.bindPointWithInfoBar();
            wrappedTopPost.bindInfoBarWithLikesBar();
        }
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
            if (options.optionLikesIsEnabled()) {
                i.addInfoPoint();
                i.addInfoBar();
                i.addLikesBarToInfoBar();
                i.bindPointWithInfoBar();
                i.bindInfoBarWithLikesBar();
            }
        });
    }

    var options = (new OptionsFacade()).createConnection();

    setInterval(() => {
        options.update();
        setTimeout(() => {
            processTopPost(options);
            processPosts(options);
        }, 100);
    }, 100);

})();
