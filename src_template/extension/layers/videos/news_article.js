
"use strict";

(function () {

    function OptionsFacade() {
        this.optionsNewsArticle = {};
        this.ports = {};
    }

    OptionsFacade.prototype.createConnection = function () {
        var port = browser.runtime.connect({name: "background-options-video-sakhalin-info"});
        port.onMessage.addListener((message) => {
            if (message.command == "setoption") {
                this.optionsNewsArticle.replacePlayer = message.value;
            }
        });
        this.ports.optionsStorage = port;
        return this;
    };

    OptionsFacade.prototype.update = function () {
        this.ports.optionsStorage.postMessage({
            "command": "getoption",
            "name": "OptionVideoReplacePlayerSakhalinInfo"
        });
        return this;
    };

    OptionsFacade.prototype.optionReplacePlayerIsEnabled = function () {
        return this.optionsNewsArticle.replacePlayer;
    };

    function VideoFrameFacade(node) {
        this.node = node;
    }

    VideoFrameFacade.prototype.loadPlayerConfig = function () {
        if (this.node.isProcessed_loadPlayerConfig) {
            return true;
        }
        else {
            this.node.isProcessed_loadPlayerConfig = true;
        }
        var videoEmbedUrl = this.node.querySelector("iframe").src;

        var thisObj = this;

        var req = new XMLHttpRequest();
        req.open("GET", videoEmbedUrl, true);
        req.onload = function () {
            var newDoc = document.createElement("html");
            newDoc.innerHTML = this.responseText;

            var script = newDoc.querySelector("body > script")
            var scriptText = script.innerText;

            var configString = scriptText.match(/config = \{.+\};/)[0]
                .replace(/^config = /, "")
                .replace(/ \|\| \{\};/, "");
            var configStringObject = JSON.parse(configString);

            var sources;
            if (configStringObject.sources) {
                sources = configStringObject.sources;
            }
            else {
                sources = [
                    {
                        file: configStringObject.file,
                        label: "000"
                    }
                ]
            }

            var clearConfig = {
                image: configStringObject.image,
                sources: sources
            };
            thisObj.replacedVideo = {};
            thisObj.replacedVideo.config = clearConfig;
            thisObj.node.dispatchEvent(new Event("loaded_player_config"));
        };
        req.send();
    };

    VideoFrameFacade.prototype.addNewPlayerFrame = function () {
        if (this.node.isProcessed_addNewPlayerFrame) {
            return true;
        }
        else {
            this.node.isProcessed_addNewPlayerFrame = true;
        }
        var oldVideoFrame = this.node.querySelector("iframe");
        var newVideoFrame = document.createElement("div");
        var newVideoNode = document.createElement("video");

        oldVideoFrame.style.display = "none";

        newVideoFrame.classList.add(".video");

        newVideoNode.setAttribute("width", "750");
        newVideoNode.setAttribute("height", "422");
        newVideoNode.setAttribute("controls", "controls");
        newVideoNode.style.backgroundColor = "black";

        newVideoFrame.appendChild(newVideoNode);
        this.node.appendChild(newVideoFrame);
    };

    VideoFrameFacade.prototype.setConfigToNewPlayer = function () {
        if (this.node.isProcessed_setConfigToNewPlayer) {
            return true;
        }
        else {
            this.node.isProcessed_setConfigToNewPlayer = true;
        }
        var newVideoNode = this.node.querySelector("video");
        var newVideoSourceNode = document.createElement("source");
        var numberOfVideos = this.replacedVideo.config.sources.length;

        newVideoNode.setAttribute(
            "poster", this.replacedVideo.config.image);
        newVideoSourceNode.setAttribute(
            "src", this.replacedVideo.config.sources[numberOfVideos - 1].file);

        newVideoNode.appendChild(newVideoSourceNode);
    };

    function processVideoFrames(options) {
        var videoFrames = document.querySelectorAll(
            ".article-video.video-sakhalin-tv");
        var wrappedVideoFrames = Array.map(videoFrames, (i) => {
            return new VideoFrameFacade(i);
        });
        wrappedVideoFrames.forEach((i) => {
            if (options.optionReplacePlayerIsEnabled()) {
                i.loadPlayerConfig();
                i.addNewPlayerFrame();
                i.node.addEventListener("loaded_player_config", (e) => {
                    i.setConfigToNewPlayer();
                });
            }
        });
    }

    var options = (new OptionsFacade()).createConnection();

    setTimeout(() => {
        options.update();
        setTimeout(() => {
            processVideoFrames(options);
        }, 100);
    }, 100);

})();