
"use strict";

(function () {

    function OptionsFacade() {
        this.optionsSettings = {};
        this.ports = {};
    }

    OptionsFacade.prototype.createConnection = function () {
        var port = browser.runtime.connect({name: "background-options-settings-page"});
        port.onMessage.addListener((message) => {
            if (message.command == "setoption") {
                this.optionsSettings[message.name] = message.value;
            }
        });
        this.ports.optionsStorage = port;
        return this;
    };

    OptionsFacade.prototype.update = function () {
        this.ports.optionsStorage.postMessage({
            command: "getoption",
            name: "OptionForumEnablePostLikes"
        });
        this.ports.optionsStorage.postMessage({
            command: "getoption",
            name: "OptionForumUnhideBotMessages"
        });
        this.ports.optionsStorage.postMessage({
            command: "getoption",
            name: "OptionForumUnhideAuthorMessages"
        });
        this.ports.optionsStorage.postMessage({
            command: "getoption",
            name: "OptionForumUnhideUsersMessages"
        });
        this.ports.optionsStorage.postMessage({
            command: "getoption",
            name: "OptionVideoReplacePlayerSakhalinInfo"
        });
        this.ports.optionsStorage.postMessage({
            command: "getoption",
            name: "OptionVideoReplacePlayerSakhalinTv"
        });
        this.ports.optionsStorage.postMessage({
            command: "getoption",
            name: "OptionVideoReplacePlayerAfishaSakhCom"
        });
        return this;
    };

    OptionsFacade.prototype.setOptionForumEnablePostLikes = function (value) {
        this.ports.optionsStorage.postMessage({
            command: "setoption",
            name: "OptionForumEnablePostLikes",
            value: value
        });
    }

    OptionsFacade.prototype.setOptionForumUnhideBotMessages = function (value) {
        this.ports.optionsStorage.postMessage({
            command: "setoption",
            name: "OptionForumUnhideBotMessages",
            value: value
        });
    }

    OptionsFacade.prototype.setOptionForumUnhideAuthorMessages = function (value) {
        this.ports.optionsStorage.postMessage({
            command: "setoption",
            name: "OptionForumUnhideAuthorMessages",
            value: value
        });
    }

    OptionsFacade.prototype.setOptionForumUnhideUsersMessages = function (value) {
        this.ports.optionsStorage.postMessage({
            command: "setoption",
            name: "OptionForumUnhideUsersMessages",
            value: value
        });
    }

    OptionsFacade.prototype.setOptionVideoReplacePlayerSakhalinInfo = function (value) {
        this.ports.optionsStorage.postMessage({
            command: "setoption",
            name: "OptionVideoReplacePlayerSakhalinInfo",
            value: value
        });
    }

    OptionsFacade.prototype.setOptionVideoReplacePlayerSakhalinTv = function (value) {
        this.ports.optionsStorage.postMessage({
            command: "setoption",
            name: "OptionVideoReplacePlayerSakhalinTv",
            value: value
        });
    }

    OptionsFacade.prototype.setOptionVideoReplacePlayerAfishaSakhCom = function (value) {
        this.ports.optionsStorage.postMessage({
            command: "setoption",
            name: "OptionVideoReplacePlayerAfishaSakhCom",
            value: value
        });
    }

    OptionsFacade.prototype.optionForumEnablePostLikesIsEnabled = function () {
        return this.optionsSettings.OptionForumEnablePostLikes;
    };

    OptionsFacade.prototype.optionForumUnhideBotMessagesIsEnabled = function () {
        return this.optionsSettings.OptionForumUnhideBotMessages;
    };

    OptionsFacade.prototype.optionForumUnhideAuthorMessagesIsEnabled = function () {
        return this.optionsSettings.OptionForumUnhideAuthorMessages;
    };

    OptionsFacade.prototype.optionForumUnhideUsersMessagesIsEnabled = function () {
        return this.optionsSettings.OptionForumUnhideUsersMessages;
    };

    OptionsFacade.prototype.optionVideoReplacePlayerSakhalinInfoIsEnabled = function () {
        return this.optionsSettings.OptionVideoReplacePlayerSakhalinInfo;
    };

    OptionsFacade.prototype.optionVideoReplacePlayerSakhalinTvIsEnabled = function () {
        return this.optionsSettings.OptionVideoReplacePlayerSakhalinTv;
    };

    OptionsFacade.prototype.optionVideoReplacePlayerAfishaSakhComIsEnabled = function () {
        return this.optionsSettings.OptionVideoReplacePlayerAfishaSakhCom;
    };

    function restoreOptions(options) {
        options.update();
        setTimeout(() => {
            document.querySelector("#checkbox-optforum-enabpostlikes").checked =
                options.optionForumEnablePostLikesIsEnabled() || false;
            document.querySelector("#checkbox-optforum-unhbotmes").checked =
                options.optionForumUnhideBotMessagesIsEnabled() || false;
            document.querySelector("#checkbox-optforum-unhauthmes").checked =
                options.optionForumUnhideAuthorMessagesIsEnabled() || false;
            document.querySelector("#checkbox-optforum-unhusrshmes").checked =
                options.optionForumUnhideUsersMessagesIsEnabled() || false;
            document.querySelector("#checkbox-optvideo-sakhinfo").checked =
                options.optionVideoReplacePlayerSakhalinInfoIsEnabled() || false;
            document.querySelector("#checkbox-optvideo-sakhtv").checked =
                options.optionVideoReplacePlayerSakhalinTvIsEnabled() || false;
            document.querySelector("#checkbox-optvideo-sakhafisha").checked =
                options.optionVideoReplacePlayerAfishaSakhComIsEnabled() || false;
        }, 100);
    }

    function saveOptions(options) {
        options.setOptionForumEnablePostLikes(
            document.querySelector("#checkbox-optforum-enabpostlikes").checked);
        options.setOptionForumUnhideBotMessages(
            document.querySelector("#checkbox-optforum-unhbotmes").checked);
        options.setOptionForumUnhideAuthorMessages(
            document.querySelector("#checkbox-optforum-unhauthmes").checked);
        options.setOptionForumUnhideUsersMessages(
            document.querySelector("#checkbox-optforum-unhusrshmes").checked);
        options.setOptionVideoReplacePlayerSakhalinInfo(
            document.querySelector("#checkbox-optvideo-sakhinfo").checked);
        options.setOptionVideoReplacePlayerSakhalinTv(
            document.querySelector("#checkbox-optvideo-sakhtv").checked);
        options.setOptionVideoReplacePlayerAfishaSakhCom(
            document.querySelector("#checkbox-optvideo-sakhafisha").checked);
    }

    function setDefaultOptionValues() {
        document.querySelector("#checkbox-optforum-enabpostlikes").checked = true;
        document.querySelector("#checkbox-optforum-unhbotmes").checked = true;
        document.querySelector("#checkbox-optforum-unhauthmes").checked = true;
        document.querySelector("#checkbox-optforum-unhusrshmes").checked = true;
        document.querySelector("#checkbox-optvideo-sakhinfo").checked = true;
        document.querySelector("#checkbox-optvideo-sakhtv").checked = true;
        document.querySelector("#checkbox-optvideo-sakhafisha").checked = true;
    }

    var options = (new OptionsFacade()).createConnection();

    document.addEventListener("DOMContentLoaded", (e) => {
        restoreOptions(options);
    });
    document.querySelector(".options-defaultbutton").addEventListener("click", (e) => {
        e.preventDefault();
        setDefaultOptionValues();
    });
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        saveOptions(options);
    });

})();
