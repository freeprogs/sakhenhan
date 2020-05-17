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
        this.optionsTvMovie = {};
        this.ports = {};
    }

    OptionsFacade.prototype.createConnection = function () {
        var port = browser.runtime.connect({name: "background-options-video-sakhalin-tv"});
        port.onMessage.addListener((message) => {
            if (message.command == "setoption") {
                this.optionsTvMovie.replacePlayer = message.value;
            }
        });
        this.ports.optionsStorage = port;
        return this;
    };

    OptionsFacade.prototype.update = function () {
        this.ports.optionsStorage.postMessage({
            "command": "getoption",
            "name": "OptionVideoReplacePlayerSakhalinTv"
        });
        return this;
    };

    OptionsFacade.prototype.optionReplacePlayerIsEnabled = function () {
        return this.optionsTvMovie.replacePlayer;
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
        var videoEmbedUrl = document.baseURI.replace("movie", "embed");

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
        var oldVideoFrame = this.node.querySelector("div#player-target");
        var newVideoFrame = document.createElement("div");
        var newVideoNode = document.createElement("video");

        oldVideoFrame.remove();

        newVideoFrame.classList.add("video");

        newVideoNode.setAttribute("width", "100%");
        newVideoNode.setAttribute("height", "480");
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

    function processVideoFrame(options) {
        var videoFrame = document.querySelector("div#player-wrapper");
        var wrappedVideoFrame = new VideoFrameFacade(videoFrame);
        if (options.optionReplacePlayerIsEnabled()) {
            wrappedVideoFrame.loadPlayerConfig();
            wrappedVideoFrame.addNewPlayerFrame();
            wrappedVideoFrame.node.addEventListener("loaded_player_config", (e) => {
                wrappedVideoFrame.setConfigToNewPlayer();
            });
        }
    }

    var options = (new OptionsFacade()).createConnection();

    setTimeout(() => {
        options.update();
        setTimeout(() => {
            processVideoFrame(options);
        }, 100);
    }, 100);

})();
